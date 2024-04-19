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
import { formatNumber, getPercentageFromTotal } from "@/utils";

import { useImportDialog } from "./import-dialog";

export const ProgressStep: React.FC = () => {
  const { isMobile, transactions, progress, abortImport, onCloseImport, onProgressComplete } =
    useImportDialog();

  const Header = isMobile ? DrawerHeader : DialogHeader;
  const Title = isMobile ? DrawerTitle : DialogTitle;
  const Description = isMobile ? DrawerDescription : DialogDescription;
  const Footer = isMobile ? DrawerFooter : DialogFooter;

  const percentage = getPercentageFromTotal(progress.imported + progress.failed, progress.total);
  const title = React.useMemo(() => {
    if (progress.status === "idle") {
      return "Preparing import...";
    }
    if (progress.status === "loading") {
      return `Importing ${transactions.find((t) => t.status === "loading")?.data.description}`;
    }
    if (progress.status === "cancelled") {
      return "Import cancelled";
    }
    if (progress.status === "done") {
      return "Import complete";
    }
  }, [progress.status, transactions]);

  const isInProgress = progress.status === "loading";
  const isCompleted = progress.status === "cancelled" || progress.status === "done";

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
        <Progress value={percentage} />
        <p className="mt-1 flex items-center justify-between px-0.5 text-xs font-medium text-muted-foreground">
          <span className="truncate">{title}</span>
          <span className="ml-2">{percentage}%</span>
        </p>
      </div>

      <ul className="w-full space-y-2">
        <li className="flex items-center justify-between">
          <p className="flex items-center text-sm">
            <InformationCircleIcon className="h-4 w-4" />
            <span className="ml-1">Total transactions</span>
          </p>
          <p className="text-sm font-medium">{formatNumber(progress.total)}</p>
        </li>
        <li className="flex items-center justify-between">
          <p className="flex items-center text-sm">
            <CheckCircleIcon className="h-4 w-4" />
            <span className="ml-1">Imported transactions</span>
          </p>
          <p className="flex items-center text-sm font-medium">
            <span>{formatNumber(progress.imported)}</span>
          </p>
        </li>
        <li className="flex items-center justify-between">
          <p className="flex items-center text-sm">
            <XCircleIcon className="h-4 w-4" />
            <span className="ml-1">Failed transactions</span>
          </p>
          <p className="text-sm font-medium">{formatNumber(progress.failed)}</p>
        </li>
      </ul>

      <Footer>
        {isInProgress && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Abort import
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  If you abort the import, all remaining transactions will be skipped.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No, continue</AlertDialogCancel>
                <AlertDialogAction onClick={abortImport}>Yes, abort</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {isCompleted && (
          <>
            <Button variant="secondary" onClick={onCloseImport}>
              Dismiss
            </Button>
            {!!progress.failed && (
              <Button onClick={onProgressComplete}>
                Review {formatNumber(progress.failed, { notation: "compact" })} failed transactions
              </Button>
            )}
          </>
        )}
      </Footer>
    </>
  );
};
