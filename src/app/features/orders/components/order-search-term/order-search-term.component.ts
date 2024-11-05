import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-order-search-term',
  standalone: true,
  templateUrl: './order-search-term.component.html',
  styleUrls: ['./order-search-term.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OrderSearchTermComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSearchTermComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

  value: string = '';

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value;
    this.cdr.detectChanges(); // Trigger change detection
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
    this.onTouched();
  }
}
