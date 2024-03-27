"use client";

import React from "react";
import { CheckCircleIcon, InformationCircleIcon, XCircleIcon } from "@heroicons/react/16/solid";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { useMediaQuery } from "@/hooks";

import { useImportDialogContext, useImportDialogStore } from "./import-dialog";

export const ProgressStep: React.FC = () => {
  const { setIsOpen } = useImportDialogStore((store) => ({ setIsOpen: store.setIsOpen }));
  const { transactions } = useImportDialogContext();

  const isMobile = useMediaQuery("(max-width: 640px)");

  const Header = isMobile ? DrawerHeader : DialogHeader;
  const Title = isMobile ? DrawerTitle : DialogTitle;
  const Description = isMobile ? DrawerDescription : DialogDescription;
  const Footer = isMobile ? DrawerFooter : DialogFooter;

  const total = transactions.length;
  const imported = transactions.filter((t) => t.status === "done").length;
  const failed = transactions.filter((t) => t.status === "error").length;
  const percent = Math.round(((imported + failed) / total) * 100);

  const title = React.useMemo(() => {
    const active = transactions.find((t) => t.status === "uploading");

    if (active) {
      return active.data.description;
    }

    if (percent === 100) {
      return "Completed";
    }

    return "...";
  }, [percent, transactions]);

  return (
    <>
      <Header>
        <Title>Importing data</Title>
        <Description>Your data is being imported. This may take a few minutes.</Description>
      </Header>

      <div className="overflow-hidden">
        <Progress value={percent} />
        <p className="mt-1 flex items-center justify-between text-sm font-medium text-muted-foreground">
          <span className="truncate">Importing: {title}</span>
          <span className="ml-2">{percent}%</span>
        </p>
      </div>

      <ul className="w-full space-y-2">
        <li className="flex items-center justify-between">
          <p className="flex items-center text-sm">
            <InformationCircleIcon className="h-4 w-4" />
            <span className="ml-1">Total transactions</span>
          </p>
          <p className="text-sm font-medium">{total}</p>
        </li>
        <li className="flex items-center justify-between">
          <p className="flex items-center text-sm">
            <CheckCircleIcon className="h-4 w-4" />
            <span className="ml-1">Imported transactions</span>
          </p>
          <p className="flex items-center text-sm font-medium">
            <span>{imported}</span>
          </p>
        </li>
        <li className="flex items-center justify-between">
          <p className="flex items-center text-sm">
            <XCircleIcon className="h-4 w-4" />
            <span className="ml-1">Failed transactions</span>
          </p>
          <p className="text-sm font-medium">{failed}</p>
        </li>
      </ul>

      <Footer>
        <Button
          variant="ghost"
          disabled={transactions.some((t) => t.status === "uploading")}
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>
        <Button>Continue</Button>
      </Footer>
    </>
  );
};
