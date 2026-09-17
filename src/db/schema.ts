import { integer, pgTable, real, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  category: text('category').notNull(),
  price: real('price').notNull(),
  description: text('description').notNull(),
  coverImage: text('cover_image').notNull(),
  isbn: text('isbn').notNull(),
  publishedYear: integer('published_year').notNull(),
  pages: integer('pages').notNull(),
  stock: integer('stock').notNull().default(15),
  rating: real('rating').notNull().default(4.5),
  isFeatured: integer('is_featured').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid'),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  postalCode: text('postal_code').notNull(),
  totalAmount: real('total_amount').notNull(),
  items: text('items').notNull(),
  status: text('status').notNull().default('Confirmée'),
  createdAt: timestamp('created_at').defaultNow(),
});
