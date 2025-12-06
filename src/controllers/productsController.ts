import Product from '../models/productsModel.js';
import { Request, Response } from 'express';

export async function createProduct(req: Request, res: Response) {
    try{
        const { name, description, price, stock } = req.body;

        const newProduct = new Product({
            name,
            description,
            price,
            stock
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({ message: 'Producto creado exitosamente', product: savedProduct });
    }
    catch(err){
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export async function getProducts(req: Request, res: Response) {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    }
    catch(err){
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}