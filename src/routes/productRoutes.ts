import {
    createProduct,
    getProducts,
    deleteProduct
} from '../controllers/productsController.js';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto.js';
import { validationMiddleware } from '../middlewares/middleware.js';
import { Router } from 'express';

const r = Router();

r.post('/products', validationMiddleware(CreateProductDto), createProduct);
r.get('/products', getProducts);
r.delete('/products/:id', deleteProduct);

export default r;