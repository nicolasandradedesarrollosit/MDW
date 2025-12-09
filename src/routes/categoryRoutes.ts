import {
    getCategories
} from '../controllers/categoryController.js';
import { Router } from 'express';

const r = Router();

r.get('/categories', getCategories);

export default r;