import { ComponentFixture, TestBed } from '@angular/core/testing'

import { OrderSearchTermComponent } from './order-search-term.component'

describe('OrderSearchTermComponent', () => {
  let component: OrderSearchTermComponent
  let fixture: ComponentFixture<OrderSearchTermComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderSearchTermComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(OrderSearchTermComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
