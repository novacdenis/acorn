export type Bank = "vb";

interface ExtractedTransactionIdleStatus {
  status: "idle";
}

interface ExtractedTransactionLoadingStatus {
  status: "loading";
}

interface ExtractedTransactionErrorStatus {
  status: "error";
  error?: string;
  errors?: { [key: string]: string };
}

interface ExtractedTransactionDoneStatus {
  status: "done";
}

export interface ExtractedTransactionBase {
  uid: string;
  data: {
    category: string;
    description: string;
    amount: number;
    timestamp: Date;
  };
}
export type ExtractedTransactionStatus =
  | ExtractedTransactionIdleStatus
  | ExtractedTransactionLoadingStatus
  | ExtractedTransactionErrorStatus
  | ExtractedTransactionDoneStatus;

export type ExtractedTransaction = ExtractedTransactionBase & ExtractedTransactionStatus;
