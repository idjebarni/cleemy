import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import Currencies from '../../../shared/utils/currencies.json';
import { Expense } from '../../models/expense.model';
import { ExpenseService } from '../../store/expense.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'cleemy-expense-form-modal',
  templateUrl: './expense-form-modal.component.html',
  styleUrls: ['./expense-form-modal.component.scss'],
})
export class ExpenseFormModalComponent implements OnInit, OnDestroy {
  @Output() submitExpense: EventEmitter<Partial<Expense>> = new EventEmitter<Partial<Expense>>();

  validateForm!: UntypedFormGroup;
  currencies: string[] = Currencies;
  editedExpense: Partial<Expense> | undefined;
  private destroy$ = new Subject();

  constructor(private fb: UntypedFormBuilder, private expenseService: ExpenseService) {}

  submitForm(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (this.validateForm.valid) {
        const expense = this.buildFormattedExpense();
        this.submitExpense.emit(expense);
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
    this.buildForm();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  convertAmount(originalAmount: string | number | undefined) {
    console.log(originalAmount);
    if (originalAmount?.toString().length === 0) {
      this.validateForm.get('convertedAmount')?.setValue(0);
      return;
    }

    const originalCurrency: string = this.validateForm.get('originalCurrency')?.value;
    this.expenseService
      .convertExpense({
        amount: originalAmount,
        from: originalCurrency,
        to: 'EUR',
      })
      .pipe(takeUntil(this.destroy$), debounceTime(50000), distinctUntilChanged())
      .subscribe((convertedAmount: any) => {
        this.validateForm.get('convertedAmount')?.setValue(Math.round(convertedAmount.result));
      });
  }

  private buildForm() {
    this.validateForm = this.fb.group({
      purchasedOn: [this.editedExpense?.purchasedOn ?? null, [Validators.required]],
      nature: [this.editedExpense?.nature ?? null, [Validators.required]],
      comment: [this.editedExpense?.comment ?? null, [Validators.required]],
      originalAmount: [this.editedExpense?.originalAmount?.amount ?? null],
      originalCurrency: [this.editedExpense?.originalAmount?.currency ?? 'USD'],
      convertedAmount: [this.editedExpense?.convertedAmount?.amount ?? null, [Validators.required]],
      conversionCurrency: [this.editedExpense?.convertedAmount?.currency ?? 'EUR', [Validators.required]],
    });
  }

  private buildFormattedExpense() {
    return {
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
  }
}
