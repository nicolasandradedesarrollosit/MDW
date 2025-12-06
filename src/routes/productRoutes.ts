import {
    createProduct,
    getProducts
} from '../controllers/productsController.js';
import { CreateProductDto } from '../dto/createProduct.dto.js';
import { validationMiddleware } from '../middlewares/middleware.js';
import { Router } from 'express';

const r = Router();

r.post('/products', validationMiddleware(CreateProductDto), createProduct);
r.get('/products', getProducts);

export default r;