import {ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnInit, signal} from '@angular/core';
import {OrdersListComponent} from "../../components/orders-list/orders-list.component";
import {PaginationComponent} from "@app/shared/components/pagination/pagination.component";
import {OrdersConfig, OrdersData} from "../../models/orders.model";
import {ActivatedRoute, Router} from "@angular/router";
import {map, shareReplay} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatButton} from "@angular/material/button";
import {OrdersDataService} from "../../services/orders-data.service";
import {OrdersService} from "../../services/orders.service";

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    OrdersListComponent,
    PaginationComponent,
    AsyncPipe,
    MatButton
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



  private ordersConfig: OrdersConfig = {
    filters: {
      currentPage: 1,
      limit: 10
    }
  }

  protected readonly currentPage$ = this.queryParams.pipe(
    map((param): number => param['currentPage'])
  );
  protected readonly limit$ = this.queryParams.pipe(
    map((param): number => param['limit'])
  );



  ngOnInit() {
    this.queryParams.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((params) => {
      this.ordersConfig.filters = {...params};
    })
  }

  onChangePage(page: number) {
    this.ordersConfig.filters['currentPage'] = page;
    this.setQueryParams()
  }

  onChangeLimit(limit: number) {
    this.ordersConfig.filters['limit'] = limit;
    this.setQueryParams()
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
