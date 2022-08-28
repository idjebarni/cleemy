import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Expense } from '../models/expense.model';
import { ExpenseService } from './expense.service';
import { LoadableResource } from '../../shared/models/loadable-resource';
import { patch } from '@ngxs/store/operators';
import { catchError, Subject, tap } from 'rxjs';
import { ExpenseActions } from './expense.actions';
import { setError, setLoading, setResource } from '../../shared/utils/store-utils';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TableFilters } from '../models/table-filters.model';

export interface ExpenseModel {
  expenses: LoadableResource<Expense[]>;
  filters: TableFilters;
}

@State<ExpenseModel>({
  name: 'expenses',
  defaults: {
    expenses: new LoadableResource<Expense[]>(),
    filters: { _page: 1, _limit: 5 },
  },
})
@Injectable()
export class ExpenseState {
  destroy$ = new Subject();

  constructor(private expenseService: ExpenseService, private notification: NzNotificationService) {}

  @Selector()
  public static getState(state: ExpenseModel) {
    return state;
  }

  @Selector()
  public static loading(state: ExpenseModel): boolean {
    return state.expenses.loading;
  }

  @Selector()
  public static filters(state: ExpenseModel): TableFilters {
    return { ...state.filters };
  }

  @Selector()
  public static error(state: ExpenseModel) {
    return state.expenses.error;
  }

  @Selector()
  public static expenses(state: ExpenseModel): Expense[] | null {
    return state.expenses.resource;
  }

  @Selector()
  public static expensesTotal(state: ExpenseModel): number {
    return state?.expenses?.total as number;
  }

  @Action(ExpenseActions.LoadExpenses, { cancelUncompleted: true })
  public loadExpenses({ setState, getState }: StateContext<ExpenseModel>, { filters }: ExpenseActions.LoadExpenses) {
    setState(patch({ expenses: setLoading(true) }));
    return this.expenseService.getExpenses(filters).pipe(
      tap((expenses: Expense[]) => {
        setState(patch({ filters: filters }));
        setState(patch({ expenses: setResource(expenses, getState().expenses.total as number) }));
      }),
      catchError((error) => {
        setState(patch({ expenses: setError(error) }));
        return error;
      }),
    );
  }

  @Action(ExpenseActions.DeleteExpense)
  public deleteExpense(
    { dispatch, setState, getState }: StateContext<ExpenseModel>,
    { id }: ExpenseActions.DeleteExpense,
  ) {
    return this.expenseService.deleteExpense(id).pipe(
      tap(() => {
        this.notification.blank('Good job!', 'Your expense was deleted successfully!', {
          nzPlacement: 'top',
          nzClass: 'toast success',
        });
        setState(patch({ filters: getState().filters }));
        return dispatch(new ExpenseActions.LoadExpenses(getState().filters));
      }),
      catchError((error) => {
        this.notification.blank('Something went wrong', 'If the problem persists try refreshing.', {
          nzPlacement: 'top',
          nzClass: 'toast error',
        });
        return error;
      }),
    );
  }

  @Action(ExpenseActions.CreateExpense)
  createExpense(
    { dispatch, setState, getState }: StateContext<ExpenseModel>,
    { expense }: ExpenseActions.CreateExpense,
  ) {
    return this.expenseService.createExpense(expense).pipe(
      tap(() => {
        this.notification.blank('Good job!', 'Your expense was created successfully!', {
          nzPlacement: 'top',
          nzClass: 'toast success',
        });
        setState(patch({ filters: getState().filters }));
        return dispatch(new ExpenseActions.LoadExpenses(getState().filters));
      }),
      catchError((error) => {
        this.notification.blank('Something went wrong', error, {
          nzPlacement: 'top',
          nzClass: 'toast error',
        });
        return error;
      }),
    );
  }

  @Action(ExpenseActions.UpdateExpense)
  updateExpense(
    { dispatch, setState, getState }: StateContext<ExpenseModel>,
    { expense }: ExpenseActions.UpdateExpense,
  ) {
    return this.expenseService.updateExpense(expense).pipe(
      tap(() => {
        this.notification.blank('Good job!', 'Your expense was updated successfully!', {
          nzPlacement: 'top',
          nzClass: 'toast success',
        });
        setState(patch({ filters: getState().filters }));
        return dispatch(new ExpenseActions.LoadExpenses(getState().filters));
      }),
      catchError((error) => {
        this.notification.blank('Oops!', 'It looks like something went wrong.', {
          nzPlacement: 'top',
          nzClass: 'toast error',
        });
        return error;
      }),
    );
  }

  @Action(ExpenseActions.UpdateTotalCount)
  updateTotal({ getState, setState }: StateContext<ExpenseModel>, { total }: ExpenseActions.UpdateTotalCount) {
    setState(patch({ expenses: setResource(getState().expenses.resource, total) }));
  }

  @Action(ExpenseActions.Reset)
  public reset({ patchState }: StateContext<ExpenseModel>) {
    patchState({ expenses: new LoadableResource<Expense[]>() });
  }
}
