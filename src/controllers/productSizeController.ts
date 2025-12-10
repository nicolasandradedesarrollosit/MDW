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

export async function updateProductSize(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const productSize = await ProductSize.findById(id);
        if (!productSize) return res.status(404).json({ message: 'Product size not found' });

        const allowedUpdates = ['id_product', 'size', 'stock'];

        const valuesAreDifferent = (incoming: any, existing: any) => {
            if (incoming === undefined) return false; // no update requested
            if (incoming === null && existing === null) return false;
            if (existing === null && incoming !== null) return true;
            if (typeof existing === 'number') {
                const incomingNum = Number(incoming);
                return Number.isNaN(incomingNum) ? true : incomingNum !== existing;
            }
            if (existing instanceof Date) {
                const incomingDate = new Date(incoming);
                return Number.isNaN(incomingDate.getTime()) ? true : incomingDate.getTime() !== existing.getTime();
            }
            const existingStr = existing !== undefined && existing !== null ? String(existing).trim() : '';
            const incomingStr = incoming !== undefined && incoming !== null ? String(incoming).trim() : '';
            return incomingStr !== existingStr;
        };

        allowedUpdates.forEach(field => {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                const incoming = req.body[field];
                const existing = (productSize as any)[field];
                if (valuesAreDifferent(incoming, existing)) {
                    (productSize as any)[field] = incoming;
                }
            }
        });

        const updateProductSize = await productSize.save();
        res.status(200).json({ message: 'Product size updated successfully', productSize: updateProductSize });
        
    }
    catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
}