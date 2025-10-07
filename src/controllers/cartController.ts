import Cart from '../models/cartModel.js';
import Product from '../models/productsModel.js';
import { Request, Response } from 'express';

export async function getCart(req: Request, res: Response) {
    try {
        const userId = (req as any).user.id;
        const cart = await Cart.findOne({ userId }).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.status(200).json(cart);
    }
    catch(err){
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export async function createCart(req: Request, res: Response) {
    try {
        const userId = (req as any).user.id;
        const { products } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Debe proporcionar un arreglo de productos no vacío' });
        }

        for (const item of products) {
            const { productId, quantity } = item;

            if (!productId || !quantity || quantity < 1) {
                return res.status(400).json({ message: 'Cada producto debe tener productId y quantity válida (mínimo 1)' });
            }

            const productExists = await Product.findById(productId);
            if (!productExists) {
                return res.status(404).json({ message: `Producto con ID ${productId} no encontrado` });
            }
        }

        const newCart = new Cart({ userId, products });
        await newCart.save();

        res.status(201).json({ message: 'Carrito creado exitosamente', cart: newCart });
    } catch (err) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}