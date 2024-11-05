export interface OrdersData {
  id: string;
  customerName: string;
  customerSource: string;
  status: string;
  orderCost: string;
  createdAt: Date;
}

export interface OrdersConfig {
  filters: {
    [key: string]: string | number
  }
}
