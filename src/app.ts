import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

dotenv.config();
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);

app.get('/health-check', async (_req, res) => {
    res.status(200).json({ ok: true, message: 'API corriendo' });
})

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error en request:', {
    path: req.path,
    method: req.method,
    body: req.body,
    error: err.message,
    stack: err.stack
  });
  res.status(500).json({ message: 'Error interno del servidor', detail: err.message });
});

export default app;