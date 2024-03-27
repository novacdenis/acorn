import React from "react";
import { CheckCircleIcon, InformationCircleIcon, XCircleIcon } from "@heroicons/react/16/solid";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";

import { useImportDialogContext } from "./import-dialog";

export const ProgressStep: React.FC = () => {
  const { isMobile, transactions, progress, onCancelImport } = useImportDialogContext();

  const Header = isMobile ? DrawerHeader : DialogHeader;
  const Title = isMobile ? DrawerTitle : DialogTitle;
  const Description = isMobile ? DrawerDescription : DialogDescription;
  const Footer = isMobile ? DrawerFooter : DialogFooter;

  const percent = Math.round(((progress.imported + progress.failed) / progress.total) * 100);
  const title = React.useMemo(() => {
    if (progress.status === "idle") {
      return "Preparing import";
    }
    if (progress.status === "loading") {
      return `Importing ${transactions.find((t) => t.status === "loading")?.data.description}`;
    }
    if (progress.status === "done") {
      return "Import complete";
    }
    if (progress.status === "pause") {
      return "Import paused";
    }
  }, [progress.status, transactions]);

  return (
    <>
      <Header>
        <Title>Import progress</Title>
        <Description>
          Your data is being imported into the system. Please be patient as this operation may take
          some time to complete.
        </Description>
      </Header>

      <div className="overflow-hidden">
        <Progress value={percent} />
        <p className="mt-1 flex items-center justify-between text-sm font-medium text-muted-foreground">
          <span className="truncate">{title}</span>
          <span className="ml-2">{percent}%</span>
        </p>
      </div>

      <ul className="w-full space-y-2">
        <li className="flex items-center justify-between">
          <p className="flex items-center text-sm">
            <InformationCircleIcon className="h-4 w-4" />
            <span className="ml-1">Total transactions</span>
          </p>
          <p className="text-sm font-medium">{progress.total}</p>
        </li>
        <li className="flex items-center justify-between">
          <p className="flex items-center text-sm">
            <CheckCircleIcon className="h-4 w-4" />
            <span className="ml-1">Imported transactions</span>
          </p>
          <p className="flex items-center text-sm font-medium">
            <span>{progress.imported}</span>
          </p>
        </li>
        <li className="flex items-center justify-between">
          <p className="flex items-center text-sm">
            <XCircleIcon className="h-4 w-4" />
            <span className="ml-1">Failed transactions</span>
          </p>
          <p className="text-sm font-medium">{progress.failed}</p>
        </li>
      </ul>

      <Footer>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Cancel</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel imported</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel the import? This will skip t
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Dismiss</AlertDialogCancel>
              <AlertDialogAction onClick={onCancelImport}>Yes, cancel</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Footer>
    </>
  );
};
