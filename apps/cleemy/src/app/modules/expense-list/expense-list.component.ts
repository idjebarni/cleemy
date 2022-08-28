import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ExpenseService } from './store/expense.service';
import { Expense } from './models/expense.model';
import { ExpenseFormModalComponent } from './components/expense-form/expense-form-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ExpenseActions } from './store/expense.actions';
import { ExpenseState } from './store/expense.state';
import { NzModalRef } from 'ng-zorro-antd/modal/modal-ref';
import { TableFilters } from './models/table-filters.model';

@Component({
  selector: 'cleemy-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
})
export class ExpenseListComponent implements OnInit, OnChanges, OnDestroy {
  @Select(ExpenseState.expenses) expenses$: Observable<any> | undefined;
  @Select(ExpenseState.expensesTotal) totalCount$: Observable<any> | undefined;
  @Select(ExpenseState.loading) loading$: Observable<any> | undefined;
  @Select(ExpenseState.error) error$: Observable<any> | undefined;
  @Select(ExpenseState.filters) filters$!: Observable<TableFilters>;

  destroy$ = new Subject();
  convertedAmount: number | undefined;

  filters: TableFilters = {
    _page: 1,
    _limit: 5,
  };

  constructor(private expenseService: ExpenseService, private modal: NzModalService, private store: Store) {}

  ngOnInit() {
    this.filters$?.pipe(takeUntil(this.destroy$)).subscribe((filters: TableFilters) => {
      this.filters = filters;
    });
    console.log(this.filters);
    this.loadExpenses(this.filters);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filters']) {
      console.log(changes);
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  loadExpenses(filters: TableFilters) {
    this.store.dispatch(new ExpenseActions.LoadExpenses(filters));
  }

  addExpense() {
    const modalRef = this.openExpenseModal();
    modalRef.componentInstance?.submitExpense.pipe(takeUntil(this.destroy$)).subscribe((expense: Expense) => {
      console.log(this.filters);
      this.store.dispatch(new ExpenseActions.CreateExpense(expense));
    });
  }

  deleteExpense(id: string): void {
    console.log(this.filters);
    this.store.dispatch(new ExpenseActions.DeleteExpense(id));
  }

  updateExpense(expense: Partial<Expense>): void {
    const modalRef = this.openExpenseModal(expense);
    modalRef.componentInstance?.submitExpense.pipe(takeUntil(this.destroy$)).subscribe((expense: Expense) => {
      this.store.dispatch(new ExpenseActions.UpdateExpense(expense));
    });
  }

  filterUpdate(params: { type: string; value: number }) {
    switch (params?.type) {
      case 'pageSize':
        this.store.dispatch(new ExpenseActions.LoadExpenses({ ...this.filters, _limit: params.value }));
        break;

      case 'pageIndex':
        this.store.dispatch(new ExpenseActions.LoadExpenses({ ...this.filters, _page: params.value }));
        break;

      default:
        break;
    }
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
                if (success) {
                  modalRef.close();
                }
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
