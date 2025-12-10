import {
    createProduct,
    getProducts,
    deleteProduct,
    updateProduct
} from '../controllers/productsController.js';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto.js';
import { validationMiddleware, adminMiddleware, authMiddleware } from '../middlewares/middleware.js';
import { Router } from 'express';

const r = Router();

r.post('/products', authMiddleware, adminMiddleware, validationMiddleware(CreateProductDto), createProduct);
r.get('/products', getProducts);
r.delete('/products/:id', authMiddleware, adminMiddleware, deleteProduct);
r.patch('/products/:id', authMiddleware, adminMiddleware, validationMiddleware(UpdateProductDto), updateProduct);

export default r;