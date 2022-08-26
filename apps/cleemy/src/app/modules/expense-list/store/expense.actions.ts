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
    public static readonly type = '[Expenses] ADD_EXPENSE';

    constructor(public id: string) {}
  }

  export class EditExpense {
    public static readonly type = '[Expenses] EDIT_EXPENSE';

    constructor(public id: string) {}
  }

  export class RemoveExpense {
    public static readonly type = '[Expenses] EDIT_EXPENSE';

    constructor(public id: string) {}
  }

  export class Reset {
    public static readonly type = '[Projects] RESET';

    constructor() {}
  }
}
