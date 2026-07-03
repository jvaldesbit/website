const fs   = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const puppeteer = require('puppeteer');

const ROOT             = path.join(__dirname, '..');
const ARTICLES_DIR     = path.join(ROOT, 'articles');
const TEMPLATE_PATH    = path.join(ROOT, 'templates', 'article.html');
const OG_TEMPLATE_PATH = path.join(ROOT, 'templates', 'og-image.html');

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
  const codeBlocks = (content.match(/```[\s\S]*?```/g) || []).join(' ');
  const codeWords  = codeBlocks.split(/\s+/).filter(Boolean).length;
  const textWords  = content.replace(/```[\s\S]*?```/g, '').split(/\s+/).filter(Boolean).length;
  // Technical prose: 160 wpm · code blocks: 80 wpm (slower to parse)
  return Math.max(1, Math.ceil(textWords / 160 + codeWords / 80));
}

function slugify(filename) {
  return filename.replace(/\.md$/, '');
}

// ── OG Image generator ───────────────────────────────────────
async function generateOGImage(browser, slug, title, description, tags) {
  const ogTemplate = fs.readFileSync(OG_TEMPLATE_PATH, 'utf-8');
  const tagsHtml = tags.map(t => `<span class="tag">${t}</span>`).join('');
  const html = ogTemplate
    .replace('{{title}}',       title)
    .replace('{{description}}', description)
    .replace('{{tags}}',        tagsHtml);

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const outPath = path.join(ARTICLES_DIR, slug, 'og-image.png');
  await page.screenshot({ path: outPath, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await page.close();
  return outPath;
}

// ── Main ─────────────────────────────────────────────────────
(async () => {
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

  const mdFiles = fs.readdirSync(ARTICLES_DIR)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse();

  const index = [];

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  for (const file of mdFiles) {
    const slug      = slugify(file);
    const raw       = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf-8');
    const { data: fm, content } = matter(raw);

    if (fm.published === false) {
      console.log(`⊘  articles/${slug}  (draft, skipped)`);
      continue;
    }

    const outDir = path.join(ARTICLES_DIR, slug);
    fs.mkdirSync(outDir, { recursive: true });

    const bodyHtml  = applyCallouts(marked(content));
    const mins      = fm.readTime || readTime(content);
    const dateFmt   = formatDate(fm.date);
    const tagsHtml  = (fm.tags || []).map(t => `<span class="a-tag">${t}</span>`).join('');
    const canonical = `https://jcvb.com.co/articles/${slug}`;

    // OG image: frontmatter override → auto-generated → site fallback
    let ogImage;
    if (fm.image) {
      ogImage = fm.image.startsWith('http') ? fm.image : `https://jcvb.com.co/${fm.image}`;
    } else {
      await generateOGImage(browser, slug, fm.title || slug, fm.description || '', fm.tags || []);
      ogImage = `https://jcvb.com.co/articles/${slug}/og-image.png`;
      console.log(`  ↳  og-image.png`);
    }

    const html = template
      .replace(/\{\{title\}\}/g,         fm.title       || slug)
      .replace(/\{\{description\}\}/g,   fm.description || '')
      .replace(/\{\{date\}\}/g,          fm.date        || '')
      .replace(/\{\{dateFormatted\}\}/g, dateFmt)
      .replace(/\{\{readTime\}\}/g,      mins)
      .replace(/\{\{tags\}\}/g,          tagsHtml)
      .replace(/\{\{content\}\}/g,       bodyHtml)
      .replace(/\{\{slug\}\}/g,          slug)
      .replace(/\{\{canonical\}\}/g,     canonical)
      .replace(/\{\{ogImage\}\}/g,       ogImage)
      .replace(/\{\{author\}\}/g,        fm.author || 'Julián Valdés Bello');

    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
    console.log(`✓  articles/${slug}/index.html`);

    index.push({
      slug,
      title:         fm.title       || slug,
      description:   fm.description || '',
      date:          fm.date        || '',
      dateFormatted: dateFmt,
      tags:          fm.tags        || [],
      readTime:      mins,
    });
  }

  await browser.close();

  // Sort newest first
  index.sort((a, b) => new Date(b.date) - new Date(a.date));

  fs.writeFileSync(
    path.join(ARTICLES_DIR, 'index.json'),
    JSON.stringify(index, null, 2),
    'utf-8'
  );

  console.log(`✓  articles/index.json  (${index.length} article${index.length !== 1 ? 's' : ''})`);
})();
