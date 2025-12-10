import {
    getProductSizes,
    createProductSize,
    deleteProductSize,
    updateProductSize
} from '../controllers/productSizeController.js';
import { CreateProductSizeDto } from '../dto/productSize.dto.js';

import {
    adminMiddleware,
    authMiddleware,
    validationMiddleware
} from '../middlewares/middleware.js';

import { Router } from 'express';

const r = Router();

r.get('/product-sizes', getProductSizes);
r.post('/product-sizes', authMiddleware, adminMiddleware, validationMiddleware(CreateProductSizeDto), createProductSize);
r.delete('/product-sizes/:id', authMiddleware, adminMiddleware, deleteProductSize);
r.patch('/product-sizes/:id', authMiddleware, adminMiddleware, validationMiddleware(CreateProductSizeDto), updateProductSize);

export default r;