import { Router } from "express";
import { validationMiddleware, authMiddleware, adminMiddleware } from '../middlewares/middleware.js';
import { createOrderController, fetchOrdersController, updateOrderStatusController } from "../controllers/orderController.js";
import { CreateOrderDto, updateStatusDto } from "../dto/order.dto.js";

const r = Router();

r.post('/orders', authMiddleware, validationMiddleware(CreateOrderDto), createOrderController);
r.get('/orders', authMiddleware, adminMiddleware, fetchOrdersController);
r.patch('/orders/:id', authMiddleware, adminMiddleware, validationMiddleware(updateStatusDto), updateOrderStatusController);


export default r;