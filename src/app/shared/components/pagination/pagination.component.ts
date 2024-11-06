import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core'
import { NgClass, NgIf } from '@angular/common'
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select'
import { MatIcon } from '@angular/material/icon'
import { MatButton, MatIconButton } from '@angular/material/button'

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    MatSelect,
    MatOption,
    MatIcon,
    MatIconButton,
    MatButton,
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  @Input({ required: true }) totalPages: number = 0
  @Input({ required: true }) currentPage: number = 1
  @Input({ required: true }) limit: number = 10

  @Output() changePage = new EventEmitter<{ page: number; limit: number }>()
  @Output() changeLimit = new EventEmitter<number>()

  getPages(): (number | string)[] {
    const pages: (number | string)[] = [];

    const totalPages = Number(this.totalPages);
    const currentPage = Number(this.currentPage);

    // Если totalPages меньше или равно 7, показываем все страницы
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1); // Первая страница всегда

      // Если текущая страница в начале
      if (currentPage <= 4) {
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
      else if (currentPage >= totalPages - 3) {
        pages.push('...');
        for (let i = totalPages - 4; i < totalPages; i++) {
          pages.push(Number(i));
        }
        pages.push(Number(totalPages));
      }
      else {
        pages.push('...');
        pages.push(Number(currentPage) - 1);
        pages.push(Number(currentPage));
        pages.push(Number(currentPage) + 1);
        pages.push('...');
        pages.push(Number(totalPages));
      }
    }
    return pages.map(page => (page === '...' ? page : Number(page)));
  }


  onChangePage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.changePage.emit({ page, limit: this.limit })
    }
  }

  onChangeLimit(event: MatSelectChange) {
    this.changeLimit.emit(event.value)
  }

  protected readonly Number = Number
}
