import express from 'express';
import { getCart, createCart } from '../controllers/cartController.js';
import { authMiddleware } from '../middlewares/middleware.js';
import { validationMiddleware } from '../middlewares/middleware.js';
import { CartDto } from '../dto/cart.dto.js';
import { Router } from 'express';

const r = Router()

r.get('/cart', authMiddleware, getCart);

r.post('/cart', authMiddleware, validationMiddleware(CartDto), createCart);

export default r;