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
  @Input({ required: true }) totalPages: number = 0;
  @Input({ required: true }) currentPage: number = 1;
  @Input({ required: true }) limit: number = 10;

  @Output() changePage = new EventEmitter<number>();
  @Output() changeLimit = new EventEmitter<number>();

  getPages() {
    let pages: (number | string)[] = [];

    pages.push(1);

    if (this.totalPages <= 7) {
      for (let i = 2; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else if (this.currentPage <= 4) {
      for (let i = 2; i <= 5; i++) {
        pages.push(Number(i));
      }
      pages.push('...');
      pages.push(Number(this.totalPages));
    } else if (this.currentPage >= this.totalPages - 3) {
      // Case 2: Close to the end (show last few pages)
      pages.push('...');
      for (let i = this.totalPages - 4; i < this.totalPages; i++) {
        pages.push(Number(i));
      }
      pages.push(Number(this.totalPages));
    } else {
      pages.push('...');
      pages.push(Number(this.currentPage) - 1);
      pages.push(Number(this.currentPage));
      pages.push(Number(this.currentPage) + 1);
      pages.push('...');
      pages.push(Number(this.totalPages));
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

  protected readonly Number = Number;
}
