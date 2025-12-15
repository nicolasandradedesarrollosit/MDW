import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productSizesRoute from './routes/productSizeRoutes.js';
import orderRoutes from './routes/orderRouter.js';

dotenv.config();
const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'https://mdw-frontend.vercel.app'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Origen bloqueado por CORS:', origin);
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productSizesRoute);
app.use('/api', orderRoutes);

app.get('/health-check', async (_req, res) => {
    res.status(200).json({ ok: true, message: 'API corriendo' });
})

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