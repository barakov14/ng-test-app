import { inject, Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { OrdersConfig, OrdersData } from '@app/feature/orders/models'

@Injectable()
export class OrdersDataService {
  private http = inject(HttpClient)

  getOrdersList(ordersConfig: OrdersConfig) {
    let params = new HttpParams()

    Object.keys(ordersConfig.filters).forEach((key) => {
      params = params.set(key, ordersConfig.filters[key])
    })

    params = params.set('searchTerm', ordersConfig.searchTerm)

    return this.http.get<{ ordersCount: number; orders: OrdersData[] }>(
      '/orders',
      { params },
    )
  }

  createOrder(data: Partial<OrdersData>) {
    return this.http.post<void>('/orders', data)
  }

  updateOrder(data: Partial<OrdersData>) {
    const { id, ...dataWithoutId } = data

    console.log(data)
    return this.http.put<void>(`/orders/${id}`, dataWithoutId)
  }

  deleteOrderById(id: string) {
    return this.http.delete<void>(`/orders/${id}`)
  }
}
