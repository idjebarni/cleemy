import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Expense } from '../models/expense.model';
import { ExpenseService } from './expense.service';
import { LoadableResource } from '../../shared/models/loadable-resource';
import { patch } from '@ngxs/store/operators';
import { catchError, Subject, tap } from 'rxjs';
import { ExpenseActions } from './expense.actions';
import { setError, setLoading, setResource } from '../../shared/utils/store-utils';

export interface ExpenseModel {
  expenses: LoadableResource<Expense[]>;
}

@State<ExpenseModel>({
  name: 'expenses',
  defaults: {
    expenses: new LoadableResource<Expense[]>(),
  },
})
@Injectable()
export class ExpenseState {
  destroy$ = new Subject();

  constructor(private expenseService: ExpenseService) {}

  @Selector()
  public static getState(state: ExpenseModel) {
    return state;
  }

  @Selector()
  public static loading(state: ExpenseModel) {
    return state.expenses.loading;
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
  public static expensesTotal(state: ExpenseModel): number | null | undefined {
    return state.expenses.total;
  }

  @Action(ExpenseActions.LoadExpenses, { cancelUncompleted: true })
  public loadExpenses({ setState }: StateContext<ExpenseModel>) {
    setState(patch({ expenses: setLoading(true) }));
    return this.expenseService.getExpenses().pipe(
      tap((expenses: Expense[]) => setState(patch({ expenses: setResource(expenses, expenses.length) }))),
      catchError((err) => {
        setState(patch({ expenses: setError(err) }));
        return err;
      }),
    );
  }

  @Action(ExpenseActions.DeleteExpense)
  public deleteExpense({ dispatch }: StateContext<ExpenseModel>, { id }: ExpenseActions.DeleteExpense) {
    return this.expenseService.deleteExpense(id).pipe(
      tap(() => {
        return dispatch(new ExpenseActions.LoadExpenses());
      }),
    );
  }

  @Action(ExpenseActions.CreateExpense)
  createExpense({ dispatch }: StateContext<ExpenseModel>, { expense }: ExpenseActions.CreateExpense) {
    return this.expenseService.createExpense(expense).pipe(
      tap(() => {
        return dispatch(new ExpenseActions.LoadExpenses());
      }),
    );
  }

  @Action(ExpenseActions.UpdateExpense)
  updateExpense({ dispatch }: StateContext<ExpenseModel>, { expense }: ExpenseActions.UpdateExpense) {
    return this.expenseService.updateExpense(expense).pipe(
      tap(() => {
        return dispatch(new ExpenseActions.LoadExpenses());
      }),
    );
  }

  @Action(ExpenseActions.Reset)
  public reset({ patchState }: StateContext<ExpenseModel>) {
    patchState({ expenses: new LoadableResource<Expense[]>() });
  }
}
