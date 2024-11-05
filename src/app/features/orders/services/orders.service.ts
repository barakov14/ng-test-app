import {inject, Injectable} from '@angular/core';
import {OrdersDataService} from "./orders-data.service";
import {OrdersConfig} from "../models/orders.model";
import {shareReplay} from "rxjs";

@Injectable()
export class OrdersService {
  private ordersDataService = inject(OrdersDataService)

  getOrdersList(ordersConfig: OrdersConfig) {
    return this.ordersDataService.getOrdersList(ordersConfig).pipe(
      shareReplay({bufferSize: 1, refCount: true})
    );
  }
}
