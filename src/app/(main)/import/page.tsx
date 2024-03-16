import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/ui/section";
import { Upload } from "@/features/import";

export default function ImportPage() {
  return (
    <Section className="mt-0">
      <SectionHeader>
        <SectionTitle>Import</SectionTitle>
        <SectionDescription>Import your transactions from a file</SectionDescription>
      </SectionHeader>
      <SectionContent>
        <Upload />
      </SectionContent>
    </Section>
  );
}
