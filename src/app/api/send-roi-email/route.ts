 
import { roiHtmlTemplate } from "@/app/api/pdf-template";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer"; // full Puppeteer locally
import puppeteerCore from "puppeteer-core"; // for production
import nodemailer from "nodemailer";

export const runtime = "nodejs"; // IMPORTANT FOR VERCEL

export async function POST(req: Request) {
  try {
    const { email, roiData } = await req.json();

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL;

    // Generate HTML directly
    const html = roiHtmlTemplate(roiData, origin);

    // Detect environment
    const isVercel = process.env.VERCEL === "1";

    // Launch Puppeteer
    const browser = await (isVercel
      ? puppeteerCore.launch({
          args: chromium.args,
          executablePath: await chromium.executablePath(),
          headless: true,
        })
      : puppeteer.launch({ headless: true }) // full Puppeteer locally
    );

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfUint8 = await page.pdf({ format: "a4", printBackground: true });
    await browser.close();

    // Convert Uint8Array to Buffer
    const pdfBuffer = Buffer.from(pdfUint8);

    // Nodemailer transport
    const transporter = nodemailer.createTransport({
      host: process.env.SCHEDULE_SMTP,
      port: Number(process.env.SCHEDULE_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SCHEDULE_USER_NAME,
        pass: process.env.SCHEDULE_PASSWORD,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.SCHEDULE_FROM_EMAIL,
      to: email,
      subject: "Your ROI Report (PDF Attached)",
      html: "<p>Your ROI report is attached.</p>",
      attachments: [
        {
          filename: "iAttend-ROI-Report.pdf",
          content: pdfBuffer, // now correctly typed
        },
      ],
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    console.error("PDF Email Error:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to generate or send PDF",
        details: err.message,
      }),
      { status: 500 }
    );
  }
}
