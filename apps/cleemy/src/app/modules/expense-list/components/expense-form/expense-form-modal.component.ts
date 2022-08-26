import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import Currencies from '../../../shared/utils/currencies.json';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'cleemy-expense-form-modal',
  templateUrl: './expense-form-modal.component.html',
  styleUrls: ['./expense-form-modal.component.scss'],
})
export class ExpenseFormModalComponent implements OnInit {
  validateForm!: UntypedFormGroup;
  currencies: any = Object.keys(Currencies);
  editedExpense: Partial<Expense> | undefined;

  @Output() onConfirm: EventEmitter<Partial<Expense>> = new EventEmitter<Partial<Expense>>();

  constructor(private fb: UntypedFormBuilder, public modal: NzModalRef) {}

  submitForm(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (this.validateForm.valid) {
        const expense = {
          ...(this.editedExpense ?? null),
          purchasedOn: this.validateForm.value.purchasedOn,
          nature: this.validateForm.value.nature,
          comment: this.validateForm.value.comment,
          originalAmount: {
            amount: this.validateForm.value.originalAmount,
            currency: this.validateForm.value.originalCurrency,
          },
          convertedAmount: {
            amount: this.validateForm.value.convertedAmount,
            currency: this.validateForm.value.conversionCurrency,
          },
        };

        this.onConfirm.emit(expense);

        resolve(true);
      } else {
        Object.values(this.validateForm.controls).forEach((control) => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });

        reject(false);
      }
    });
  }

  init(editedExpense: Partial<Expense>) {
    this.editedExpense = editedExpense;
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      purchasedOn: [this.editedExpense?.purchasedOn ?? null, [Validators.required]],
      nature: [this.editedExpense?.nature ?? null, [Validators.required]],
      comment: [this.editedExpense?.comment ?? null, [Validators.required]],
      originalAmount: [this.editedExpense?.originalAmount?.amount ?? null, [Validators.required]],
      originalCurrency: [this.editedExpense?.originalAmount?.currency ?? 'USD', [Validators.required]],
      convertedAmount: [this.editedExpense?.convertedAmount?.amount ?? null, [Validators.required]],
      conversionCurrency: [this.editedExpense?.convertedAmount?.currency ?? 'EUR', [Validators.required]],
    });
  }
}
