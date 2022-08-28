import { Expense } from '../models/expense.model';
import { TableFilters } from '../models/table-filters.model';

export namespace ExpenseActions {
  export class LoadExpenses {
    public static readonly type = '[Expenses] LOAD_EXPENSES';

    constructor(public filters: TableFilters) {}
  }

  export class CreateExpense {
    public static readonly type = '[Expenses] CREATE_EXPENSE';

    constructor(public expense: Partial<Expense>) {}
  }

  export class UpdateExpense {
    public static readonly type = '[Expenses] UPDATE_EXPENSE';

    constructor(public expense: Partial<Expense>) {}
  }

  export class UpdateTotalCount {
    public static readonly type = '[Expenses] UPDATE_TOTAL_COUNT';

    constructor(public total: number) {}
  }

  export class DeleteExpense {
    public static readonly type = '[Expenses] DELETE_EXPENSE';

    constructor(public id: string) {}
  }

  export class Reset {
    public static readonly type = '[Projects] RESET';

    constructor() {}
  }
}
