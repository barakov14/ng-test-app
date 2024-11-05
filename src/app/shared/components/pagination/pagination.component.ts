import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatOption, MatSelect, MatSelectChange} from "@angular/material/select";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";

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
  private _currentPage: number = 1;


  @Input({ required: true })
  set currentPage(value: number | null) {
    this._currentPage = value ?? 1;
  }

  get currentPage(): number {
    return this._currentPage;
  }


  @Input({required: true}) totalPages: number = 0;
  @Input() limit: number = 10;

  @Output() changePage = new EventEmitter<number>();
  @Output() changeLimit = new EventEmitter<number>();

  getPages() {
    const pagesToShow = 5; // Количество страниц, которое мы хотим отображать рядом с текущей
    const pages: (number | string)[] = [];

    if (this.totalPages <= pagesToShow + 4) {
      // Если общее количество страниц меньше порога, просто отображаем все страницы
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Всегда показываем первую и последнюю страницы
      pages.push(1);

      // Если текущая страница далеко от начала, добавляем многоточие
      if (this.currentPage > pagesToShow) {
        pages.push('...');
      }

      // Определяем диапазон страниц вокруг текущей
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
