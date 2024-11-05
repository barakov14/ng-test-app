import {Routes} from "@angular/router";

export const OrdersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@app/orders')
      .then(c => c.OrdersComponent)
  }
]
