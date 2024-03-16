export interface ExtractedTransaction {
  data: {
    description: string;
    category: string;
    amount: number;
    timestamp: number;
  };
  status: "extracted" | "pending" | "uploading" | "error";
  errors: string[];
}
