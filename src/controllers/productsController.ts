import Product from '../models/productsModel.js';
import ProductSize from '../models/productSizeModel.js';
import { Request, Response } from 'express';

export async function createProduct(req: Request, res: Response) {
    try{
        const { name, description, price, url_image, id_category } = req.body;

        const newProduct = new Product({
            name,
            description,
            price,
            url_image,
            id_category
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({ message: 'Producto creado exitosamente', product: savedProduct });
    }
    catch(err){
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export async function getProducts(_req: Request, res: Response) {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    }
    catch(err){
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export async function deleteProduct(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if(!deletedProduct){
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        await ProductSize.deleteMany({ id_product: id });
        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    }
    catch(err){
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}