import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { OrdersData } from '../../models/orders.model';
import { delay, of, throwError } from 'rxjs';
import {getOrdersFromLocalStorage, saveOrdersToLocalStorage} from "../../utils/orders-data-storage";
import {ordersData as ordersDataMock} from "./orders-data-mock";

export const ordersDataInterceptor: HttpInterceptorFn = (req, next) => {
  const delayTime = 1000;

  const limitParam = req.params.get('limit');
  const offsetParam = req.params.get('offset');

  const limit = limitParam ? +limitParam : 10; // Convert to number or default to 10
  const offset = offsetParam ? +offsetParam : 0; // Convert to number or default to 0

  // Initial load of orders from localStorage, if needed
  if (!localStorage.getItem('orders')) {
    saveOrdersToLocalStorage(ordersDataMock);
  }

  // Retrieve orders from localStorage at the start of the request
  let ordersData = getOrdersFromLocalStorage();

  // GET ORDERS
  if (req.method === 'GET') {
    if (req.url.endsWith('/orders')) {
      const paginatedOrders = ordersData.slice(offset, offset + limit);
      const responseBody = {
        orders: paginatedOrders,
        ordersCount: ordersData.length // Общее количество заказов
      };
      return of(new HttpResponse({ status: 200, body: responseBody })).pipe(delay(delayTime));
    } else if (req.url.match(/\/orders\/\w+/)) {
      // GET ORDER BY ID
      const id = req.url.split('/').pop();
      const order = ordersData.find(order => order.id === id);
      return order
        ? of(new HttpResponse({ status: 200, body: order })).pipe(delay(delayTime))
        : throwError(() => ({ status: 404, error: { message: 'Order not found' } })).pipe(delay(delayTime));
    }
  } else if (req.method === 'POST') {
    // POST ORDERS
    const reqBody = req.body as Partial<OrdersData>;

    const newOrder: OrdersData = {
      id: `MS${Math.floor(Math.random() * 100)}`,
      customerName: reqBody.customerName ?? 'Default Customer',
      customerSource: reqBody.customerSource ?? 'Default Source',
      status: reqBody.status ?? 'Pending',
      orderCost: reqBody.orderCost ?? '0',
      createdAt: reqBody.createdAt ?? new Date(),
    };

    // Add new order to localStorage
    ordersData.push(newOrder);
    saveOrdersToLocalStorage(ordersData);

    return of(new HttpResponse({ status: 201, body: newOrder })).pipe(delay(delayTime));
  } else if (req.method === 'PUT') {
    // PUT ORDERS
    const id = req.url.split('/').pop();
    const index = ordersData.findIndex(order => order.id === id);
    if (index !== -1) {
      ordersData[index] = { ...ordersData[index], ...(req.body ?? {}) }; // Use ?? to check for null
      saveOrdersToLocalStorage(ordersData); // Save updated orders to localStorage

      return of(new HttpResponse({ status: 200, body: ordersData[index] })).pipe(delay(delayTime));
    } else {
      return throwError(() => ({ status: 404, error: { message: 'Order not found' } })).pipe(delay(delayTime));
    }
  } else if (req.method === 'DELETE') {
    // DELETE ORDER
    const id = req.url.split('/').pop();
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
