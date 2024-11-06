import {inject, Injectable} from '@angular/core';
import {OrdersDataService} from "./orders-data.service";
import {OrdersConfig, OrdersData} from "../models/orders.model";
import {shareReplay, tap} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class OrdersService {
  private ordersDataService = inject(OrdersDataService)
  private snackBar = inject(MatSnackBar)

  getOrdersList(ordersConfig: OrdersConfig) {
    return this.ordersDataService.getOrdersList(ordersConfig).pipe(
      shareReplay({bufferSize: 1, refCount: true})
    );
  }

  deleteOrderById(id: string) {
    return this.ordersDataService.deleteOrderById(id).pipe(
      tap(() => this.snackBar.open('Deleted succefully', 'OK'))
    )
  }

  createOrder(data: Partial<OrdersData>) {
    return this.ordersDataService.createOrder(data).pipe(
      tap(() => this.snackBar.open('Created succefully', 'OK'))
    )
  }
}
