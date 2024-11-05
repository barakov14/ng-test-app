import { TestBed } from '@angular/core/testing';

import { OrdersDataService } from './orders-data.service';

describe('OrdersDataService', () => {
  let service: OrdersDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdersDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
