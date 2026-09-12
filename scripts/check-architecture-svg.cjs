// Open every generated architecture SVG exactly as a user does and fail on XML parser errors.
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require(process.env.IDEA_PLAYWRIGHT_PATH || 'playwright');

const root = path.resolve(__dirname, '..');
const evidenceId = process.env.IDEA_ARCH_EVIDENCE_ID;
if (!evidenceId) {
  throw new Error('Set IDEA_ARCH_EVIDENCE_ID to the evidence record being checked.');
}
if (!/^IE-VEV-[A-Z0-9-]+$/.test(evidenceId)) {
  throw new Error(`Invalid IDEA_ARCH_EVIDENCE_ID: ${evidenceId}`);
}
const folder = path.join(root, 'docs/product/instances/idea-engineering/evidence', evidenceId);

(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  const browserVersion = browser.version();
  const page = await browser.newPage();
  const failures = [];
  const files = fs.readdirSync(folder).filter(name => name.endsWith('.svg')).sort();

  for (const file of files) {
    await page.goto(pathToFileURL(path.join(folder, file)).href);
    const result = await page.evaluate(() => ({
      root: document.documentElement?.nodeName,
      parserErrors: document.querySelectorAll('parsererror').length,
      text: (document.body?.innerText || document.documentElement?.textContent || '').slice(0, 500),
    }));
    if (
      result.root.toLowerCase() !== 'svg' ||
      result.parserErrors > 0 ||
      /this page contains the following errors|error on line \d+ at column \d+/i.test(result.text)
    ) {
      failures.push({file, ...result});
    }
  }

  await browser.close();
  const evidence = {
    evidenceId,
    checkedAt: new Date().toISOString(),
    browser: browserVersion,
    check: 'Open each standalone SVG through the browser file URL and reject XML parser errors',
    count: files.length,
    failures,
    status: failures.length ? 'FAIL' : 'PASS',
  };
  fs.writeFileSync(path.join(folder, 'svg-open-results.json'), JSON.stringify(evidence, null, 2));
  if (failures.length) {
    console.error(JSON.stringify({status: 'FAIL', count: failures.length, failures}, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({status: 'PASS', count: files.length}));
})().catch(error => {
  console.error(error);
  process.exit(1);
});
