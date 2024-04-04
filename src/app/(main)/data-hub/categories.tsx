import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { CATEGORIES_DEFAULT_QUERY, CategoriesTable, getAllCategories } from "@/features/data-hub";

export async function Categories() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["categories", CATEGORIES_DEFAULT_QUERY],
    queryFn: async () => await getAllCategories(CATEGORIES_DEFAULT_QUERY),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoriesTable />
    </HydrationBoundary>
  );
}
