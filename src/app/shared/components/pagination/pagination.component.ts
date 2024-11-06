import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core'
import { NgClass, NgForOf, NgIf } from '@angular/common'
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select'
import { MatIcon } from '@angular/material/icon'
import { MatButton, MatIconButton } from '@angular/material/button'

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
    const pages: (number | string)[] = []

    const totalPages = Number(this.totalPages)
    const currentPage = Number(this.currentPage)

    pages.push(1)

    // Если общее количество страниц меньше или равно 3, добавляем все страницы
    if (totalPages <= 3) {
      for (let i = 2; i <= totalPages; i++) {
        pages.push(i)
      }
    } else if (totalPages <= 7) {
      for (let i = 2; i <= totalPages; i++) {
        pages.push(i)
      }
    }
    // Если текущая страница в начале
    else if (currentPage <= 4) {
      for (let i = 2; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(Number(totalPages))
    }
    // Если текущая страница в конце
    else if (currentPage >= totalPages - 3) {
      pages.push('...')
      for (let i = totalPages - 4; i < totalPages; i++) {
        pages.push(i)
      }
      pages.push(totalPages)
    }
    // Если текущая страница в середине
    else {
      pages.push('...')
      pages.push(Number(currentPage) - 1)
      pages.push(Number(currentPage))
      pages.push(Number(currentPage) + 1)
      pages.push('...')
      pages.push(Number(totalPages))
    }

    return pages
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
