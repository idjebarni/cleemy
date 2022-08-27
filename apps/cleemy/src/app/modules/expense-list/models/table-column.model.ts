import { NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { Expense } from './expense.model';

export interface TableColumn {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<Expense> | null;
  showSort?: boolean;
}
