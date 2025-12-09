// /app/roi-pdf/page.tsx

import {
  Calculator,
  AlertCircle,
  TrendingDown,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Download
} from "lucide-react";

interface ROICalculations {
  eventsPerYear: number;
  totalAttendees: number;
  hoursPerEvent: string;
  annualHours: string;
  annualCost: string;
  hoursSaved: string;
  costSavings: string;
  errorReduction: string;
  totalFirstYearSavings: string;
  fiveYearSavings: string;
  ftesSaved: string;
  estimatedAnnualCost: string;
  netSavings: string;
  roi: string;
  paybackMonths: string;
  efficiencyPercentage: string;
  timePerEventAfter: string;
}

export default async function ROIPdf({
  searchParams
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  
  // FIX #1 — await searchParams
  const params = await searchParams;

  if (!params.data) {
    return <div>No data provided</div>;
  }

  let calculations: ROICalculations;
  try {
    // FIX #2 — correct JSON parsing
    calculations = JSON.parse(params.data);
  } catch (err) {
    console.error("Invalid ROI JSON:", params.data);
    return <div>Invalid data supplied</div>;
  }

  // Format helpers
  const formatCurrency = (value: string | number | bigint) => {
    const num = Number(value);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatNumber = (value: any) =>
    Number(value).toLocaleString("en-US");

  return (
    <html>
      <body className="bg-white p-8">
        <div id="roi-report" className="max-w-6xl mx-auto p-4">

          {/* Header */}
          <div className="text-center mb-8">
            <img
              src="/i-attend-h-300.png"
              alt="i-Attend Logo"
              className="h-10 w-auto mx-auto mb-4"
            />

            <div className="flex items-center justify-center gap-2 mb-2">
              <Calculator className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Your ROI Analysis</h1>
            </div>

            <p className="text-lg text-gray-600">
              Here's what manual attendance tracking is really costing you
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-6 mb-8">

            <div className="bg-white rounded-xl shadow p-6 border-t-4 border-red-500">
              <h3 className="text-sm font-semibold text-gray-600 uppercase">
                Annual Cost (Current)
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(calculations.annualCost)}
              </p>
              <p className="text-sm text-gray-500">
                {formatNumber(calculations.annualHours)} hours per year
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6 border-t-4 border-green-500">
              <h3 className="text-sm font-semibold text-gray-600 uppercase">
                Annual Savings
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(calculations.costSavings)}
              </p>
              <p className="text-sm text-gray-500">
                {formatNumber(calculations.hoursSaved)} hours saved
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6 border-t-4 border-blue-500">
              <h3 className="text-sm font-semibold text-gray-600 uppercase">ROI</h3>
              <p className="text-3xl font-bold text-blue-600">
                {calculations.roi}%
              </p>
              <p className="text-sm text-gray-500">
                Payback in {calculations.paybackMonths} months
              </p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="bg-white rounded-xl shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Detailed Cost Breakdown
            </h2>

            <div className="space-y-6">

              {/* Manual Process */}
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="text-lg font-semibold mb-3">
                  Current Manual Process
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span>Events per year:</span>
                    <span>{formatNumber(calculations.eventsPerYear)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Total attendees annually:</span>
                    <span>{formatNumber(calculations.totalAttendees)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Hours per event:</span>
                    <span>{calculations.hoursPerEvent} hours</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Annual labor hours:</span>
                    <span>{formatNumber(calculations.annualHours)} hours</span>
                  </div>

                  <div className="flex justify-between col-span-2 font-bold text-red-600">
                    <span>Total annual cost:</span>
                    <span>{formatCurrency(calculations.annualCost)}</span>
                  </div>
                </div>
              </div>

              {/* Automated */}
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-3">
                  With i-Attend Automation
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span>Hours saved annually:</span>
                    <span>{formatNumber(calculations.hoursSaved)} hours</span>
                  </div>

                  <div className="flex justify-between">
                    <span>FTE equivalent saved:</span>
                    <span>{calculations.ftesSaved} FTE</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Efficiency improvement:</span>
                    <span>{calculations.efficiencyPercentage}%</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Time per event (after):</span>
                    <span>{calculations.timePerEventAfter} hours</span>
                  </div>

                  <div className="flex justify-between col-span-2 font-bold text-green-600">
                    <span>Annual cost savings:</span>
                    <span>{formatCurrency(calculations.costSavings)}</span>
                  </div>
                </div>
              </div>

              {/* Investment */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold mb-3">Investment Analysis</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span>Estimated i-Attend cost:</span>
                    <span>{formatCurrency(calculations.estimatedAnnualCost)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Net first-year savings:</span>
                    <span>{formatCurrency(calculations.netSavings)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Return on investment:</span>
                    <span>{calculations.roi}%</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Payback period:</span>
                    <span>{calculations.paybackMonths} months</span>
                  </div>

                  <div className="flex justify-between col-span-2 font-bold text-blue-600">
                    <span>5-year total savings:</span>
                    <span>{formatCurrency(calculations.fiveYearSavings)}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <p className="text-center text-gray-500 text-sm">
            * Calculations based on industry benchmarks from 1,000+ i-Attend customers.
          </p>

        </div>
      </body>
    </html>
  );
}
