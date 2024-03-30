import type { Metadata } from "next";

import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/ui/section";
import { ExpensesChart, Metric, TransactionTable } from "@/features/monitoring";

const data = [
  { timestamp: new Date("2021-01-01").getTime() },
  { timestamp: new Date("2021-02-01").getTime() },
  { timestamp: new Date("2021-03-01").getTime() },
  { timestamp: new Date("2021-04-01").getTime() },
  { timestamp: new Date("2021-05-01").getTime() },
  { timestamp: new Date("2021-06-01").getTime() },
  { timestamp: new Date("2021-07-01").getTime() },
  { timestamp: new Date("2021-08-01").getTime() },
  { timestamp: new Date("2021-09-01").getTime() },
  { timestamp: new Date("2021-10-01").getTime() },
  { timestamp: new Date("2021-11-01").getTime() },
  { timestamp: new Date("2021-12-01").getTime() },
];

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="container space-y-5">
      <section className="grid gap-5 px-0 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          title="Total spent"
          value={1000}
          delta={5}
          deltaSign="positive"
          trend={data.map((d) => ({ timestamp: d.timestamp, amount: Math.random() * 1000 }))}
        />

        <Metric
          title="Household bills"
          value={500}
          delta={3.31}
          deltaSign="positive"
          trend={data.map((d) => ({ timestamp: d.timestamp, amount: Math.random() * 1000 }))}
        />

        <Metric
          title="Total transactions"
          value={100}
          delta={5}
          deltaSign="negative"
          trend={data.map((d) => ({ timestamp: d.timestamp, amount: Math.random() * 1000 }))}
        />

        <Metric
          title="Avg. transaction amount"
          value={10}
          delta={10}
          deltaSign="positive"
          trend={data.map((d) => ({ timestamp: d.timestamp, amount: Math.random() * 1000 }))}
        />
      </section>

      <Section>
        <SectionHeader>
          <SectionTitle>Expenses</SectionTitle>
          <SectionDescription>Visualize spending patterns by time and category.</SectionDescription>
        </SectionHeader>
        <SectionContent>
          <ExpensesChart
            data={data
              .map((d) => ({
                timestamp: d.timestamp,
                household: Math.random() * 1000,
                transport: Math.random() * 1000,
                food: Math.random() * 1000,
                utilities: Math.random() * 1000,
                other: Math.random() * 1000,
              }))
              .map((d) => ({
                ...d,
                total: Object.keys(d)
                  .filter((d) => d !== "timestamp")
                  .reduce((acc, key) => acc + d[key as keyof typeof d], 0),
              }))}
          />
        </SectionContent>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Transactions</SectionTitle>
          <SectionDescription>Track financial activities over time.</SectionDescription>
        </SectionHeader>
        <SectionContent>
          <TransactionTable
            transactions={data.map((d, i) => ({
              id: i.toString(),
              description: "Transaction",
              amount: Math.random() * 100,
              category: "Category",
              timestamp: d.timestamp,
            }))}
          />
        </SectionContent>
      </Section>
    </div>
  );
}
