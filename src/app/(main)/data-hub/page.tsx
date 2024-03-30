import type { Metadata } from "next";

import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/ui/section";
import { CategoriesTable, FilesTable, ImportDialog, getAllCategories } from "@/features/data-hub";

export const metadata: Metadata = {
  title: "Import",
};

export default async function ImportPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container space-y-5">
        <Section>
          <SectionHeader>
            <SectionTitle>Imported files</SectionTitle>
            <SectionDescription>
              Upload your bank statements to categorize your transactions.
            </SectionDescription>
          </SectionHeader>
          <SectionContent>
            <FilesTable files={[]} />
          </SectionContent>
        </Section>
        <Section className="mt-0">
          <SectionHeader>
            <SectionTitle>Categories</SectionTitle>
            <SectionDescription>
              Categorize your transactions to get insights into your spending habits.
            </SectionDescription>
          </SectionHeader>
          <SectionContent>
            <CategoriesTable files={[]} />
          </SectionContent>
        </Section>
      </div>
      <ImportDialog />
    </HydrationBoundary>
  );
}
