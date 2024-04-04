import type { Metadata } from "next";

import React from "react";
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/ui/section";
import {
  CategoriesTableSkeleton,
  ImportDialog,
  TransactionsTableSkeleton,
} from "@/features/data-hub";

import { Categories } from "./categories";
import { Transactions } from "./transactions";

export const metadata: Metadata = {
  title: "Data Hub",
};

export default async function ImportPage() {
  return (
    <>
      <div className="container">
        <React.Suspense
          fallback={
            <Section>
              <SectionHeader>
                <SectionTitle>Transactions</SectionTitle>
                <SectionDescription>Track financial activities over time.</SectionDescription>
              </SectionHeader>
              <SectionContent>
                <TransactionsTableSkeleton />
              </SectionContent>
            </Section>
          }
        >
          <Transactions />
        </React.Suspense>

        <React.Suspense
          fallback={
            <Section>
              <SectionHeader>
                <SectionTitle>Categories</SectionTitle>
                <SectionDescription>
                  Manage categories for tracking financial activities.
                </SectionDescription>
              </SectionHeader>
              <SectionContent>
                <CategoriesTableSkeleton />
              </SectionContent>
            </Section>
          }
        >
          <Categories />
        </React.Suspense>
      </div>
      <ImportDialog />
    </>
  );
}
