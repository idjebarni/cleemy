import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import Currencies from '../../../shared/utils/currencies.json';
import { Expense } from '../../models/expense.model';
import { ExpenseService } from '../../store/expense.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'cleemy-expense-form-modal',
  templateUrl: './expense-form-modal.component.html',
  styleUrls: ['./expense-form-modal.component.scss'],
})
export class ExpenseFormModalComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Output() submitExpense: EventEmitter<Partial<Expense>> = new EventEmitter<Partial<Expense>>();

  validateForm!: UntypedFormGroup;
  currencies: string[] = Currencies;
  editedExpense: Partial<Expense> | undefined;
  private destroy$ = new Subject();
  conversionLoading = false;

  constructor(private fb: UntypedFormBuilder, private expenseService: ExpenseService, private cdr: ChangeDetectorRef) {}

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

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  init(editedExpense: Partial<Expense>) {
    this.editedExpense = editedExpense;
  }

  ngOnInit(): void {
    this.buildForm();
    this.refreshAmountInput();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  handleConversionProcess(originalAmount: string | number | undefined) {
    this.validateForm.controls['convertedAmount'].disable();
    if (originalAmount?.toString().length === 0) {
      this.validateForm.controls['convertedAmount'].enable();
      this.validateForm.get('convertedAmount')?.setValue(0);
      return;
    }

    this.conversionLoading = true;

    const originalCurrency: string = this.validateForm.get('originalCurrency')?.value;
    this.expenseService
      .convertExpense({
        amount: originalAmount,
        from: originalCurrency,
        to: 'EUR',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((convertedAmount) => {
        this.validateForm.get('convertedAmount')?.setValue(Math.round(convertedAmount.result));
        this.conversionLoading = false;
      });
  }

  private refreshAmountInput() {
    this.validateForm.get('originalAmount')?.valueChanges.subscribe((originalAmount) => {
      if (originalAmount?.toString().length === 0) {
        this.validateForm.controls['convertedAmount'].enable();
        this.validateForm.get('convertedAmount')?.setValue(0);
        return;
      }
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
    const formValues = this.validateForm.getRawValue();
    return {
      ...(this.editedExpense ?? null),
      purchasedOn: formValues.purchasedOn,
      nature: formValues.nature,
      comment: formValues.comment,
      originalAmount: {
        amount: formValues.originalAmount,
        currency: formValues.originalCurrency,
      },
      convertedAmount: {
        amount: formValues.convertedAmount,
        currency: formValues.conversionCurrency,
      },
    };
  }
}
