import {ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnInit, signal} from '@angular/core';
import {OrdersListComponent} from "../../components/orders-list/orders-list.component";
import {PaginationComponent} from "@app/shared/components/pagination/pagination.component";
import {OrdersConfig, OrdersData} from "../../models/orders.model";
import {ActivatedRoute, Router} from "@angular/router";
import {debounceTime, map, shareReplay, startWith, switchMap, tap} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatButton} from "@angular/material/button";
import {OrdersDataService} from "../../services/orders-data.service";
import {OrdersService} from "../../services/orders.service";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {OrderSearchTermComponent} from "../../components/order-search-term/order-search-term.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {OrderViewEditComponent} from "../../components/order-view-edit/order-view-edit.component";

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
    ReactiveFormsModule
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [OrdersDataService, OrdersService]
})
export class OrdersComponent implements OnInit {
  private queryParams = inject(ActivatedRoute)
    .queryParams.pipe(shareReplay({bufferSize: 1, refCount: true}))

  private ordersService = inject(OrdersService)

  private router = inject(Router)
  private destroyRef = inject(DestroyRef)
  private dialog = inject(MatDialog)

  private ordersConfig: OrdersConfig = {
    filters: {
      offset: 1,
      limit: 10,
    }
  }

  loading = signal<boolean>(false)

  searchTermControl = new FormControl<string>('')


  public ordersList$ = this.searchTermControl.valueChanges.pipe(
    debounceTime(500),
    startWith(''),
    tap((value: string | null) => {
      this.ordersConfig.filters['searchTerm'] = value ?? '';
    }),
    switchMap(() => {
      this.loading.set(true);
      return this.ordersService.getOrdersList(this.ordersConfig);
    }),
    tap(() => this.loading.set(false)),
    takeUntilDestroyed(this.destroyRef)
  );



  protected readonly currentPage$ = this.queryParams.pipe(
    map((param): number => param['offset'])
  );

  protected readonly limit$ = this.queryParams.pipe(
    map((param): number => param['limit'])
  );

  ngOnInit() {
    this.queryParams.pipe(
      tap((params) => {
        this.ordersConfig.filters = { ...params };
      }),
      switchMap(() => this.ordersList$),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }

  onChangePage(page: number) {
    this.ordersConfig.filters['offset'] = page;
    this.setQueryParams()
    this.scrollToTop();
  }

  onChangeLimit(limit: number) {
    this.ordersConfig.filters['limit'] = limit;
    this.setQueryParams()
    this.scrollToTop();
  }

  onOpenViewEditDialog(data?: OrdersData) {
    this.dialog
      .open(OrderViewEditComponent, {data, hasBackdrop: true})
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: {data: OrdersData, mode: 'create' | 'edit'}) => {
        if(res) {
          console.log(res)
        }
      })
  }

  private scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private setQueryParams() {
    this.router.navigate([], {
      queryParams: {
        ...this.ordersConfig.filters
      },
      queryParamsHandling: 'merge'
    });
  }

  protected readonly Math = Math;
}
