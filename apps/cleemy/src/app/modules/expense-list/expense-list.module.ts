import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseListComponent } from './expense-list.component';
import { ExpenseService } from './store/expense.service';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { ExpenseListRoutingModule } from './expense-list-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ExpenseFormModalComponent } from './components/expense-form/expense-form-modal.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzPipesModule } from 'ng-zorro-antd/pipes';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

const antModules = [
  NzInputNumberModule,
  NzCollapseModule,
  NzPipesModule,
  NzToolTipModule,
  NzInputModule,
  NzSelectModule,
  NzModalModule,
  NzPopconfirmModule,
  NzIconModule,
  NzDatePickerModule,
  NzTableModule,
  NzButtonModule,
  NzFormModule,
];

@NgModule({
  declarations: [ExpenseListComponent, ExpenseFormModalComponent],
  imports: [CommonModule, ExpenseListRoutingModule, HttpClientModule, SharedModule, ReactiveFormsModule, ...antModules],
  providers: [ExpenseService],
})
export class ExpenseListModule {}
