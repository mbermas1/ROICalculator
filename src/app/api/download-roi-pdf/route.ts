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

    // Detect environment
    const isProd = process.env.NODE_ENV === "production";

    let executablePath: string;

    if (isProd) {
      // Serverless / Linux: use chromium
      executablePath = await chromium.executablePath();
    } else {
      // Local dev / Windows: use installed Chrome
      executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"; 
      // adjust path if Chrome is elsewhere
    }

    const browser = await puppeteer.launch({
      args: isProd ? chromium.args : [], // chromium args only for serverless
      executablePath,
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(pdfUrl, { waitUntil: "networkidle0" });

    const pdfUint8 = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    const pdfBuffer = Buffer.from(pdfUint8);

    await browser.close();

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=iAttend-ROI-Report.pdf",
      },
    });
  } catch (err: any) {
    console.error("PDF Download Error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate PDF", details: err.message }),
      { status: 500 }
    );
  }
}
