import {
    createProduct
} from '../controllers/productsController.js';
import { CreateProductDto } from '../dto/createProduct.dto.js';
import { validationMiddleware } from '../middlewares/middleware.js';
import { Router } from 'express';

const r = Router();

r.post('/products', validationMiddleware(CreateProductDto), createProduct);

export default r;