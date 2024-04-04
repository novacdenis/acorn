import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
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
      <TransactionsTable />
    </HydrationBoundary>
  );
}
