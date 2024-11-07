import { inject, Injectable } from '@angular/core'
import { OrdersDataService } from './orders-data.service'
import { shareReplay, tap } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'
import { OrdersConfig, OrdersData } from '@app/feature/orders/models'

@Injectable()
export class OrdersService {
  private ordersDataService = inject(OrdersDataService)
  private snackBar = inject(MatSnackBar)

  getOrdersList(ordersConfig: OrdersConfig) {
    return this.ordersDataService
      .getOrdersList(ordersConfig)
      .pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  deleteOrderById(id: string) {
    return this.ordersDataService
      .deleteOrderById(id)
      .pipe(tap(() => this.snackBar.open('Deleted succefully', 'OK')))
  }

  createOrder(data: Partial<OrdersData>) {
    return this.ordersDataService
      .createOrder(data)
      .pipe(tap(() => this.snackBar.open('Created succefully', 'OK')))
  }

  updateOrder(data: Partial<OrdersData>) {
    return this.ordersDataService
      .updateOrder(data)
      .pipe(tap(() => this.snackBar.open('Updated succefully', 'OK')))
  }
}
