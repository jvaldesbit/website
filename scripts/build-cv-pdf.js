// Genera el PDF descargable del CV a partir de cv.html (se ejecuta en cada deploy).
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'Julian-Valdes-Bello-CV.pdf');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files'],
  });
  const page = await browser.newPage();
  await page.goto('file://' + path.join(ROOT, 'cv.html'), { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: OUT, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log('CV PDF generado:', path.basename(OUT));
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
