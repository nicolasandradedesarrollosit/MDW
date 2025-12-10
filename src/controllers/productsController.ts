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

export async function updateProduct(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

        const allowedUpdates = ['name', 'description', 'price', 'url_image', 'id_category'];

        // helper: compare incoming value vs existing value and only set when different
        const valuesAreDifferent = (incoming: any, existing: any) => {
            if (incoming === undefined) return false; // no update requested
            if (incoming === null && existing === null) return false;
            if (existing === null && incoming !== null) return true;
            if (typeof existing === 'number') {
                // When existing is a number, coerce and compare
                const incomingNum = Number(incoming);
                return Number.isNaN(incomingNum) ? true : incomingNum !== existing;
            }
            if (existing instanceof Date) {
                const incomingDate = new Date(incoming);
                return Number.isNaN(incomingDate.getTime()) ? true : incomingDate.getTime() !== existing.getTime();
            }
            // Compare trimmed strings for equality
            const existingStr = existing !== undefined && existing !== null ? String(existing).trim() : '';
            const incomingStr = incoming !== undefined && incoming !== null ? String(incoming).trim() : '';
            return incomingStr !== existingStr;
        };

        allowedUpdates.forEach(field => {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                const incoming = req.body[field];
                const existing = (product as any)[field];
                if (valuesAreDifferent(incoming, existing)) {
                    (product as any)[field] = incoming;
                }
            }
        });

        const updateProduct = await product.save();
        res.status(200).json({ message: 'Producto actualizado exitosamente', product: updateProduct });
        
    }
    catch (err) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}