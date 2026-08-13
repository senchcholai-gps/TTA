const puppeteer = require('puppeteer');
const ARTIFACT_DIR = 'C:/Users/sench/.gemini/antigravity/brain/46926614-1c15-4ae0-85a8-1b7f4943e43e';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--force-device-scale-factor=1']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
    await page.goto('http://localhost:3000/portfolio', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));

    await page.screenshot({ path: `${ARTIFACT_DIR}/VERIFY_REELS_PORTFOLIO.png` });
    console.log('VERIFY_REELS_PORTFOLIO.png saved');

  } catch(err) {
    console.error('ERROR:', err);
  } finally {
    await browser.close();
  }
})();
