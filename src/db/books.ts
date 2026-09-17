import { db } from './index.ts';
import { books } from './schema.ts';
import { eq, ilike, or, desc, asc } from 'drizzle-orm';

export interface BookFilterParams {
  category?: string;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'year' | 'title';
}

export async function getAllBooks(params: BookFilterParams = {}) {
  try {
    let query = db.select().from(books).$dynamic();

    const conditions = [];

    if (params.category && params.category !== 'all') {
      conditions.push(eq(books.category, params.category));
    }

    if (params.search && params.search.trim() !== '') {
      const searchPattern = `%${params.search.trim()}%`;
      conditions.push(or(
        ilike(books.title, searchPattern),
        ilike(books.author, searchPattern),
        ilike(books.description, searchPattern)
      ));
    }

    if (conditions.length > 0) {
      // @ts-ignore drizzle dynamic where
      query = query.where(conditions.length === 1 ? conditions[0] : or(...conditions));
    }

    // Sorting
    switch (params.sortBy) {
      case 'price_asc':
        query = query.orderBy(asc(books.price));
        break;
      case 'price_desc':
        query = query.orderBy(desc(books.price));
        break;
      case 'rating':
        query = query.orderBy(desc(books.rating));
        break;
      case 'year':
        query = query.orderBy(desc(books.publishedYear));
        break;
      case 'title':
        query = query.orderBy(asc(books.title));
        break;
      default:
        query = query.orderBy(asc(books.id));
    }

    return await query;
  } catch (error) {
    console.error('Database query failed for getAllBooks:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getBookById(id: number) {
  try {
    const result = await db.select().from(books).where(eq(books.id, id));
    return result[0] || null;
  } catch (error) {
    console.error(`Database query failed for book ${id}:`, error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getCategories() {
  try {
    const all = await db.select({ category: books.category }).from(books);
    const unique = Array.from(new Set(all.map((b) => b.category)));
    return unique;
  } catch (error) {
    console.error('Database query failed for categories:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
