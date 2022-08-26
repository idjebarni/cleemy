import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Expense } from '../models/expense.model';
import { ExpenseService } from '../service/expense.service';
import { LoadableResource } from '../../shared/models/loadable-resource';
import { patch } from '@ngxs/store/operators';
import { catchError, filter, Subject, takeUntil, tap } from 'rxjs';
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
  public static expenses(state: ExpenseModel): Expense[] {
    return state.expenses.resource;
  }

  @Selector()
  public static expensesTotal(state: ExpenseModel): number | undefined {
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

  @Action(ExpenseActions.ConvertExpense, { cancelUncompleted: true })
  public convertExpense(
    { setState, getState, dispatch }: StateContext<ExpenseModel>,
    { id }: ExpenseActions.ConvertExpense,
  ) {
    const currentExpense: any = getState().expenses?.resource?.find((expense) => expense.id === id);
    if (currentExpense) {
      this.expenseService
        .convertExpense({
          to: 'EUR',
          from: currentExpense?.originalAmount.currency,
          amount: currentExpense?.originalAmount.amount,
        })
        .pipe(
          takeUntil(this.destroy$),
          filter((expenses) => !!expenses),
        )
        .subscribe((response) => {
          if (response.success) {
            setState(
              patch({
                expenses: setResource(
                  getState().expenses.resource.map((expense: any) => {
                    if (expense.id === id) {
                      return {
                        ...expense,
                        convertedAmount: {
                          ...expense.convertedAmount,
                          amount: response.result,
                        },
                      };
                    }
                  }),
                ),
              }),
            );
          }
        });
    }
  }

  @Action(ExpenseActions.Reset)
  public reset({ patchState }: StateContext<ExpenseModel>) {
    patchState({ expenses: new LoadableResource<Expense[]>() });
  }
}
