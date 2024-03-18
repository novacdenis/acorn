import type { Metadata } from "next";

import { Section } from "@/components/ui/section";
import { Upload } from "@/features/import";

export const metadata: Metadata = {
  title: "Import",
};

export default function ImportPage() {
  return (
    <Section className="mt-0">
      <Upload />
    </Section>
  );
}
