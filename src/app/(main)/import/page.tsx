import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { Upload } from "@/features/import";

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
