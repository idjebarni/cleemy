import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from '../models/expense.model';

const apiKey = '1PDFmrpqi57wrzgZ8CAuiEyi0gl0Ncyc';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor(private http: HttpClient) {}

  getExpenses(): Observable<Expense[]> {
    return this.http.get<any>('http://localhost:3000/api/expenseItems');
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
