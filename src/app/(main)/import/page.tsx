import type { Metadata } from "next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/ui/section";
import { Upload } from "@/features/import";
import {
  TransactionItem,
  TransactionItemAmount,
  TransactionItemCategory,
  TransactionItemDescription,
  TransactionItemIcon,
  TransactionItemTimestamp,
} from "@/features/monitoring";

export const metadata: Metadata = {
  title: "Import",
};

export default function ImportPage() {
  return (
    <Section className="mt-0">
      {/* <SectionHeader>
       <SectionTitle>Import</SectionTitle>
        <SectionDescription>
          Upload transactions from files for easy integration.
        </SectionDescription>
      </SectionHeader> */}
      <Upload />
    </Section>
  );
}
