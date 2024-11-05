import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import { OrdersData } from "../../models/orders.model";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {DatePipe, NgClass} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    NgClass,
    DatePipe,
    MatIcon,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatHeaderCellDef,
    MatIconButton,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem
  ],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersListComponent {
  displayedColumns: string[] = ['id', 'customer', 'orderCost', 'status', 'createdAt', 'actions'];
  @Input({required: true}) dataSource!: OrdersData[]

  @Output() openViewEditDialog = new EventEmitter<OrdersData>();

  onRowClick(data: OrdersData) {
    this.openViewEditDialog.emit(data);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Closed':
        return 'closed';
      case 'Active':
        return 'active';
      case 'Pending':
        return 'pending';
      default:
        return '';
    }
  }
}
