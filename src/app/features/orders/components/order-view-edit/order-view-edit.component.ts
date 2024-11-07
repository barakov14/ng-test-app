import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core'
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
} from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import {
  MatDatepickerInput,
  MatDatepickerModule,
} from '@angular/material/datepicker'
import { MatButton, MatIconButton } from '@angular/material/button'
import { provideNativeDateAdapter } from '@angular/material/core'
import { NgClass, NgIf, NgStyle } from '@angular/common'
import { MatIcon } from '@angular/material/icon'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NgxMaskDirective } from 'ngx-mask'
import {OrdersData} from "@app/feature/orders/models";

@Component({
  selector: 'app-order-view-edit',
  standalone: true,
  imports: [
    MatDialogTitle,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatDatepickerModule,
    MatDialogActions,
    MatButton,
    MatDatepickerInput,
    MatDialogContent,
    MatLabel,
    NgClass,
    MatIconButton,
    MatIcon,
    NgStyle,
    MatHint,
    NgIf,
    NgxMaskDirective,
    MatError,
  ],
  templateUrl: './order-view-edit.component.html',
  styleUrl: './order-view-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class OrderViewEditComponent implements OnInit {
  private dialogRef = inject(MatDialogRef)
  protected data: OrdersData = inject(MAT_DIALOG_DATA)
  private fb = inject(NonNullableFormBuilder)
  private destroyRef = inject(DestroyRef)

  form!: FormGroup
  mode: WritableSignal<'view' | 'edit'> = signal(this.data ? 'view' : 'edit')

  isFormValid = signal<boolean>(false)
  isFormDirty = signal<boolean>(false)

  constructor() {
    effect(() => {
      if (this.mode() === 'edit' && this.form.disabled) {
        this.form.enable()
      } else if (this.mode() === 'view' && this.form.enabled) {
        this.form.disable()
      }
    })
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      customerName: [
        this.data?.customerName || '',
        [Validators.required, Validators.minLength(3)],
      ],
      customerSource: [this.data?.customerSource || '', [Validators.required]],
      orderCost: [
        this.data?.orderCost || '',
        [Validators.required, Validators.min(1)],
      ],
      status: [this.data?.status || ''],
      quantity: [this.data?.quantity || ''],
      createdAt: [
        this.data?.createdAt ? new Date(this.data.createdAt) : new Date(), // Убедитесь, что date корректно передается и инициализируется
      ],
    })

    this.form.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((status) => {
        this.isFormValid.set(status === 'VALID')
      })

    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isFormDirty.set(this.form.dirty)
      })
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Closed':
        return 'closed'
      case 'Active':
        return 'active'
      case 'Pending':
        return 'pending'
      default:
        return ''
    }
  }

  cancel(): void {
    this.dialogRef.close()
  }

  save(): void {
    this.dialogRef.close({
      data: this.data
        ? { ...this.data, ...this.form.getRawValue() }
        : this.form.getRawValue(),
      mode: this.data ? 'edit' : 'create',
    })
  }
}
