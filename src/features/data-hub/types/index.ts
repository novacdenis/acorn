export const enum Step {
  Select = "select",
  Progress = "progress",
  Review = "review",
}

export type Bank = "vb";

interface ProcessedFileExtracting {
  status: "extracting";
}

interface ProcessedFileDone {
  status: "done";
  transactions: ExtractedTransaction[];
}

interface ProcessedFileError {
  status: "error";
  error: string;
}

export type ProcessedFile = {
  uid: string;
  name: string;
  extension: string;
  size: number;
  originalFile: File;
  bank: Bank;
} & (ProcessedFileExtracting | ProcessedFileDone | ProcessedFileError);

export interface ExtractedTransactionData {
  description: string;
  category: string;
  amount: number;
  timestamp: string;
}

export interface ExtractedTransaction {
  uid: string;
  data: ExtractedTransactionData;
  status: "pending" | "uploading" | "done" | "error";
  errors?: { [K in keyof ExtractedTransactionData | "general"]?: string };
}
