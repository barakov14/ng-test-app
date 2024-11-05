import { Injectable } from '@angular/core';
import {OrdersData} from "../models/orders.model";

@Injectable({
  providedIn: 'root'
})
export class OrdersDataService {



}


export const ordersData: OrdersData[] = [
  {
    id: 'MS20',
    customerName: 'Jaskeerat Singh Sandhu',
    customerSource: 'Metafold',
    status: 'Closed',
    orderCost: '₹17110',
    createdAt: new Date('2021-12-11')
  },
  {
    id: 'MS21',
    customerName: 'Jaskeerat Singh Sandhu',
    customerSource: 'Metafold',
    status: 'Active',
    orderCost: '₹22147',
    createdAt: new Date('2021-12-11')
  },
  {
    id: 'MS22',
    customerName: 'Jaskeerat Singh Sandhu',
    customerSource: 'Metafold',
    status: 'Pending',
    orderCost: '₹22147',
    createdAt: new Date('2021-12-11')
  },
  {
    id: 'MS18',
    customerName: 'Jaskeerat Singh Sandhu',
    customerSource: 'Metafold',
    status: 'Closed',
    orderCost: '₹17110',
    createdAt: new Date('2021-12-11')
  },
  {
    id: 'MS19',
    customerName: 'Jaskeerat Singh Sandhu',
    customerSource: 'Metafold',
    status: 'Active',
    orderCost: '₹17110',
    createdAt: new Date('2021-12-11')
  },
  {
    id: 'MSQ26',
    customerName: 'Jaskeerat Singh Sandhu',
    customerSource: 'Metafold',
    status: 'Pending',
    orderCost: '₹22147',
    createdAt: new Date('2021-12-14')
  }
];
