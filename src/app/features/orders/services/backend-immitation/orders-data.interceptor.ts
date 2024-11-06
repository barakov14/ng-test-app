import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { OrdersData } from '../../models/orders.model';
import { delay, of, throwError } from 'rxjs';
import {getOrdersFromLocalStorage, saveOrdersToLocalStorage} from "../../utils/orders-data-storage";
import {ordersDataMock} from "./orders-data-mock";

export const ordersDataInterceptor: HttpInterceptorFn = (req, next) => {
  const delayTime = 1000;

  const limitParam = req.params.get('limit');
  const offsetParam = req.params.get('offset');

  const limit = limitParam ? +limitParam : 10;
  const offset = offsetParam ? +offsetParam : 0;

  // Initial load of orders from localStorage
  if (!localStorage.getItem('orders')) {
    saveOrdersToLocalStorage(ordersDataMock);
  }

  // Retrieve orders from localStorage at the start of the request
  if (req.method === 'GET') {
    if (req.url.endsWith('/orders')) {
      const searchTerm = req.params.get('searchTerm')?.toLowerCase() || '';

      let ordersData = getOrdersFromLocalStorage();

      const filteredOrders = ordersData.filter(order =>
        order.customerName.toLowerCase().includes(searchTerm) ||
        order.customerSource.toLowerCase().includes(searchTerm)
      );

      console.log(filteredOrders);

      // Correct start and end index for pagination
      const startIndex = offset; // Use offset directly, no +1
      const endIndex = Math.min(startIndex + limit, filteredOrders.length); // Ensure we don't go beyond the array length
      const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
      console.log('paginatedOrders', paginatedOrders);

      const responseBody = {
        orders: paginatedOrders,
        ordersCount: filteredOrders.length
      };

      console.log(responseBody);

      return of(new HttpResponse({ status: 200, body: responseBody })).pipe(delay(delayTime));
    }
  } else if (req.method === 'POST') {
    // POST ORDERS
    const reqBody = req.body as Partial<OrdersData>;

    const newOrder: OrdersData = {
      id: `MS${Math.floor(Math.random() * 100)}`,
      customerName: reqBody.customerName ?? 'Default Customer',
      customerSource: reqBody.customerSource ?? 'Default Source',
      status: !!reqBody.status ? reqBody.status : 'Pending',
      orderCost: reqBody.orderCost ?? '0',
      createdAt: reqBody.createdAt ?? new Date(),
    };

    let ordersData = getOrdersFromLocalStorage();

    ordersData.push(newOrder);
    console.log(ordersData);
    saveOrdersToLocalStorage(ordersData);

    return of(new HttpResponse({ status: 201, body: newOrder })).pipe(delay(delayTime));
  } else if (req.method === 'PUT') {
    // PUT ORDERS
    const id = req.url.split('/').pop();

    let ordersData = getOrdersFromLocalStorage();

    const index = ordersData.findIndex(order => order.id === id);
    if (index !== -1) {
      console.log(req.body);
      ordersData[index] = { ...ordersData[index], ...(req.body ?? {}) }; // Use ?? to check for null
      saveOrdersToLocalStorage(ordersData); // Save updated orders to localStorage

      return of(new HttpResponse({ status: 200, body: ordersData[index] })).pipe(delay(delayTime));
    } else {
      return throwError(() => ({ status: 404, error: { message: 'Order not found' } })).pipe(delay(delayTime));
    }
  } else if (req.method === 'DELETE') {
    // DELETE ORDER
    const id = req.url.split('/').pop();

    let ordersData = getOrdersFromLocalStorage();

    const index = ordersData.findIndex(order => order.id === id);
    if (index !== -1) {
      ordersData.splice(index, 1);
      saveOrdersToLocalStorage(ordersData); // Save updated orders to localStorage

      return of(new HttpResponse({ status: 204 })).pipe(delay(delayTime));
    } else {
      return throwError(() => ({ status: 404, error: { message: 'Order not found' } })).pipe(delay(delayTime));
    }
  }

  return next(req);
};
