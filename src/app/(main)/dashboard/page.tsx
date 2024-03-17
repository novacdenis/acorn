import type { Metadata } from "next";
import ExpensesSection from "./expenses-section";
import KPISection from "./kpi-section";
import TransactionsSection from "./transactions-section";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <>
      <KPISection />
      <ExpensesSection />
      <TransactionsSection />
    </>
  );
}
