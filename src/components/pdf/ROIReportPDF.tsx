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
  red: { color: "#d9534f" },
  green: { color: "#0a9b50" },
  blue: { color: "#0d6efd" },
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

        {/* Cards */}
        <View style={styles.cards}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>ANNUAL COST (CURRENT)</Text>
            <Text style={[styles.cardValue, styles.red]}>
              ${calculations.annualCost}
            </Text>
            <Text>{calculations.annualHours} hours/year</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>ANNUAL SAVINGS</Text>
            <Text style={[styles.cardValue, styles.green]}>
              ${calculations.costSavings}
            </Text>
            <Text>{calculations.hoursSaved} hours saved</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>ROI</Text>
            <Text style={[styles.cardValue, styles.blue]}>
              {calculations.roi}%
            </Text>
            <Text>Payback in {calculations.paybackMonths} months</Text>
          </View>
        </View>

        {/* Sections */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.red]}>
            Current Manual Process
          </Text>
          <Text>Events per year: {calculations.eventsPerYear}</Text>
          <Text>Total attendees annually: {calculations.totalAttendees}</Text>
          <Text>Hours per event: {calculations.hoursPerEvent}</Text>
          <Text>Annual labor hours: {calculations.annualHours}</Text>
          <Text style={[styles.valueBig, styles.red]}>
            ${calculations.annualCost}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.green]}>
            With i-Attend Automation
          </Text>
          <Text>Hours saved annually: {calculations.hoursSaved}</Text>
          <Text>FTE equivalent saved: {calculations.ftesSaved || "0.23 FTE"}</Text>
          <Text>Efficiency improvement: {calculations.efficiencyPercentage}%</Text>
          <Text>Time per event (after): {calculations.timePerEventAfter} hours</Text>
          <Text style={[styles.valueBig, styles.green]}>
            ${calculations.netSavings}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.blue]}>
            Investment Analysis
          </Text>
          <Text>Estimated i-Attend cost: ${calculations.estimatedAnnualCost}</Text>
          <Text>Net first-year savings: ${calculations.netSavings}</Text>
          <Text>Return on investment: {calculations.roi}%</Text>
          <Text style={[styles.valueBig, styles.blue]}>
            5-year total savings: ${calculations.fiveYearSavings}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
