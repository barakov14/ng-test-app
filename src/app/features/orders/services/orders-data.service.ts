import {inject, Injectable} from '@angular/core';
import {OrdersConfig, OrdersData} from "../models/orders.model";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable()
export class OrdersDataService {
  private http = inject(HttpClient)


  getOrdersList(ordersConfig: OrdersConfig) {
    let params = new HttpParams();

    Object.keys(ordersConfig.filters).forEach((key) => {
      params = params.set(key, ordersConfig.filters[key]);
    });

    return this.http.get<{ordersCount: number, orders: OrdersData[]}>('/orders', { params })
  }

  createOrder(data: Partial<OrdersData>) {
    return this.http.post<void>('/orders', data)
  }



  updateOrder(id: string) {
    return
  }

  deleteOrderById(id: string) {
    return this.http.delete<void>(`/orders/${id}`)
  }


}
