import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/ui/section";
import { CATEGORIES_DEFAULT_QUERY, CategoriesTable, getAllCategories } from "@/features/data-hub";

export async function Categories() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["categories", CATEGORIES_DEFAULT_QUERY],
    queryFn: async () => await getAllCategories(CATEGORIES_DEFAULT_QUERY),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Section className="mt-5">
        <SectionHeader>
          <SectionTitle>Categories</SectionTitle>
          <SectionDescription>
            Manage categories for tracking financial activities.
          </SectionDescription>
        </SectionHeader>
        <SectionContent>
          <CategoriesTable />
        </SectionContent>
      </Section>
    </HydrationBoundary>
  );
}
