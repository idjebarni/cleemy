import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from '../models/expense.model';

const api = 'http://localhost:3000/api/';
const apiKey = '1PDFmrpqi57wrzgZ8CAuiEyi0gl0Ncyc';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor(private http: HttpClient) {}

  getExpenses(params?: { _page: number; _limit: number; createdAt: string }): Observable<Expense[]> {
    return this.http.get<any>(api + 'expenseItems', { params: params });
  }

  getExpense(id: string): Observable<Expense> {
    return this.http.get<any>(api + `expenseItems/${id}`);
  }

  updateExpense(expense: Partial<Expense>): Observable<Expense> {
    return this.http.put<any>(api + `expenseItems/${expense.id}`, {
      purchasedOn: expense.purchasedOn,
      nature: expense.nature,
      comment: expense.comment,
      originalAmount: expense.originalAmount,
      convertedAmount: expense.convertedAmount,
    });
  }

  deleteExpense(id: string): Observable<Expense> {
    return this.http.delete<any>(api + `expenseItems/${id}`);
  }

  createExpense(expense: Partial<Expense>): Observable<Expense> {
    return this.http.post<any>(api + 'expenseItems', {
      purchasedOn: expense.purchasedOn,
      nature: expense.nature,
      comment: expense.comment,
      originalAmount: expense.originalAmount,
      convertedAmount: expense.convertedAmount,
    });
  }

  convertExpense(params: { to: string; from: string; amount: number }) {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: apiKey,
      }),
    };

    return this.http.get<any>(
      `https://api.apilayer.com/currency_data/convert?to=${params?.to}&from=${params?.from}&amount=${params?.amount}`,
      // @ts-ignore
      httpOptions,
    );
  }
}
