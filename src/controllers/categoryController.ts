import Category from '../models/categoryModel.js';
import { Request, Response } from 'express';

export async function getCategories(_req: Request, res: Response) {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    }
    catch(err) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}