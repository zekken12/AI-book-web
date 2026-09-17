import { db } from './index.ts';
import { orders } from './schema.ts';
import { desc, eq } from 'drizzle-orm';

export interface CreateOrderInput {
  userUid?: string;
  customerName: string;
  customerEmail: string;
  address: string;
  city: string;
  postalCode: string;
  totalAmount: number;
  items: Array<{
    bookId: number;
    title: string;
    price: number;
    quantity: number;
  }>;
}

export async function createOrder(input: CreateOrderInput) {
  try {
    const result = await db.insert(orders).values({
      userUid: input.userUid || null,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      address: input.address,
      city: input.city,
      postalCode: input.postalCode,
      totalAmount: input.totalAmount,
      items: JSON.stringify(input.items),
      status: 'Confirmée',
    }).returning();

    return result[0];
  } catch (error) {
    console.error('Failed to create order in database:', error);
    throw new Error('Could not create order in database', { cause: error });
  }
}

export async function getOrdersByUser(userUid: string) {
  try {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userUid, userUid))
      .orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error(`Failed to fetch orders for user ${userUid}:`, error);
    throw new Error('Failed to retrieve user orders', { cause: error });
  }
}

export async function getRecentOrders(limitCount = 10) {
  try {
    return await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limitCount);
  } catch (error) {
    console.error('Failed to fetch recent orders:', error);
    throw new Error('Failed to retrieve recent orders', { cause: error });
  }
}
