import nodemailer from "nodemailer";
import puppeteer from "puppeteer";

export async function POST(req: Request) {
  try {
    const { email, roiData } = await req.json();

    // Detect correct base URL
    const origin =
      req.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL;

    const pdfUrl = `${origin}/roi-pdf?data=${encodeURIComponent(
      JSON.stringify(roiData)
    )}`;

    console.log("Generating PDF from URL:", pdfUrl);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Goto dynamic URL
    await page.goto(pdfUrl, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfBuffer = Buffer.from(
      await page.pdf({
        format: "A4",
        printBackground: true,
      })
    );

    await browser.close();

    // SMTP transport
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
      html: `<p>Your ROI report is attached.</p>`,
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
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
