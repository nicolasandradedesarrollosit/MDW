import {Request, Response} from "express";
import moongose from "mongoose";
import Order from "../models/orderModel.js";
import ProductSize from "../models/productSizeModel.js";

export async function createOrderController(req: Request, res: Response) {
    const {id_user, products, total_amount, address, city, postal_code, phone} = req.body;
    try {
        const order = new Order({
            userId: id_user,
            products: products.map((p: any) => ({
                productId: p.id_product,
                quantity: p.quantity,
                size: p.size,
                price: p.price
            })),
            totalAmount: total_amount,
            address: address,
            city: city,
            postalCode: postal_code,
            phone: phone
        });
        const savedOrder = await order.save();

        for (const p of products) {
            const productSize = await ProductSize.findOne({
                id_product: new moongose.Types.ObjectId(p.id_product),
                size: p.size
            });
            if (productSize) {
                productSize.stock = Math.max(0, productSize.stock - p.quantity);
                await productSize.save();
            }
        }

        res.status(201).json(savedOrder); 
    }
    catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ message: 'Error creating order', error: err });
    }
}

export async function fetchOrdersController(_req: Request, res: Response) {
    try {
        const orders = await Order.find()
            .populate('userId', 'email')
            .populate('products.productId', 'name');
        res.status(200).json(orders);
    }
    catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: 'Error fetching orders', error: err });
    }
}

export async function updateOrderStatusController(req: Request, res: Response) {
    const idParam = (req.params as any).id || (req.params as any).id_order;
    const { status } = req.body as { status?: string };
    try {
        console.debug('updateOrderStatusController - params:', req.params, 'body:', req.body);
        if (!idParam) return res.status(400).json({ message: 'Order id is required' });
        const order = await Order.findById(idParam);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (!status) return res.status(400).json({ message: 'Status is required' });
        const allowed = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
        if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
        (order as any).status = status;
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    }
    catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).json({ message: 'Error updating order status', error: err });
    }
}
            