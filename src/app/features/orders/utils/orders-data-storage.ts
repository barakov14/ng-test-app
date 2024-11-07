
// Utility function to get orders from localStorage
import {OrdersData} from "@app/feature/orders/models";

export function getOrdersFromLocalStorage(): OrdersData[] {
  const orders = localStorage.getItem('orders')
  return orders ? JSON.parse(orders) : []
}

// Utility function to save orders to localStorage
export function saveOrdersToLocalStorage(orders: OrdersData[]): void {
  localStorage.setItem('orders', JSON.stringify(orders))
}
