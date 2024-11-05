import {Routes} from "@angular/router";

export const OrdersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./orders/orders.component')
      .then(c => c.OrdersComponent)
  }
]
