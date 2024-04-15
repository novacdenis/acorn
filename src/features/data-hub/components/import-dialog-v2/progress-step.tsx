import React from "react";
import { CheckCircleIcon, InformationCircleIcon, XCircleIcon } from "@heroicons/react/16/solid";
import { useQueryClient } from "@tanstack/react-query";
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
import { formatNumber, getPercentageFromTotal, queryMather } from "@/utils";

import { useImportDialog } from "./import-dialog";

export const ProgressStep: React.FC = () => {
  const { isMobile, transactions, progress, resetState, abortImport } = useImportDialog();

  const [isDismissAlertOpen, setIsDismissAlertOpen] = React.useState(false);

  const queryClient = useQueryClient();

  const onCancel = () => {
    queryClient.refetchQueries({ predicate: queryMather(["transactions", "categories"]) });
    resetState();
  };

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
                <AlertDialogCancel>Go back</AlertDialogCancel>
                <AlertDialogAction onClick={abortImport}>Yes, cancel</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </Footer>

      <AlertDialog open={isDismissAlertOpen} onOpenChange={setIsDismissAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              If you dismiss the import, you will not be able to review failed transactions later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go back</AlertDialogCancel>
            <AlertDialogAction onClick={onCancel}>Yes, dismiss</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
