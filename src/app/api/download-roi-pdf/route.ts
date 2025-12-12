import { roiHtmlTemplate } from "@/app/api/pdf-template";
import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { roiData } = await req.json();
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL;
    const html = roiHtmlTemplate(roiData, origin);

    const isVercel = process.env.VERCEL === "1";

    const browser = isVercel
      ? await puppeteerCore.launch({
          args: chromium.args,
          executablePath: await chromium.executablePath(),
          headless: true,
        })
      : await puppeteer.launch({
          headless: true,
        });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "a4",
      printBackground: true,
    });

    await browser.close();

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="iAttend-ROI-Report.pdf"',
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: "PDF generation failed",
        details: err.message,
      }),
      { status: 500 }
    );
  }
}
