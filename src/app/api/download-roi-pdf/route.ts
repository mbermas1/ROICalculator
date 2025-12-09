import puppeteer from "puppeteer";

export async function POST(req: Request) {
  try {
    const { roiData } = await req.json();

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL;
    const pdfUrl = `${origin}/roi-pdf?data=${encodeURIComponent(JSON.stringify(roiData))}`;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(pdfUrl, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    // Convert Node.js Buffer to ArrayBuffer safely
    const pdfArrayBuffer = new Uint8Array(pdfBuffer).buffer;

    return new Response(pdfArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=iAttend-ROI-Report.pdf",
      },
    });
  } catch (err) {
    console.error("PDF Download Error:", err);
    return new Response(JSON.stringify({ error: "Failed to generate PDF" }), { status: 500 });
  }
}
