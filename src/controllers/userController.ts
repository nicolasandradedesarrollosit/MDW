import User from '../models/userModel.js';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export async function createUser(req: Request, res: Response) {
    try{
        const { name, lastName, email, age, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            lastName,
            email,
            age,
            password: passwordHash
        });

        const savedUser = await newUser.save();
        const userResponse: any = savedUser.toObject();
        delete userResponse.password;

        res.status(201).json({ message: 'Usuario creado exitosamente', user: userResponse });
    }
    catch(err){
        res.status(500).json({ message: 'Error interno del servidor' }); 
    }
}

export async function logInUser(req: Request, res: Response) {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({ message: 'Credenciales inválidas' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) return res.status(400).json({ message: 'Credenciales inválidas' });

        const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';
        const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_key';

        const access = jwt.sign(
            { id: user._id.toString(), email: user.email },
            jwtSecret,
            { expiresIn: '1h' }
        );
        
        const refresh = jwt.sign(
            { id: user._id.toString(), email: user.email },
            jwtRefreshSecret,
            { expiresIn: '7d' }
        );

        res.cookie('accessToken', access, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 60 * 1000 * 60
        });

        res.cookie('refreshToken', refresh, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        return res.json({ message: "Login exitoso" })

    }
    catch(err){
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}