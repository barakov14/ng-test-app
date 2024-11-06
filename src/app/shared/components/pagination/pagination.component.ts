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
  @Input() totalPages: number = 0;
  @Input() currentPage: number = 1;
  @Input() limit: number = 10;

  @Output() changePage = new EventEmitter<{ page: number, limit: number }>();
  @Output() changeLimit = new EventEmitter<number>();

  getPages(): (number | string)[] {
    let pages: (number | string)[] = [];
    const currentPage = this.currentPage
    pages.push(1);

    if (this.totalPages <= 7) {
      for (let i = 2; i <= this.totalPages; i++) {
        pages.push(i);
      }
    }

    else if (currentPage <= 4) {
      for (let i = 2; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(this.totalPages);
    }
    // Case when currentPage is at the end and there are more than 7 total pages
    else if (currentPage >= this.totalPages - 3) {
      pages.push('...');
      for (let i = this.totalPages - 4; i < this.totalPages; i++) {
        pages.push(i);
      }
      pages.push(this.totalPages);
    }
    else {
      pages.push('...');
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push('...');
      pages.push(this.totalPages);
    }

    if (this.totalPages <= 3) {
      pages = [];
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  }



  onChangePage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.changePage.emit({page, limit: this.limit});
    }
  }

  onChangeLimit(event: MatSelectChange) {
    this.changeLimit.emit(event.value);
  }

  protected readonly Number = Number;
}
