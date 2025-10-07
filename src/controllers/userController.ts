import User from '../models/userModel.js';
import { Request, Response } from 'express';

export async function createUser(req: Request, res: Response) {
    try{
        const { name, lastName, email, age, password } = req.body;

        const newUser = new User({
            name,
            lastName,
            email,
            age,
            password
        });

        await newUser.save();

        res.status(201).json({ message: 'Usuario creado exitosamente' });
    }
    catch(err){
        res.status(500).json({ message: 'Error interno del servidor' }); 
    }
}