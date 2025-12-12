import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { renderToStream } from "@react-pdf/renderer";
import { ROIReportPDF } from "@/components/pdf/ROIReportPDF";

export async function POST(req: NextRequest) {
  try {
    const { email, roiData, firstname } = await req.json();
    const baseUrl = req.nextUrl.origin;
    const logoAbsoluteUrl = `${baseUrl}/i-attend-h-300.png`;

    // Generate PDF stream
    const stream = await renderToStream(
      <ROIReportPDF calculations={roiData} logoUrl={logoAbsoluteUrl} />
    );

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    // Configure email
    const transporter = nodemailer.createTransport({
      host: process.env.SCHEDULE_SMTP,
      port: Number(process.env.SCHEDULE_PORT || 587),
      auth: {
        user: process.env.SCHEDULE_USER_NAME,
        pass: process.env.SCHEDULE_PASSWORD,
      },
    });

    // Updated Email Body
    const messageText = `Hey ${firstname},

Please find the i-Attend ROI report as you had requested.

Note that ROI results are estimates and may not reflect actual outcomes. We encourage you to schedule a DEMO to learn more about the software.

Regards,
i-Attend Team
https://www.i-attend.com
Registration * Attendance Tracking * Certificates * Surveys * Reports
`;

    // Send Email
    await transporter.sendMail({
      from: `"i-Attend Info" <info@i-Attend.com>`,
      to: email,
      subject: "Your i-Attend ROI Report",
      text: messageText,
      attachments: [
        {
          filename: "iAttend-ROI-Report.pdf",
          content: pdfBuffer,
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
