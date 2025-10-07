import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import 'dotenv/config';
import userRoutes from './routes/userRoutes.js'

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', userRoutes);

app.get('/health-check', async (_req, res) => {
    res.status(200).json({ ok: true, message: 'API corriendo' });
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error en request:', {
    path: req.path,
    body: req.body,
    error: err.stack
  });
  res.status(500).json({ message: 'Error interno del servidor' });
});

export default app;