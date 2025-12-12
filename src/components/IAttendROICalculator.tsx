"use client";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Calculator, TrendingDown, Clock, DollarSign, AlertCircle, CheckCircle, Download, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

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


export default function IAttendROICalculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    // Organization Info
    organizationType: '',
    organizationSize: '',

    // Event Volume
    eventsPerYear: '',
    avgAttendeesPerEvent: '',

    // Staff Time
    registrationHours: '',
    checkInHours: '',
    badgePrintingHours: '',
    certificateHours: '',
    reportingHours: '',

    // Staff Costs
    avgHourlyRate: '',

    // Error & Rework
    errorRate: '',
    reworkHours: '',

    // Contact Info (for lead capture)
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',

    // Optional
    sendReport: true
  });

  const [showResults, setShowResults] = useState(false);
  const [calculations, setCalculations] = useState<ROICalculations | null>(null);

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
 
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      delete newErrors[field];
      return newErrors;
    });
  };

  const calculateROI = () => {
    // Extract numeric values
    const events = parseFloat(formData.eventsPerYear) || 0;
    const attendees = parseFloat(formData.avgAttendeesPerEvent) || 0;
    const regHours = parseFloat(formData.registrationHours) || 0;
    const checkHours = parseFloat(formData.checkInHours) || 0;
    const badgeHours = parseFloat(formData.badgePrintingHours) || 0;
    const certHours = parseFloat(formData.certificateHours) || 0;
    const reportHours = parseFloat(formData.reportingHours) || 0;
    const hourlyRate = parseFloat(formData.avgHourlyRate) || 0;
    const errorRate = parseFloat(formData.errorRate) || 0;
    const reworkHours = parseFloat(formData.reworkHours) || 0;

    // Calculate total hours per event
    const hoursPerEvent = regHours + checkHours + badgeHours + certHours + reportHours;

    // Calculate error/rework costs
    const errorHoursPerEvent = (hoursPerEvent * errorRate / 100) + reworkHours;

    // Total hours including errors
    const totalHoursPerEvent = hoursPerEvent + errorHoursPerEvent;

    // Annual calculations
    const annualHours = totalHoursPerEvent * events;
    const annualCost = annualHours * hourlyRate;

    // i-Attend savings (85% efficiency improvement based on industry data)
    const efficiencyGain = 0.85;
    const hoursSaved = annualHours * efficiencyGain;
    const costSavings = hoursSaved * hourlyRate;

    // Additional benefits
    const errorReduction = annualHours * (errorRate / 100) * hourlyRate * 0.95; // 95% error reduction
    const totalFirstYearSavings = costSavings;
    const fiveYearSavings = totalFirstYearSavings * 5;

    // i-Attend typical pricing (estimate)
    const estimatedAnnualCost = events < 25 ? 2028 : events < 100 ? 2028 : 2028;
    // const estimatedAnnualCost = events < 25 ? 2400 : events < 100 ? 4800 : 7200;
    const netSavings = totalFirstYearSavings - estimatedAnnualCost;
    const roi = ((netSavings / estimatedAnnualCost) * 100).toFixed(0);
    const paybackMonths = (estimatedAnnualCost / (totalFirstYearSavings / 12)).toFixed(1);

    // FTE equivalent
    const ftesSaved = (hoursSaved / 2080).toFixed(2); // 2080 work hours per year


    const roiResult = {
      eventsPerYear: events,
      totalAttendees: events * attendees,
      hoursPerEvent: totalHoursPerEvent.toFixed(1),
      annualHours: annualHours.toFixed(0),
      annualCost: annualCost.toFixed(0),
      hoursSaved: hoursSaved.toFixed(0),
      costSavings: costSavings.toFixed(0),
      errorReduction: errorReduction.toFixed(0),
      totalFirstYearSavings: totalFirstYearSavings.toFixed(0),
      fiveYearSavings: fiveYearSavings.toFixed(0),
      ftesSaved: ftesSaved,
      estimatedAnnualCost: estimatedAnnualCost.toFixed(0),
      netSavings: netSavings.toFixed(0),
      roi: roi,
      paybackMonths: paybackMonths,
      efficiencyPercentage: (efficiencyGain * 100).toFixed(0),
      timePerEventAfter: (totalHoursPerEvent * (1 - efficiencyGain)).toFixed(1)
    };

    setCalculations(roiResult);
    setShowResults(true);
    return roiResult;
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Validate that all required fields are filled
    if (!formData.organizationType || !formData.organizationSize ||
      !formData.eventsPerYear || !formData.avgAttendeesPerEvent ||
      !formData.registrationHours || !formData.checkInHours ||
      !formData.badgePrintingHours || !formData.certificateHours ||
      !formData.reportingHours || !formData.avgHourlyRate ||
      !formData.errorRate || !formData.reworkHours ||
      !formData.firstName || !formData.lastName ||
      !formData.email || !formData.company) {
      alert('Please fill in all required fields');
      return;
    }

    calculateROI();
  };

  const resetCalculator = () => {
    setCurrentStep(1);
    setShowResults(false);
    setFormData({
      organizationType: '',
      organizationSize: '',
      eventsPerYear: '',
      avgAttendeesPerEvent: '',
      registrationHours: '',
      checkInHours: '',
      badgePrintingHours: '',
      certificateHours: '',
      reportingHours: '',
      avgHourlyRate: '',
      errorRate: '',
      reworkHours: '',
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      phone: '',
      sendReport: true
    });
  };

  const formatCurrency = (value: string | number | bigint) => {
    const num = Number(value); // convert safely
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatNumber = (value: string | number | bigint) => {
    const num = Number(value); // convert safely
    return new Intl.NumberFormat("en-US").format(num);
  };
 
  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/download-roi-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roiData: calculations }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "iAttend-ROI-Report.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error generating PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendEmailAfterDelay = (roiResult: any) => {
    setTimeout(() => {
      fetch("/api/send-roi-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          roiData: roiResult,
        }),
      });
    }, 30000);
  };

  if (showResults && calculations) {
    return (
      <div id="roi-report" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}

          <div className='flex justify-center'>

            {/* Logo on the left */}
            <a href="https://i-attend.com" target="_blank" rel="noopener noreferrer">
              <img
                src="/i-attend-h-300.png"
                alt="i-Attend Logo"
                className="h-10 w-auto"
              />
            </a>


            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Calculator className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Your ROI Analysis</h1>
              </div>
              <p className="text-lg text-gray-600">Here's what manual attendance tracking is really costing you</p>
            </div>
          </div>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-red-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600 uppercase">Annual Cost (Current)</h3>
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(calculations.annualCost)}</p>
              <p className="text-sm text-gray-500 mt-1">{formatNumber(calculations.annualHours)} hours per year</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600 uppercase">Annual Savings</h3>
                <TrendingDown className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(calculations.costSavings)}</p>
              <p className="text-sm text-gray-500 mt-1">{formatNumber(calculations.hoursSaved)} hours saved</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600 uppercase">ROI</h3>
                <DollarSign className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{calculations.roi}%</p>
              <p className="text-sm text-gray-500 mt-1">Payback in {calculations.paybackMonths} months</p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Cost Breakdown</h2>

            <div className="space-y-6">
              {/* Current State */}
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Manual Process</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Events per year:</span>
                    <span className="font-semibold">{formatNumber(calculations.eventsPerYear)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total attendees annually:</span>
                    <span className="font-semibold">{formatNumber(calculations.totalAttendees)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hours per event:</span>
                    <span className="font-semibold">{calculations.hoursPerEvent} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual labor hours:</span>
                    <span className="font-semibold">{formatNumber(calculations.annualHours)} hours</span>
                  </div>
                  <div className="flex justify-between md:col-span-2">
                    <span className="text-gray-600 font-semibold">Total annual cost:</span>
                    <span className="font-bold text-red-600 text-lg">{formatCurrency(calculations.annualCost)}</span>
                  </div>
                </div>
              </div>

              {/* With i-Attend */}
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">With i-Attend Automation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hours saved annually:</span>
                    <span className="font-semibold text-green-600">{formatNumber(calculations.hoursSaved)} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">FTE equivalent saved:</span>
                    <span className="font-semibold text-green-600">{calculations.ftesSaved} FTE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Efficiency improvement:</span>
                    <span className="font-semibold text-green-600">{calculations.efficiencyPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time per event (after):</span>
                    <span className="font-semibold text-green-600">{calculations.timePerEventAfter} hours</span>
                  </div>
                  <div className="flex justify-between md:col-span-2">
                    <span className="text-gray-600 font-semibold">Annual cost savings:</span>
                    <span className="font-bold text-green-600 text-lg">{formatCurrency(calculations.costSavings)}</span>
                  </div>
                </div>
              </div>

              {/* Investment & Return */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Investment Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated i-Attend cost:</span>
                    <span className="font-semibold">{formatCurrency(calculations.estimatedAnnualCost)}/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Net first-year savings:</span>
                    <span className="font-semibold text-blue-600">{formatCurrency(calculations.netSavings)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Return on investment:</span>
                    <span className="font-semibold text-blue-600">{calculations.roi}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payback period:</span>
                    <span className="font-semibold text-blue-600">{calculations.paybackMonths} months</span>
                  </div>
                  <div className="flex justify-between md:col-span-2">
                    <span className="text-gray-600 font-semibold">5-year total savings:</span>
                    <span className="font-bold text-blue-600 text-lg">{formatCurrency(calculations.fiveYearSavings)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What You Can Do With Saved Time */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 mb-8 text-white">
            <h2 className="text-2xl font-bold mb-4">What Could You Do With {formatNumber(calculations.hoursSaved)} Extra Hours?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Focus on Strategy</h3>
                  <p className="text-blue-100">Spend time improving programs instead of managing spreadsheets</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Better Member Experience</h3>
                  <p className="text-blue-100">Faster check-ins and instant certificates delight attendees</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Data-Driven Decisions</h3>
                  <p className="text-blue-100">Real-time insights to optimize programming and engagement</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Scale Your Events</h3>
                  <p className="text-blue-100">Handle more events without adding staff</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to Reclaim Your Time?</h2>
            <p className="text-lg text-gray-600 mb-6">
              See how i-Attend can save you {formatCurrency(calculations.costSavings)} annually
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <a
                href="https://i-attend.com/register_livedemo.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                  Schedule a Demo
                  <ArrowRight className="w-5 h-5" />
                </button>
              </a>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={resetCalculator}
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Calculate Again
              </button>
              <button
                onClick={handleDownloadPDF}
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 transition-colors"
                disabled={loading}
              >
                <Download className="w-4 h-4" />
                {loading ? "Generating..." : "Download PDF Report"}
              </button>

            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-600 text-sm">
            <p>* Calculations based on industry benchmarks and data from 1,000+ i-Attend customers.</p>
            <p className="mt-2">Results may vary based on your specific implementation and processes.</p>
          </div>
        </div>
      </div>
    );
  }


  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};

    if (currentStep === 1) {
      if (!formData.organizationType) newErrors.organizationType = "Organization type is required.";
      if (!formData.organizationSize) newErrors.organizationSize = "Organization size is required.";
      if (!formData.eventsPerYear) newErrors.eventsPerYear = "Events per year is required.";
      if (!formData.avgAttendeesPerEvent) newErrors.avgAttendeesPerEvent = "Average attendees is required.";
    }

    if (currentStep === 2) {
      if (!formData.registrationHours) newErrors.registrationHours = "Required.";
      if (!formData.checkInHours) newErrors.checkInHours = "Required.";
      if (!formData.badgePrintingHours) newErrors.badgePrintingHours = "Required.";
      if (!formData.certificateHours) newErrors.certificateHours = "Required.";
      if (!formData.reportingHours) newErrors.reportingHours = "Required.";
      if (!formData.avgHourlyRate) newErrors.avgHourlyRate = "Required.";
    }

    if (currentStep === 3) {
      if (!formData.errorRate) newErrors.errorRate = "Error rate is required.";
      if (!formData.reworkHours) newErrors.reworkHours = "Rework hours are required.";
    }

    if (currentStep === 4) {
      if (!formData.firstName) newErrors.firstName = "First name is required.";
      if (!formData.lastName) newErrors.lastName = "Last name is required.";
      if (!formData.email) newErrors.email = "Email is required.";
      if (!formData.company) newErrors.company = "Organization name is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };





  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className='flex'>

          {/* Logo on the left */}
          <a href="https://i-attend.com" target="_blank" rel="noopener noreferrer">
            <img
              src="/i-attend-h-300.png"
              alt="i-Attend Logo"
              className="h-10 w-auto"
            />
          </a>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calculator className="w-10 h-10 text-blue-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">ROI Calculator</h1>
            </div>
            <p className="text-xl text-gray-600 mb-2">
              What is Manual Attendance Tracking Really Costing You?
            </p>
            <p className="text-gray-500">
              Calculate your hidden costs in under 3 minutes and discover your potential savings
            </p>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Step {currentStep} of 4</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          {/* Step 1: Organization Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Your Organization</h2>
                <p className="text-gray-600">This helps us provide more accurate calculations</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Organization Type *
                </label>
                <select
                  value={formData.organizationType}
                  onChange={(e) => handleInputChange('organizationType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select your organization type</option>
                  <option value="cpe">Continuing Education / Professional Development</option>
                  <option value="association">Professional Association / Trade Organization</option>
                  <option value="greek">Greek Life / Campus Organization</option>
                  <option value="religious">Religious Organization / Church</option>
                  <option value="corporate">Corporate Training / L&D Department</option>
                  <option value="other">Other</option>
                </select>
                {errors.organizationType && (
                  <p className="text-red-600 text-sm mt-1">{errors.organizationType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Organization Size *
                </label>
                <select
                  value={formData.organizationSize}
                  onChange={(e) => handleInputChange('organizationSize', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select organization size</option>
                  <option value="small">Under 500 members/employees</option>
                  <option value="medium">500-2,500 members/employees</option>
                  <option value="large">2,500-10,000 members/employees</option>
                  <option value="xlarge">Over 10,000 members/employees</option>
                </select>
                {errors.organizationSize && (
                  <p className="text-red-600 text-sm mt-1">{errors.organizationSize}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Events/Programs Per Year *
                  </label>
                  <input
                    type="number"
                    value={formData.eventsPerYear}
                    onChange={(e) => handleInputChange('eventsPerYear', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 50"
                    required
                    min="1"
                  />
                  {errors.eventsPerYear && (
                    <p className="text-red-600 text-sm mt-1">{errors.eventsPerYear}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Avg Attendees Per Event *
                  </label>
                  <input
                    type="number"
                    value={formData.avgAttendeesPerEvent}
                    onChange={(e) => handleInputChange('avgAttendeesPerEvent', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 150"
                    required
                    min="1"
                  />
                  {errors.avgAttendeesPerEvent && (
                    <p className="text-red-600 text-sm mt-1">{errors.avgAttendeesPerEvent}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Staff Time */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Clock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">How Much Time Does Each Event Take?</h2>
                <p className="text-gray-600">Estimate average staff hours spent per event on these activities</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Registration Setup (hours) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.registrationHours}
                    onChange={(e) => handleInputChange('registrationHours', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 2"
                    required
                    min="0"
                  />
                  {errors.registrationHours && (
                    <p className="text-red-600 text-sm mt-1">{errors.registrationHours}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Creating forms, processing registrations</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Check-In Management (hours) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.checkInHours}
                    onChange={(e) => handleInputChange('checkInHours', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 3"
                    required
                    min="0"
                  />
                  {errors.checkInHours && (
                    <p className="text-red-600 text-sm mt-1">{errors.checkInHours}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Day-of check-in, attendance tracking</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Badge Creation/Printing (hours) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.badgePrintingHours}
                    onChange={(e) => handleInputChange('badgePrintingHours', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 1.5"
                    required
                    min="0"
                  />
                  {errors.badgePrintingHours && (
                    <p className="text-red-600 text-sm mt-1">{errors.badgePrintingHours}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Designing, printing, assembling badges</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Certificate Generation (hours) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.certificateHours}
                    onChange={(e) => handleInputChange('certificateHours', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 2"
                    required
                    min="0"
                  />
                  {errors.certificateHours && (
                    <p className="text-red-600 text-sm mt-1">{errors.certificateHours}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Creating, distributing certificates/credits</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reporting & Data Entry (hours) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.reportingHours}
                    onChange={(e) => handleInputChange('reportingHours', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 1.5"
                    required
                    min="0"
                  />
                  {errors.reportingHours && (
                    <p className="text-red-600 text-sm mt-1">{errors.reportingHours}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Compiling reports, updating databases</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Average Staff Hourly Rate ($) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={formData.avgHourlyRate}
                    onChange={(e) => handleInputChange('avgHourlyRate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 35"
                    required
                    min="1"
                  />
                  {errors.avgHourlyRate && (
                    <p className="text-red-600 text-sm mt-1">{errors.avgHourlyRate}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Blended rate for staff doing this work</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Don't forget to include time spent on corrections, follow-ups, and administrative overhead. Most organizations underestimate actual time by 20-30%.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Errors & Rework */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <AlertCircle className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">The Hidden Cost of Errors</h2>
                <p className="text-gray-600">Manual processes are prone to mistakes. Let's quantify the impact.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Error Rate (%) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={formData.errorRate}
                    onChange={(e) => handleInputChange('errorRate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 5"
                    required
                    min="0"
                    max="50"
                  />
                  {errors.errorRate && (
                    <p className="text-red-600 text-sm mt-1">{errors.errorRate}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Percentage of work requiring corrections (typical: 5-15%)</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rework/Corrections (hours) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.reworkHours}
                    onChange={(e) => handleInputChange('reworkHours', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 1"
                    required
                    min="0"
                  />
                  {errors.reworkHours && (
                    <p className="text-red-600 text-sm mt-1">{errors.reworkHours}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Hours per event spent fixing mistakes</p>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Common Manual Process Errors:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>Incorrect credit hours recorded or certificates with wrong information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>Missing attendee data from illegible sign-in sheets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>Duplicate registrations or attendance records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>Data entry mistakes in spreadsheets or databases</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>Lost paper records requiring recreation from scratch</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>Compliance documentation gaps discovered during audits</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Beyond Time & Money</h3>
                <p className="text-sm text-gray-600">
                  Errors also impact member satisfaction, staff morale, compliance risk, and your organization's reputation.
                  Automated systems reduce errors by up to 95%, virtually eliminating these hidden costs.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Contact Information */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Your Personalized Results</h2>
                <p className="text-gray-600">Enter your details to see your ROI calculation and receive a detailed PDF report</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John"
                    required
                  />
                  {errors.firstName && (
                    <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Smith"
                    required
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john.smith@example.com"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Organization"
                    required
                  />
                  {errors.company && (
                    <p className="text-red-600 text-sm mt-1">{errors.company}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                <input
                  type="checkbox"
                  id="sendReport"
                  checked={formData.sendReport}
                  onChange={(e) => handleInputChange('sendReport', e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="sendReport" className="text-sm text-gray-700">
                  Yes, email me a detailed PDF report with my ROI analysis and implementation guide.
                  I also agree to receive helpful resources about attendance tracking best practices.
                  (Unsubscribe anytime)
                </label>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">1.</span>
                        <span>Instantly see your personalized ROI calculation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">2.</span>
                        <span>Receive a detailed PDF report via email within 2 minutes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">3.</span>
                        <span>Optional: Schedule a demo to see i-Attend in action</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">4.</span>
                        <span>Start your free 15-day trial (no credit card required)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center text-xs text-gray-500">
                <p>🔒 Your information is secure. We respect your privacy and never share your data.</p>
                <p className="mt-1">Read our <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a></p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ← Previous
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (validateStep()) {
                    setErrors({});
                    setCurrentStep(currentStep + 1);
                  }
                }}

                className="ml-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  if (validateStep()) {
                    setErrors({});
                    const roiResult = calculateROI();  // Now you have fresh ROI!
                    sendEmailAfterDelay(roiResult);
                  }
                }}
                className="ml-auto px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                Calculate My ROI
                <Calculator className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">Trusted by 1,000+ organizations including:</p>
          <div className="flex flex-wrap justify-center gap-6 items-center opacity-60">
            <div className="text-gray-400 font-semibold">State Medical Association</div>
            <div className="text-gray-400 font-semibold">National Bar Association</div>
            <div className="text-gray-400 font-semibold">Greek Life Systems</div>
            <div className="text-gray-400 font-semibold">Fortune 500 Training</div>
          </div>
        </div>

        {/* Benefits Preview */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Why Organizations Choose i-Attend
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Save Time</h4>
              <p className="text-sm text-gray-600">
                Automate registration, check-in, certificates, and reporting
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Reduce Errors</h4>
              <p className="text-sm text-gray-600">
                95% reduction in manual errors and data accuracy issues
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cut Costs</h4>
              <p className="text-sm text-gray-600">
                Average ROI of 300%+ in the first year
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}