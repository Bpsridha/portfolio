const fs = require("fs/promises");
const path = require("path");
const puppeteer = require("puppeteer");

const ROOT = path.join(__dirname, "..");
const RESUME_HTML = path.join(ROOT, "resume.html");
const OUTPUT_DIR = path.join(ROOT, "exports");
const OUTPUT_PATH = path.join(OUTPUT_DIR, "resume.pdf");

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.emulateMediaType("screen");

    const fileUrl = `file://${RESUME_HTML.replace(/\\/g, "/")}`;
    await page.goto(fileUrl, { waitUntil: "networkidle0" });

    await page.pdf({
      path: OUTPUT_PATH,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "12mm", right: "12mm", bottom: "12mm", left: "12mm" }
    });

    console.log(`PDF exported to ${OUTPUT_PATH}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("Failed to export resume PDF:", err);
  process.exit(1);
});
