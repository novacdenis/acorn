import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/ui/section";
import {
  TRANSACTIONS_DEFAULT_QUERY,
  TransactionsTable,
  getAllTransactions,
} from "@/features/data-hub";

export async function Transactions() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["transactions", TRANSACTIONS_DEFAULT_QUERY],
    queryFn: async () => await getAllTransactions(TRANSACTIONS_DEFAULT_QUERY),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Section>
        <SectionHeader>
          <SectionTitle>Transactions</SectionTitle>
          <SectionDescription>Track financial activities over time.</SectionDescription>
        </SectionHeader>
        <SectionContent>
          <TransactionsTable />
        </SectionContent>
      </Section>
    </HydrationBoundary>
  );
}
