import nodemailer from "nodemailer";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function POST(req: Request) {
  try {
    const { email, roiData } = await req.json();

    const origin =
      req.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL;

    const pdfUrl = `${origin}/roi-pdf?data=${encodeURIComponent(
      JSON.stringify(roiData)
    )}`;

    console.log("PDF URL:", pdfUrl);

    // Detect environment
    const isProd = process.env.NODE_ENV === "production";

    let executablePath: string | null = null;

    if (isProd) {
      // Serverless Linux environment
      executablePath = await chromium.executablePath();
    } else {
      // Local Windows development: use Chrome installed on your machine
      executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    }

    const browser = await puppeteer.launch({
      args: isProd ? chromium.args : [],
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

    // Nodemailer transport
    const transporter = nodemailer.createTransport({
      host: process.env.SCHEDULE_SMTP,
      port: Number(process.env.SCHEDULE_PORT),
      secure: false,
      auth: {
        user: process.env.SCHEDULE_USER_NAME,
        pass: process.env.SCHEDULE_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SCHEDULE_FROM_EMAIL,
      to: email,
      subject: "Your ROI Report (PDF Attached)",
      html: "<p>Your ROI report is attached.</p>",
      attachments: [
        {
          filename: "iAttend-ROI-Report.pdf",
          content: pdfBuffer,
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
