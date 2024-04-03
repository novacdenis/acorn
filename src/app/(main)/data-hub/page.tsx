import type { Metadata } from "next";

import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/ui/section";
import {
  CATEGORIES_DEFAULT_QUERY,
  CategoriesTable,
  ImportDialog,
  getAllCategories,
} from "@/features/data-hub";

export const metadata: Metadata = {
  title: "Data Hub",
};

export default async function ImportPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["categories", CATEGORIES_DEFAULT_QUERY],
    queryFn: async () => await getAllCategories(CATEGORIES_DEFAULT_QUERY),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container space-y-5">
        <Section>
          <SectionHeader>
            <SectionTitle>Categories</SectionTitle>
            <SectionDescription>
              Categorize your transactions to get insights into your spending habits.
            </SectionDescription>
          </SectionHeader>
          <SectionContent>
            <CategoriesTable />
          </SectionContent>
        </Section>
      </div>
      <ImportDialog />
    </HydrationBoundary>
  );
}
