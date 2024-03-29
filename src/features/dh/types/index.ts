export interface Transaction {
  id: number;
  description: string;
  category_id: number;
  user_id: string;
  amount: number;
  timestamp: string;
}

export interface CreateTransactionBody {
  description: string;
  category_id: number;
  amount: number;
  timestamp: Date;
}
