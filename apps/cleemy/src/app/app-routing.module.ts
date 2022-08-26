import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'expense-list',
    loadChildren: () => import('./modules/expense-list/expense-list.module').then((m) => m.ExpenseListModule),
  },
  { path: '**', redirectTo: 'expense-list' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
