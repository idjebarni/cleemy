export interface Expense {
  id: string;
  purchasedOn: Date;
  nature: string;
  originalAmount: {
    amount: number;
    currency: string;
  };
  convertedAmount: {
    amount: number;
    currency: string;
  };
  comment: string;
  createdAt: string;
  lastModifiedAt: string;
}
