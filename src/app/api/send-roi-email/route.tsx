import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { renderToStream } from "@react-pdf/renderer";
import { ROIReportPDF } from "@/components/pdf/ROIReportPDF";

export async function POST(req: NextRequest) {
  try {
    const { email, roiData } = await req.json();

    // Generate PDF stream
    const stream = await renderToStream(
      <ROIReportPDF calculations={roiData} logoUrl="/i-attend-h-300.png" />
    );

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    // Configure Nodemailer using your environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SCHEDULE_SMTP,
      port: Number(process.env.SCHEDULE_PORT || 587),
      auth: {
        user: process.env.SCHEDULE_USER_NAME,
        pass: process.env.SCHEDULE_PASSWORD,
      },
    });

    // Send email with PDF attachment
    await transporter.sendMail({
      from: process.env.SCHEDULE_FROM_EMAIL || "no-reply@i-attend.com",
      to: email,
      subject: "Your ROI Report",
      text: "Please find your ROI report attached.",
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
