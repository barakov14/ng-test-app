import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderViewEditComponent } from './order-view-edit.component';

describe('OrderViewEditComponent', () => {
  let component: OrderViewEditComponent;
  let fixture: ComponentFixture<OrderViewEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderViewEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderViewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
