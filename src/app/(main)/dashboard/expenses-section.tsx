import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/ui/section";
import { ExpensesChart } from "@/features/monitoring";

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

export default function ExpensesSection() {
  return (
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
  );
}
