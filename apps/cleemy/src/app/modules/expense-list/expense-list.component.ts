import { Component, OnDestroy } from '@angular/core';
import { ExpenseService } from './store/expense.service';
import { Expense } from './models/expense.model';
import { TableColumn } from './models/table-column.model';
import { ExpenseFormModalComponent } from './components/expense-form/expense-form-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ExpenseActions } from './store/expense.actions';
import { ExpenseState } from './store/expense.state';
import { NzModalRef } from 'ng-zorro-antd/modal/modal-ref';

@Component({
  selector: 'cleemy-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
})
export class ExpenseListComponent implements OnDestroy {
  @Select(ExpenseState.expenses) expenses$: Observable<any> | undefined;
  @Select(ExpenseState.expensesTotal) totalCount$: Observable<any> | undefined;
  @Select(ExpenseState.loading) loading$: Observable<any> | undefined;

  columns: TableColumn[] = [
    {
      name: 'Purchased date',
      sortOrder: null,
      showSort: true,
      sortFn: (a: Expense, b: Expense) =>
        new Date(a.purchasedOn).getTime() > new Date(b.purchasedOn).getTime() ? -1 : 1,
    },
    {
      name: 'Nature',
      sortOrder: null,
      showSort: true,
      sortFn: (a: Expense, b: Expense) => a.nature.localeCompare(b.nature),
    },
    {
      name: 'Amount',
      sortOrder: null,
      showSort: true,
      sortFn: (a: Expense, b: Expense) => a.originalAmount.amount - b.originalAmount.amount,
    },
    {
      name: 'Comment',
      sortOrder: null,
      showSort: true,
      sortFn: (a: Expense, b: Expense) => a.comment.localeCompare(b.comment),
    },
    {
      name: 'Created date',
      sortOrder: null,
      showSort: true,
      sortFn: (a: Expense, b: Expense) => (new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? -1 : 1),
    },
    {
      name: 'Last modification date',
      sortOrder: null,
      showSort: true,
      sortFn: (a: Expense, b: Expense) =>
        new Date(a.lastModifiedAt).getTime() > new Date(b.lastModifiedAt).getTime() ? -1 : 1,
    },
    {
      name: 'Action',
      sortOrder: null,
      sortFn: null,
      showSort: false,
    },
  ];
  destroy$ = new Subject();
  convertedAmount: number | undefined;

  constructor(private expenseService: ExpenseService, private modal: NzModalService, private store: Store) {
    this.store.dispatch(new ExpenseActions.LoadExpenses());
  }

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
    const modalRef = this.openExpenseModal();
    modalRef.componentInstance?.submitExpense.pipe(takeUntil(this.destroy$)).subscribe((expense: Expense) => {
      this.store.dispatch(new ExpenseActions.CreateExpense(expense));
    });
  }

  deleteRow(id: string): void {
    this.store.dispatch(new ExpenseActions.DeleteExpense(id));
  }

  updateRow(expense: Partial<Expense>): void {
    const modalRef = this.openExpenseModal(expense);
    modalRef.componentInstance?.submitExpense.pipe(takeUntil(this.destroy$)).subscribe((expense: Expense) => {
      this.store.dispatch(new ExpenseActions.UpdateExpense(expense));
    });
  }

  private openExpenseModal(editedExpense?: Partial<Expense>): NzModalRef {
    const modalRef = this.modal.create({
      nzTitle: editedExpense ? 'Edit expense' : 'Create expense',
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
          label: editedExpense ? 'Edit' : 'Create',
          type: 'primary',
          onClick: () => {
            modalRef.componentInstance
              ?.submitForm()
              .then((success) => {
                if (success) modalRef.close();
              })
              .catch((error) => error);
          },
        },
      ],
      nzMaskClosable: false,
      nzClosable: false,
    });

    if (editedExpense) {
      modalRef?.componentInstance?.init(editedExpense as Partial<Expense>);
    }

    return modalRef;
  }
}
