import type { Metadata } from "next";

import {
  CheckCircleIcon,
  CheckIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import { CloudArrowUpIcon } from "@heroicons/react/20/solid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Section } from "@/components/ui/section";
import { Upload } from "@/features/import";

export const metadata: Metadata = {
  title: "Import",
};

export default function ImportPage() {
  return (
    <Section className="mt-0">
      <div className="mx-auto flex max-w-72 flex-col items-center rounded-2xl py-16 md:py-24">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-md">
            <CloudArrowUpIcon className="h-8 w-8 text-background" />
          </div>
        </div>

        <h3 className="mt-4 text-lg text-primary">Import progress</h3>
        <p className="mt-px text-center text-sm leading-normal text-muted-foreground">
          Your transactions are being processed. This may take a few minutes.
        </p>

        <Progress value={33} className="my-4" />

        <ul className="w-full space-y-2">
          <li className="flex items-center justify-between">
            <p className="flex items-center text-sm">
              <InformationCircleIcon className="h-4 w-4 text-primary" />
              <span className="ml-1">Total transactions</span>
            </p>
            <p className="text-sm font-medium">123</p>
          </li>
          <li className="flex items-center justify-between">
            <p className="flex items-center text-sm">
              <CheckCircleIcon className="h-4 w-4 text-primary" />
              <span className="ml-1">Processed transactions</span>
            </p>
            <p className="flex items-center text-sm font-medium">
              <span>12</span>
            </p>
          </li>
          <li className="flex items-center justify-between">
            <p className="flex items-center text-sm">
              <XCircleIcon className="h-4 w-4 text-primary" />
              <span className="ml-1">Failed transactions</span>
            </p>
            <p className="text-sm font-medium">2</p>
          </li>
        </ul>
      </div>
    </Section>
  );
}
