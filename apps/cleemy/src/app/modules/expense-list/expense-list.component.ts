import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExpenseService } from './service/expense.service';
import { Expense } from './models/expense.model';
import { TableColumn } from './models/table-column.model';
import { ExpenseFormModalComponent } from './components/expense-form/expense-form-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, Subject } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ExpenseActions } from './store/expense.actions';
import { ExpenseState } from './store/expense.state';

@Component({
  selector: 'cleemy-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
})
export class ExpenseListComponent implements OnInit, OnDestroy {
  @Select(ExpenseState.expenses) expenses$: Observable<any> | undefined;
  @Select(ExpenseState.expensesTotal) totalCount$: Observable<any> | undefined;

  columns: TableColumn[] = [
    {
      name: 'Id',
      sortOrder: null,
      sortFn: (a: Expense, b: Expense) => a.id.localeCompare(b.id),
    },
    {
      name: 'Purchased date',
      sortOrder: null,
      sortFn: null,
    },
    {
      name: 'Nature',
      sortOrder: null,
      sortFn: null,
    },
    {
      name: 'Original amount',
      sortOrder: null,
      sortFn: (a: Expense, b: Expense) => a.originalAmount.amount - b.originalAmount.amount,
    },
    {
      name: 'Converted amount',
      sortOrder: null,
      sortFn: (a: Expense, b: Expense) => a.convertedAmount.amount - b.convertedAmount.amount,
    },
    {
      name: 'Comment',
      sortOrder: null,
      sortFn: null,
    },
    {
      name: 'Created date',
      sortOrder: null,
      sortFn: null,
    },
    {
      name: 'Last modification date',
      sortOrder: null,
      sortFn: null,
    },
    {
      name: 'Action',
      sortOrder: null,
      sortFn: null,
    },
  ];
  destroy$ = new Subject();
  convertedAmount: number | undefined;

  constructor(private expenseService: ExpenseService, private modal: NzModalService, private store: Store) {
    this.store.dispatch(new ExpenseActions.LoadExpenses());
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  trackByName(_: number, item: TableColumn): string {
    return item.name;
  }

  resetSortAndFilters(): void {
    this.columns.forEach((item) => {
      item.sortOrder = null;
    });
  }

  addExpense() {
    const modalRef = this.modal.create({
      nzTitle: 'Add expense',
      nzContent: ExpenseFormModalComponent,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => {
            modalRef.close();
          },
        },
        {
          label: 'Add',
          type: 'primary',
          onClick: () => {
            modalRef.componentInstance?.submitForm();
          },
        },
      ],
      nzMaskClosable: false,
      nzClosable: false,
    });
  }

  deleteRow(id: string): void {
    console.log(id);
  }
}
