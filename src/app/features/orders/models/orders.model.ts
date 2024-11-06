export interface OrdersData {
  id: string
  title: string
  customerName: string
  customerSource: string
  status: "Active" | "Pending" | "Closed"
  orderCost: string
  createdAt: Date
  quantity: number
  totalCost: string
}

export interface OrdersConfig {
  filters: Record<string, string|number>;
  searchTerm: string
}
