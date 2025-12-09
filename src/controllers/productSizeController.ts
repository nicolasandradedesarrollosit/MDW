import ProductSize from '../models/productSizeModel.js';
import { Request, Response } from 'express';

export async function createProductSize(req: Request, res: Response) {
    try{
        const { id_product, size, stock } = req.body;
        const newProductSize = new ProductSize({
            id_product,
            size,
            stock
        });

        const savedProductSize = await newProductSize.save();
        res.status(201).json({ message: 'Product size created successfully', productSize: savedProductSize });
    }
    catch(err){
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getProductSizes(req: Request, res: Response) {
    try {
        const productSizes = await ProductSize.find();
        res.status(200).json(productSizes);
    }
    catch(err){
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function deleteProductSize(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const deletedProductSize = await ProductSize.findByIdAndDelete(id);
        if(!deletedProductSize){
            return res.status(404).json({ message: 'Product size not found' });
        }
        res.status(200).json({ message: 'Product size deleted successfully' });
    }
    catch(err){
        res.status(500).json({ message: 'Internal server error' });
    }
}