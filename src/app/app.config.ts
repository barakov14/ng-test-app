import { ApplicationConfig } from '@angular/core'
import { provideRouter } from '@angular/router'

import { routes } from './app.routes'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { ordersDataInterceptor } from './features/orders/services/backend-immitation/orders-data.interceptor'
import { provideEnvironmentNgxMask } from 'ngx-mask'

export const appConfig: ApplicationConfig = {
  providers: [
    provideEnvironmentNgxMask({
      validation: false,
    }),

    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([ordersDataInterceptor])),
  ],
}
