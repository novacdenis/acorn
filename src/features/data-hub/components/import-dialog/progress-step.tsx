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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { formatNumber, getPercentageFromTotal } from "@/utils";

import { useImportDialogContext } from "./import-dialog";

export const ProgressStep: React.FC = () => {
  const { isMobile, transactions, progress, onCancelImport, onFinishImport, onStartImportReview } =
    useImportDialogContext();

  const [isCancelAlertOpen, setIsCancelAlertOpen] = React.useState(false);
  const [isDismissAlertOpen, setIsDismissAlertOpen] = React.useState(false);

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
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setIsCancelAlertOpen(true)}
          >
            Cancel import
          </Button>
        )}

        {isCompleted && (
          <>
            <Button
              variant="secondary"
              onClick={() => {
                if (progress.failed > 0) setIsDismissAlertOpen(true);
                else onFinishImport();
              }}
            >
              Dismiss
            </Button>
            {progress.failed > 0 && (
              <Button onClick={onStartImportReview}>
                Review failed {formatNumber(progress.failed, { notation: "compact" })} transactions
              </Button>
            )}
          </>
        )}
      </Footer>

      <AlertDialog open={isCancelAlertOpen} onOpenChange={() => setIsCancelAlertOpen(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              If you cancel the import, all remaining transactions will be skipped.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onCancelImport}>Yes, cancel</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDismissAlertOpen} onOpenChange={() => setIsDismissAlertOpen(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              If you dismiss the import, you will not be able to review failed transactions later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onFinishImport}>Yes, dismiss</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
