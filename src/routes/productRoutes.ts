import {
    createProduct
} from '../controllers/productsController.js';
import { Router } from 'express';

const r = Router();

r.post('/products', createProduct);

export default r;