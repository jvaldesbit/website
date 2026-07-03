const fs   = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const ROOT          = path.join(__dirname, '..');
const ARTICLES_DIR  = path.join(ROOT, 'articles');
const TEMPLATE_PATH = path.join(ROOT, 'templates', 'article.html');

// ── Marked: code renderer (mermaid + syntax highlight) ───────
marked.use({
  renderer: {
    code(text, lang) {
      if (lang === 'mermaid') {
        return `<div class="mermaid">${text}</div>`;
      }
      const language = lang || 'plaintext';
      const escaped = (text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<pre><code class="language-${language}">${escaped}</code></pre>`;
    }
  }
});

// ── Callout config ────────────────────────────────────────────
const CALLOUT = {
  NOTE:    { icon: 'fa-info-circle',         label: 'Nota',           cls: 'note'    },
  TIP:     { icon: 'fa-lightbulb',           label: 'Consejo',        cls: 'tip'     },
  KEY:     { icon: 'fa-key',                 label: 'Concepto clave', cls: 'key'     },
  WARNING: { icon: 'fa-exclamation-triangle', label: 'Atención',      cls: 'warning' },
  INSIGHT: { icon: 'fa-brain',               label: 'Reflexión',      cls: 'insight' },
};

function applyCallouts(html) {
  const types = Object.keys(CALLOUT).join('|');
  const re = new RegExp(
    `<blockquote>\\s*<p>\\[!(${types})\\](?:</p>)?([\\s\\S]*?)</blockquote>`,
    'gi'
  );
  return html.replace(re, (_, type, inner) => {
    const cfg = CALLOUT[type.toUpperCase()];
    const trimmed = inner.trim().replace(/<\/p>$/, '');
    const content = trimmed.startsWith('<p>') ? trimmed : `<p>${trimmed}</p>`;
    return `<div class="callout callout-${cfg.cls}">` +
      `<div class="callout-label"><i class="fas ${cfg.icon}"></i> ${cfg.label}</div>` +
      `<div class="callout-text">${content}</div>` +
      `</div>`;
  });
}

// ── Helpers ──────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00Z');
  return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
}

function readTime(content) {
  const words = content.replace(/```[\s\S]*?```/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function slugify(filename) {
  return filename.replace(/\.md$/, '');
}

// ── Main ─────────────────────────────────────────────────────
const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

const mdFiles = fs.readdirSync(ARTICLES_DIR)
  .filter(f => f.endsWith('.md'))
  .sort()
  .reverse();

const index = [];

for (const file of mdFiles) {
  const slug      = slugify(file);
  const raw       = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf-8');
  const { data: fm, content } = matter(raw);

  if (fm.published === false) {
    console.log(`⊘  articles/${slug}  (draft, skipped)`);
    continue;
  }

  const bodyHtml  = applyCallouts(marked(content));
  const mins      = fm.readTime || readTime(content);
  const dateFmt   = formatDate(fm.date);
  const tagsHtml  = (fm.tags || []).map(t => `<span class="a-tag">${t}</span>`).join('');
  const canonical = `https://jcvb.com.co/articles/${slug}`;

  const html = template
    .replace(/\{\{title\}\}/g,       fm.title       || slug)
    .replace(/\{\{description\}\}/g, fm.description || '')
    .replace(/\{\{date\}\}/g,        fm.date        || '')
    .replace(/\{\{dateFormatted\}\}/g, dateFmt)
    .replace(/\{\{readTime\}\}/g,    mins)
    .replace(/\{\{tags\}\}/g,        tagsHtml)
    .replace(/\{\{content\}\}/g,     bodyHtml)
    .replace(/\{\{slug\}\}/g,        slug)
    .replace(/\{\{canonical\}\}/g,   canonical)
    .replace(/\{\{author\}\}/g,      fm.author || 'Julián Valdés Bello');

  const outDir = path.join(ARTICLES_DIR, slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');

  console.log(`✓  articles/${slug}/index.html`);

  index.push({
    slug,
    title:       fm.title       || slug,
    description: fm.description || '',
    date:        fm.date        || '',
    dateFormatted: dateFmt,
    tags:        fm.tags        || [],
    readTime:    mins,
  });
}

// Sort newest first
index.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(
  path.join(ARTICLES_DIR, 'index.json'),
  JSON.stringify(index, null, 2),
  'utf-8'
);

console.log(`✓  articles/index.json  (${index.length} article${index.length !== 1 ? 's' : ''})`);
