import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/ui/section";
import {
  Metric,
  MetricDelta,
  MetricDescription,
  MetricTitle,
  MetricTrend,
  MetricValue,
} from "@/features/monitoring";
import { ExpensesChart } from "@/features/monitoring/components/expenses-chart";
import { createClient } from "@/lib/supabase/server";

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

export default async function DashboardPage() {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  return (
    <>
      <Section className="container mt-0 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Metric>
          <MetricTitle>Total spent</MetricTitle>
          <MetricValue>$1,000.00</MetricValue>
          <MetricDelta delta="up">5%</MetricDelta>
          <MetricDescription>Compared to last month</MetricDescription>
          <MetricTrend
            data={data.map((d) => ({ timestamp: d.timestamp, amount: Math.random() * 1000 }))}
          />
        </Metric>

        <Metric>
          <MetricTitle>Household bills</MetricTitle>
          <MetricValue>$500.00</MetricValue>
          <MetricDelta delta="up">3.31%</MetricDelta>
          <MetricDescription>Compared to last month</MetricDescription>
          <MetricTrend
            data={data.map((d) => ({ timestamp: d.timestamp, amount: Math.random() * 1000 }))}
          />
        </Metric>

        <Metric>
          <MetricTitle>Total transactions</MetricTitle>
          <MetricValue>100</MetricValue>
          <MetricDelta delta="down">5%</MetricDelta>
          <MetricDescription>Compared to last month</MetricDescription>
          <MetricTrend
            data={data.map((d) => ({ timestamp: d.timestamp, amount: Math.random() * 1000 }))}
          />
        </Metric>

        <Metric>
          <MetricTitle>Avg. transaction amount</MetricTitle>
          <MetricValue>$10.00</MetricValue>
          <MetricDelta delta="up">10%</MetricDelta>
          <MetricDescription>Compared to last month</MetricDescription>
          <MetricTrend
            data={data.map((d) => ({ timestamp: d.timestamp, amount: Math.random() * 1000 }))}
          />
        </Metric>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Expenses</SectionTitle>
          <SectionDescription>
            Visual representation of your expenses over time and by category
          </SectionDescription>
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

      <pre>
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre>
    </>
  );
}
