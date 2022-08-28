import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Expense } from '../../models/expense.model';
import { TableColumn } from '../../models/table-column.model';
import { TableFilters } from '../../models/table-filters.model';
import { TableFilterType } from '../../models/table-filter-type.enum';

@Component({
  selector: 'cleemy-expense-table',
  templateUrl: './expense-table.component.html',
  styleUrls: ['./expense-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseTableComponent {
  @Input() expenses: Expense[] = [];
  @Input() loading = false;
  @Input() totalCount = 0;
  @Input() filters: TableFilters = { _page: 1, _limit: 5 };

  @Output() addExpense: EventEmitter<void> = new EventEmitter<void>();
  @Output() updateExpense: EventEmitter<Partial<Expense>> = new EventEmitter<Partial<Expense>>();
  @Output() deleteExpense: EventEmitter<string> = new EventEmitter<string>();
  @Output() filterUpdate: EventEmitter<{ type: string; value: number }> = new EventEmitter<{
    type: string;
    value: number;
  }>();

  tableFilters = TableFilterType;

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
      sortFn: (a: Expense, b: Expense) => a.nature?.localeCompare(b.nature),
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

  constructor() {}

  trackByName(index: number, item: TableColumn): string {
    return item.name;
  }

  resetSortAndFilters(): void {
    this.columns.forEach((item) => {
      item.sortOrder = null;
    });
  }

  onAddExpense() {
    this.addExpense.emit();
  }

  onUpdateExpense(expense: Partial<Expense>) {
    this.updateExpense.emit(expense);
  }

  onDeleteExpense(id: string) {
    this.deleteExpense.emit(id);
  }

  onFilterUpdate(params: { type: TableFilterType; value: number }) {
    this.filterUpdate.emit(params);
  }
}
