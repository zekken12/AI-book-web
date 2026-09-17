export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  price: number;
  description: string;
  coverImage: string;
  isbn: string;
  publishedYear: number;
  pages: number;
  stock: number;
  rating: number;
  isFeatured?: number;
  createdAt?: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface OrderItemSummary {
  bookId: number;
  title: string;
  price: number;
  quantity: number;
}

export interface OrderRecord {
  id: number;
  userUid?: string;
  customerName: string;
  customerEmail: string;
  address: string;
  city: string;
  postalCode: string;
  totalAmount: number;
  items: string;
  status: string;
  createdAt: string;
}
