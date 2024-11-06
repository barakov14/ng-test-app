import {OrdersData} from "../../models/orders.model";

function generateRandomOrders(count: number): OrdersData[] {
  const statuses = ['Pending', 'Closed', 'Active']; // Статусы
  const sources = ['Website', 'Mobile App', 'Customer Service', 'Retail Store'];

  const getRandomName = () => {
    const names = ['John Doe', 'Jane Smith', 'Tom Brown', 'Alice Green', 'Bob White'];
    return names[Math.floor(Math.random() * names.length)];
  };

  const getRandomSource = () => sources[Math.floor(Math.random() * sources.length)];

  const getRandomStatus: () => 'Pending' | 'Closed' | 'Active' = () => {
    const statuses: ('Pending' | 'Closed' | 'Active')[] = ['Pending', 'Closed', 'Active'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const getRandomOrderCost = () => {
    const cost = (Math.random() * (200 - 5) + 5).toFixed(2); // Random number between $5.00 and $200.00
    return `$${cost}`;
  };

  const getRandomQuantity = () => Math.floor(Math.random() * 10) + 1; // Random quantity between 1 and 10

  const orders: OrdersData[] = [];

  for (let i = 0; i < count; i++) {
    const orderCostString = getRandomOrderCost();
    const orderCost = parseFloat(orderCostString.replace('$', '')); // Remove '$' and convert to number
    const quantity = getRandomQuantity();
    const totalCost = (orderCost * quantity).toFixed(2);

    const order: OrdersData = {
      id: `MS${Math.floor(Math.random() * 10000)}`,
      customerName: getRandomName(),
      customerSource: getRandomSource(),
      status: getRandomStatus(),
      orderCost: orderCostString,
      quantity,
      totalCost: `$${totalCost}`,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)), // Random date
    };

    orders.push(order);
  }

  return orders;
}

export const ordersDataMock = generateRandomOrders(150); // Generate 150 random orders
