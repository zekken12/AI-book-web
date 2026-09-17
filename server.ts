import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { getAllBooks, getBookById, getCategories } from './src/db/books.ts';
import { createOrder, getOrdersByUser, getRecentOrders } from './src/db/orders.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { requireAuth, optionalAuth, AuthRequest } from './src/middleware/auth.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Librairie en Ligne SQL API' });
  });

  // Get all books with filters and search
  app.get('/api/books', async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      const sortBy = req.query.sortBy as any;

      const bookList = await getAllBooks({ category, search, sortBy });
      res.json({
        total: bookList.length,
        books: bookList,
      });
    } catch (error: any) {
      console.error('API Error /api/books:', error);
      res.status(500).json({ error: error.message || 'Erreur lors du chargement des livres' });
    }
  });

  // Get distinct categories
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await getCategories();
      res.json(categories);
    } catch (error: any) {
      console.error('API Error /api/categories:', error);
      res.status(500).json({ error: 'Erreur lors du chargement des catégories' });
    }
  });

  // Get book details by id
  app.get('/api/books/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID invalide' });
      }
      const book = await getBookById(id);
      if (!book) {
        return res.status(404).json({ error: 'Livre non trouvé' });
      }
      res.json(book);
    } catch (error: any) {
      console.error('API Error /api/books/:id:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération du livre' });
    }
  });

  // Create an order
  app.post('/api/orders', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const { customerName, customerEmail, address, city, postalCode, totalAmount, items } = req.body;

      if (!customerName || !customerEmail || !address || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Veuillez renseigner tous les champs obligatoires' });
      }

      const order = await createOrder({
        userUid: req.user?.uid,
        customerName,
        customerEmail,
        address,
        city: city || 'Paris',
        postalCode: postalCode || '75001',
        totalAmount: Number(totalAmount),
        items,
      });

      res.status(201).json({
        message: 'Commande validée avec succès',
        order,
      });
    } catch (error: any) {
      console.error('API Error /api/orders:', error);
      res.status(500).json({ error: 'Erreur lors de la création de la commande' });
    }
  });

  // Get user's orders
  app.get('/api/orders/my-orders', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user?.uid) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
      }
      const userOrders = await getOrdersByUser(req.user.uid);
      res.json(userOrders);
    } catch (error: any) {
      console.error('API Error /api/orders/my-orders:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération de vos commandes' });
    }
  });

  // Sync user profile
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user?.uid || !req.user?.email) {
        return res.status(400).json({ error: 'Données utilisateur incomplètes' });
      }
      const dbUser = await getOrCreateUser(req.user.uid, req.user.email, req.body.displayName);
      res.json(dbUser);
    } catch (error: any) {
      console.error('API Error /api/auth/sync:', error);
      res.status(500).json({ error: 'Erreur lors de la synchronisation de profil' });
    }
  });

  // Database stats (books count, etc.)
  app.get('/api/stats', async (req, res) => {
    try {
      const all = await getAllBooks();
      const recent = await getRecentOrders(5);
      res.json({
        databaseEngine: 'PostgreSQL (Cloud SQL)',
        totalBooks: all.length,
        recentOrdersCount: recent.length,
        status: 'Connecté',
      });
    } catch (error: any) {
      console.error('API Error /api/stats:', error);
      res.status(500).json({ error: 'Erreur stats' });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Librairie Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
