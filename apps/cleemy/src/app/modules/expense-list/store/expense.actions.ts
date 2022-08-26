import { Expense } from '../models/expense.model';

export namespace ExpenseActions {
  export class LoadExpenses {
    public static readonly type = '[Expenses] LOAD_EXPENSES';

    constructor() {}
  }

  export class ConvertExpense {
    public static readonly type = '[Expenses] CONVERT_EXPENSE';

    constructor(public id: string) {}
  }

  export class CreateExpense {
    public static readonly type = '[Expenses] CREATE_EXPENSE';

    constructor(public expense: Partial<Expense>) {}
  }

  export class UpdateExpense {
    public static readonly type = '[Expenses] UPDATE_EXPENSE';

    constructor(public expense: Partial<Expense>) {}
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
