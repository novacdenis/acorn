import type { Metadata } from "next";

import React from "react";
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/ui/section";
import { CategoriesTableSkeleton, TransactionsTableSkeleton } from "@/features/data-hub";

import { Categories } from "./categories";
import { Transactions } from "./transactions";

export const metadata: Metadata = {
  title: "Data Hub",
};

export default async function ImportPage() {
  return (
    <div className="container">
      <Section>
        <SectionHeader>
          <SectionTitle>Transactions</SectionTitle>
          <SectionDescription>Track financial activities over time.</SectionDescription>
        </SectionHeader>
        <SectionContent>
          <React.Suspense fallback={<TransactionsTableSkeleton />}>
            <Transactions />
          </React.Suspense>
        </SectionContent>
      </Section>

      <Section className="mt-5">
        <SectionHeader>
          <SectionTitle>Categories</SectionTitle>
          <SectionDescription>
            Manage categories for tracking financial activities.
          </SectionDescription>
        </SectionHeader>
        <SectionContent>
          <React.Suspense fallback={<CategoriesTableSkeleton />}>
            <Categories />
          </React.Suspense>
        </SectionContent>
      </Section>
    </div>
  );
}
