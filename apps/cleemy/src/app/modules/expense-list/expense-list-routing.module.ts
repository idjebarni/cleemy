import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseListComponent } from './expense-list.component';
import { NotFoundComponent } from '../shared/components/not-found/not-found.component';
import { ExpenseFormModalComponent } from './components/expense-form/expense-form-modal.component';

const routes: Routes = [
  {
    path: '',
    component: ExpenseListComponent,
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: ':expenseId',
    component: ExpenseFormModalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseListRoutingModule {}
