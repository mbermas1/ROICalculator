import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

interface ROIReportPDFProps {
  calculations: any;
  logoUrl: string;
}

const formatNumber = (num: number | string) => {
  const n = Number(num);
  if (isNaN(n)) return num;
  return n.toLocaleString("en-US");
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 12,
    padding: 40,
    backgroundColor: "#f5f5f5",
  },
  logo: {
    width: 150,
    marginBottom: 20,
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#003a70",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 20,
    color: "#555",
  },
  cards: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    margin: 5,
    textAlign: "center",
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 3,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  valueBig: {
    fontSize: 16,
    marginTop: 5,
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#333",
  },
});

export const ROIReportPDF: React.FC<ROIReportPDFProps> = ({
  calculations,
  logoUrl,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src={logoUrl} style={styles.logo} />
        <Text style={styles.title}>Your ROI Analysis</Text>
        <Text style={styles.subtitle}>
          Here's what manual attendance tracking is really costing you
        </Text>

        {/* Top Cards */}
        <View style={styles.cards}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>ANNUAL COST (CURRENT)</Text>
            <Text style={[styles.cardValue, { color: "#d9534f" }]}>
              ${formatNumber(calculations.annualCost)}
            </Text>
            <Text>{formatNumber(calculations.annualHours)} hours/year</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>ANNUAL SAVINGS</Text>
            <Text style={[styles.cardValue, { color: "#0a9b50" }]}>
              ${formatNumber(calculations.costSavings)}
            </Text>
            <Text>{formatNumber(calculations.hoursSaved)} hours saved</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>ROI</Text>
            <Text style={[styles.cardValue, { color: "#0d6efd" }]}>
              {formatNumber(calculations.roi)}%
            </Text>
            <Text>Payback in {formatNumber(calculations.paybackMonths)} months</Text>
          </View>
        </View>

        {/* Sections */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: "#d9534f" }]}>
            Current Manual Process
          </Text>

          <Text>Events per year: {formatNumber(calculations.eventsPerYear)}</Text>
          <Text>
            Total attendees annually: {formatNumber(calculations.totalAttendees)}
          </Text>
          <Text>Hours per event: {formatNumber(calculations.hoursPerEvent)}</Text>
          <Text>
            Annual labor hours: {formatNumber(calculations.annualHours)}
          </Text>

          <Text style={[styles.valueBig, { color: "#d9534f" }]}>
            ${formatNumber(calculations.annualCost)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: "#0a9b50" }]}>
            With i-Attend Automation
          </Text>

          <Text>Hours saved annually: {formatNumber(calculations.hoursSaved)}</Text>
          <Text>
            FTE equivalent saved:{" "}
            {formatNumber(calculations.ftesSaved || "0.23")}
          </Text>
          <Text>
            Efficiency improvement:{" "}
            {formatNumber(calculations.efficiencyPercentage)}%
          </Text>
          <Text>
            Time per event (after):{" "}
            {formatNumber(calculations.timePerEventAfter)} hours
          </Text>

          <Text style={[styles.valueBig, { color: "#0a9b50" }]}>
            ${formatNumber(calculations.netSavings)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: "#0d6efd" }]}>
            Investment Analysis
          </Text>

          <Text>
            Estimated i-Attend cost: $
            {formatNumber(calculations.estimatedAnnualCost)}
          </Text>
          <Text>
            Net first-year savings: ${formatNumber(calculations.netSavings)}
          </Text>
          <Text>Return on investment: {formatNumber(calculations.roi)}%</Text>

          <Text style={[styles.valueBig, { color: "#0d6efd" }]}>
            5-year total savings: ${formatNumber(calculations.fiveYearSavings)}
          </Text>
        </View>

        {/* FOOTER / DISCLAIMER */}
        <View style={styles.footer}>
          <Text>
            Disclaimer: This tool is for informational purposes only and should
            not be considered financial advice. Results are estimates and may
            not reflect actual outcomes.
          </Text>

          <Text>i-Attend Platform</Text>
          <Text>https://www.i-attend.com</Text>
          <Text>
            Registration * Attendance Tracking * Certificates * Surveys * Reports
          </Text>

          <Text>
            Copyright © TNETIC, Inc., All rights reserved.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
