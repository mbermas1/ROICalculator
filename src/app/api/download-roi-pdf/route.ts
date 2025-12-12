export const runtime = "nodejs";

import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function POST(req: Request) {
  try {
    const { roiData } = await req.json();

    const origin =
      req.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL;

    const pdfUrl = `${origin}/roi-pdf?data=${encodeURIComponent(
      JSON.stringify(roiData)
    )}`;

    const isProd = process.env.NODE_ENV === "production";

    let executablePath: string;

    if (isProd) {
      // Vercel browser
      executablePath = await chromium.executablePath();
    } else {
      // Local Chrome
      executablePath =
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(pdfUrl, { waitUntil: "networkidle0" });

    const pdfUint8 = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    return new Response(Buffer.from(pdfUint8), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=iAttend-ROI-Report.pdf",
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: "Failed to generate PDF",
        details: err.message,
      }),
      { status: 500 }
    );
  }
}
