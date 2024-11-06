import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core'
import { OrdersListComponent } from '../../components/orders-list/orders-list.component'
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component'
import { OrdersConfig, OrdersData } from '../../models/orders.model'
import { ActivatedRoute, Router } from '@angular/router'
import {
  debounceTime,
  filter,
  map,
  merge,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs'
import { AsyncPipe } from '@angular/common'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MatButton } from '@angular/material/button'
import { OrdersDataService } from '../../services/orders-data.service'
import { OrdersService } from '../../services/orders.service'
import { MatProgressSpinner } from '@angular/material/progress-spinner'
import { OrderSearchTermComponent } from '../../components/order-search-term/order-search-term.component'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { OrderViewEditComponent } from '../../components/order-view-edit/order-view-edit.component'

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    OrdersListComponent,
    PaginationComponent,
    AsyncPipe,
    MatButton,
    MatProgressSpinner,
    OrderSearchTermComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [OrdersDataService, OrdersService],
})
export class OrdersComponent {
  private queryParams = inject(ActivatedRoute).queryParams.pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
  )

  private ordersService = inject(OrdersService)

  private router = inject(Router)
  private destroyRef = inject(DestroyRef)
  private dialog = inject(MatDialog)

  private ordersConfig: OrdersConfig = {
    filters: {
      offset: 0,
      limit: 10,
    },
    searchTerm: '',
  }

  loading = signal<boolean>(false)

  searchTermControl = new FormControl<string>('')

  private reload$ = new Subject<void>()

  ordersList$ = this.queryParams.pipe(
    tap((params) => {
      this.ordersConfig.filters = { ...params }
    }), // setting params before
    switchMap(() =>
      merge(
        this.searchTermControl.valueChanges.pipe(
          debounceTime(500),
          startWith(''),
        ), // subscribing to value changes of search term
        this.reload$, // we reload orders list get query if call method next()
      ).pipe(
        tap((value) => {
          if (typeof value === 'string' || value === null) {
            this.ordersConfig['searchTerm'] = value ?? ''
          }
          // adding default value for search term filter if we get null
        }),
        switchMap(() => {
          this.loading.set(true)
          return this.ordersService.getOrdersList(this.ordersConfig)
        }),
        tap(() => this.loading.set(false)),
      ),
    ),
  )

  protected readonly currentOffset$ = this.queryParams.pipe(
    map((param): number => Number(param['offset'])),
    shareReplay({ bufferSize: 1, refCount: true }),
  )

  protected readonly limit$ = this.queryParams.pipe(
    map((param): number => Number(param['limit'])),
    shareReplay({ bufferSize: 1, refCount: true }),
  )

  onChangePage(data: { page: number; limit: number }) {
    this.ordersConfig.filters['offset'] = (data.page - 1) * data.limit
    this.setQueryParams()
    this.scrollToTop()
  }

  onChangeLimit(limit: number) {
    this.ordersConfig.filters['limit'] = limit
    this.setQueryParams()
    this.scrollToTop()
  }

  onOpenViewEditDialog(data?: OrdersData) {
    this.dialog
      .open(OrderViewEditComponent, { data, hasBackdrop: true })
      .afterClosed()
      .pipe(
        filter(Boolean), // Filter and skip on only data with value
        switchMap(
          (res: { data: Partial<OrdersData>; mode: 'create' | 'edit' }) =>
            res.mode === 'create'
              ? this.ordersService.createOrder(res.data)
              : this.ordersService.updateOrder(res.data),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.reload$.next()
      })
  }

  onDeleteOrderById(id: string) {
    this.ordersService
      .deleteOrderById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.reload$.next()
      })
  }

  private scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  private setQueryParams() {
    this.router.navigate([], {
      queryParams: {
        ...this.ordersConfig.filters,
      },
      queryParamsHandling: 'merge',
    })
  }

  protected readonly Math = Math
}
