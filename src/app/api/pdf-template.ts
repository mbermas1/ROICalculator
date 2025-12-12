export function roiHtmlTemplate(roiData: any, origin:string |undefined) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body {
      font-family: 'Arial', sans-serif;
      padding: 40px;
      background-color: #f5f5f5;
      color: #333;
    }

    .logo {
      width: 150px;
      display: block;
      margin: 0 auto 20px;
    }

    .title {
      text-align: center;
      font-size: 30px;
      font-weight: bold;
      color: #003a70;
      margin-bottom: 5px;
    }

    .subtitle {
      text-align: center;
      font-size: 16px;
      color: #555;
      margin-bottom: 30px;
    }

    .cards {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      margin-bottom: 30px;
    }

    .card {
      flex: 1;
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }

    .card .title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .card .value {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .card .desc {
      font-size: 12px;
      color: #666;
    }

    .section {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }

    .section-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
    }

    .section p {
      margin: 5px 0;
      font-size: 14px;
    }

    .red { color: #d9534f; font-weight: bold; }
    .green { color: #0a9b50; font-weight: bold; }
    .blue { color: #0d6efd; font-weight: bold; }

    .section .value-big {
      font-size: 20px;
      margin-top: 10px;
    }
  </style>
</head>
<body>

   <img src="${origin}/i-attend-h-300.png" class="logo" />

  <div class="title">Your ROI Analysis</div>
  <div class="subtitle">Here's what manual attendance tracking is really costing you</div>

  <div class="cards">
    <div class="card">
      <div class="title">ANNUAL COST (CURRENT)</div>
      <div class="value red">$${roiData.annualCost}</div>
      <div class="desc">${roiData.annualHours} hours per year</div>
    </div>
    <div class="card">
      <div class="title">ANNUAL SAVINGS</div>
      <div class="value green">$${roiData.costSavings}</div>
      <div class="desc">${roiData.hoursSaved} hours saved</div>
    </div>
    <div class="card">
      <div class="title">ROI</div>
      <div class="value blue">${roiData.roi}%</div>
      <div class="desc">Payback in ${roiData.paybackMonths} months</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title red">Current Manual Process</div>
    <p>Events per year: ${roiData.eventsPerYear}</p>
    <p>Total attendees annually: ${roiData.totalAttendees}</p>
    <p>Hours per event: ${roiData.hoursPerEvent}</p>
    <p>Annual labor hours: ${roiData.annualHours}</p>
    <p class="value-big red">$${roiData.annualCost}</p>
  </div>

  <div class="section">
    <div class="section-title green">With i-Attend Automation</div>
    <p>Hours saved annually: ${roiData.hoursSaved}</p>
    <p>FTE equivalent saved: ${roiData.fteSaved || "0.23 FTE"}</p>
    <p>Efficiency improvement: ${roiData.efficiencyPercentage}%</p>
    <p>Time per event (after): ${roiData.timePerEventAfter} hours</p>
    <p class="value-big green">$${roiData.netSavings}</p>
  </div>

  <div class="section">
    <div class="section-title blue">Investment Analysis</div>
    <p>Estimated i-Attend cost: $${roiData.estimatedAnnualCost}</p>
    <p>Net first-year savings: $${roiData.netSavings}</p>
    <p>Return on investment: ${roiData.roi}%</p>
    <p class="value-big blue">5-year total savings: $${roiData.fiveYearSavings}</p>
  </div>

</body>
</html>
  `;
}
