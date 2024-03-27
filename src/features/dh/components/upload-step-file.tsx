import type { ProcessedFile } from "./upload-step";

import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/16/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { bytesToSize, cn } from "@/utils";

const countFormatter = new Intl.NumberFormat("ro-MD", {
  notation: "compact",
});

interface UploadStepFileStatusProps {
  file: ProcessedFile;
}

const UploadStepFileStatus: React.FC<UploadStepFileStatusProps> = ({ file }) => {
  if (file.status === "error") {
    return <p className="text-sm text-red-500">{file.error}</p>;
  }

  return (
    <p className="text-sm font-medium text-muted-foreground">
      <span>{bytesToSize(file.size)}</span>
      <span className="mx-1 inline-block">•</span>
      <span>
        {file.status === "done"
          ? `${countFormatter.format(file.transactions.length)} transactions`
          : "Processing file..."}
      </span>
    </p>
  );
};

export interface UploadStepFileProps {
  file: ProcessedFile;
  onRemove: () => void;
}

export const UploadStepFile: React.FC<UploadStepFileProps> = ({ file, onRemove }) => {
  return (
    <li
      className={cn("rounded-xl bg-primary/5 p-3", {
        "animate-pulse": file.status === "pending",
      })}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center">
            {file.status === "pending" && <Spinner className="h-4 w-4" />}
            {file.status === "done" && <CheckCircleIcon className="h-4 w-4" />}
            {file.status === "error" && <XCircleIcon className="h-4 w-4" />}

            <h3 className="ml-1.5 truncate">{file.name}</h3>
            <h4 className="">.{file.extension}</h4>
          </div>
          <UploadStepFileStatus file={file} />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="ml-3"
          disabled={file.status === "pending"}
          onClick={onRemove}
        >
          <TrashIcon className="h-5 w-5" />
        </Button>
      </div>
    </li>
  );
};
