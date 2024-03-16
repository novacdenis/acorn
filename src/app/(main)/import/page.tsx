import type { Metadata } from "next";
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/ui/section";
import { Upload } from "@/features/import";

export const metadata: Metadata = {
  title: "Import",
};

export default function ImportPage() {
  return (
    <Section className="mt-0">
      <SectionHeader>
        <SectionTitle>Import</SectionTitle>
        <SectionDescription>
          Upload transactions from files for easy integration.
        </SectionDescription>
      </SectionHeader>
      <SectionContent>
        <Upload />
      </SectionContent>
    </Section>
  );
}
