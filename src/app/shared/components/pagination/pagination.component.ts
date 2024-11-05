import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatOption, MatSelect, MatSelectChange} from "@angular/material/select";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgForOf,
    MatSelect,
    MatOption,
    MatIcon,
    MatIconButton,
    MatButton
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  @Input({required: true}) totalPages: number = 0;


  @Input({ required: true })
  set currentPage(value: number | null) {
    this._currentPage = value ?? 1;
  }
  @Input({ required: true })
  set limit(value: number | null) {
    this._limit = value ?? 10;
  }

  private _currentPage: number = 1;
  private _limit: number = 10;

  get currentPage(): number {
    return Number(this._currentPage);
  }
  get limit(): number {
    return Number(this._limit);
  }


  @Output() changePage = new EventEmitter<number>();
  @Output() changeLimit = new EventEmitter<number>();

  getPages() {
    const pagesToShow = 5;
    const pages: (number | string)[] = [];

    console.log('Total pages:', this.totalPages);

    if (this.totalPages <= pagesToShow + 4) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (this.currentPage > pagesToShow) {
        pages.push('...');
      }

      const start = Math.max(2, this.currentPage - 2);
      const end = Math.min(this.totalPages - 1, this.currentPage + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Если текущая страница далеко от конца, добавляем многоточие
      if (this.currentPage < this.totalPages - pagesToShow) {
        pages.push('...');
      }

      pages.push(this.totalPages);
    }

    return pages;
  }

  onChangePage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.changePage.emit(page);
    }
  }

  onChangeLimit(event: MatSelectChange) {
    this.changeLimit.emit(event.value);
  }

}
