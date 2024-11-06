import {ChangeDetectionStrategy, Component, effect, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {OrdersData} from "../../models/orders.model";
import {FormGroup, NonNullableFormBuilder, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatButton, MatIconButton} from "@angular/material/button";
import {provideNativeDateAdapter} from "@angular/material/core";
import {NgClass} from "@angular/common";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-order-view-edit',
  standalone: true,
  imports: [
    MatDialogTitle,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatDialogActions,
    MatButton,
    MatDatepickerInput,
    MatDialogContent,
    MatLabel,
    NgClass,
    MatIconButton,
    MatIcon
  ],
  templateUrl: './order-view-edit.component.html',
  styleUrl: './order-view-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()]
})
export class OrderViewEditComponent implements OnInit {
  private dialogRef = inject(MatDialogRef)
  protected data: OrdersData = inject(MAT_DIALOG_DATA)
  private fb = inject(NonNullableFormBuilder)


  form!: FormGroup;
  mode: WritableSignal<'view' | 'edit'> = signal(this.data ? 'view': 'edit');


  constructor() {
    effect(() => {
      if(this.mode() && this.form.disabled) {
        this.form.enable()
      } else if(this.mode() === 'view' && this.form.enabled) {
        this.form.disable()
      }
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      customerName: [this.data?.customerName || ''],
      customerSource: [this.data?.customerSource || ''],
      orderCost: [this.data?.orderCost || 0],
      status: [this.data?.status || ''],
      createdAt: [this.data?.createdAt || new Date()],
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Closed':
        return 'closed';
      case 'Active':
        return 'active';
      case 'Pending':
        return 'pending';
      default:
        return '';
    }
  }


  cancel() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close({
      // send form with data if it's edit, else if creating order send formData only
      data: () => this.data ? {...this.form.getRawValue(), ...this.data} : this.form.getRawValue(),

      // recognize if it's edit or create
      mode: this.data ? 'edit' : 'create'
    });
  }

}
