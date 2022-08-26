import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseListComponent } from './expense-list.component';
import { ExpenseService } from './service/expense.service';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { ExpenseListRoutingModule } from './expense-list-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ExpenseFormModalComponent } from './components/expense-form/expense-form-modal.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [ExpenseListComponent, ExpenseFormModalComponent],
  imports: [
    CommonModule,
    ExpenseListRoutingModule,
    HttpClientModule,
    SharedModule,
    NzTableModule,
    NzButtonModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
    NzModalModule,
    NzPopconfirmModule,
    NzIconModule,
  ],
  providers: [ExpenseService],
})
export class ExpenseListModule {}
