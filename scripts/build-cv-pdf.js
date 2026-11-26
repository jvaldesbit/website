// Genera los PDFs descargables del CV (ES y EN) a partir de cv.html (se ejecuta en cada deploy).
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = path.join(__dirname, '..');
const TARGETS = [
  ['cv.html', 'Julian-Valdes-Bello-CV.pdf'],
  ['cv-en.html', 'Julian-Valdes-Bello-CV-EN.pdf'],
];

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files'],
  });
  for (const [src, out] of TARGETS) {
    const page = await browser.newPage();
    await page.goto('file://' + path.join(ROOT, src), { waitUntil: 'networkidle0', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: path.join(ROOT, out), format: 'A4', printBackground: true, preferCSSPageSize: true });
    await page.close();
    console.log('CV PDF generado:', out);
  }
  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
