import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {ordersDataInterceptor} from "./features/orders/services/backend-immitation/orders-data.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), provideAnimationsAsync(), provideHttpClient(withInterceptors([ordersDataInterceptor]))
  ]
};
