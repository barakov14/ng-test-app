import {OrdersData} from "../models/orders.model";

// Utility function to get orders from localStorage
export function getOrdersFromLocalStorage(): OrdersData[] {
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : [];
}

// Utility function to save orders to localStorage
export function saveOrdersToLocalStorage(orders: OrdersData[]): void {
  localStorage.setItem('orders', JSON.stringify(orders));
}
