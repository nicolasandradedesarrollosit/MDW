import User from '../models/userModel.js';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export async function createUser(req: Request, res: Response) {
    try{
        console.log('createUser - Datos recibidos:', req.body);
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
        console.log('Usuario guardado exitosamente:', savedUser.email);
        
        const userResponse: any = savedUser.toObject();
        delete userResponse.password;

        const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';
        const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_key';

        console.log('Generando tokens para nuevo usuario...');
        const access = jwt.sign(
            { 
                id: savedUser._id.toString(), 
                email: savedUser.email,
                name: savedUser.name,
                lastName: savedUser.lastName,
                age: savedUser.age,
                isAdmin: savedUser.isAdmin || false
            },
            jwtSecret,
            { expiresIn: '1h' }
        );
        
        const refresh = jwt.sign(
            { 
                id: savedUser._id.toString(), 
                email: savedUser.email,
                name: savedUser.name,
                lastName: savedUser.lastName,
                age: savedUser.age,
                isAdmin: savedUser.isAdmin || false
            },
            jwtRefreshSecret,
            { expiresIn: '7d' }
        );

        const isProduction = process.env.NODE_ENV === 'production';
        console.log('Configurando cookies (isProduction:', isProduction, ')');
        
        res.cookie('accessToken', access, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 60 * 1000 * 60
        });

        res.cookie('refreshToken', refresh, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        console.log('Cookies configuradas, enviando respuesta...');
        console.log('accessToken (primeros 50 chars):', access.substring(0, 50));
        console.log('refreshToken (primeros 50 chars):', refresh.substring(0, 50));
        
        return res.status(201).json({ message: 'Usuario creado exitosamente', user: userResponse });
    }
    catch(err){
        console.error('Error en createUser:', err);
        res.status(500).json({ message: 'Error interno del servidor' }); 
    }
}

export async function logInUser(req: Request, res: Response) {
    try{
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son requeridos' });
        }

        const user = await User.findOne({email});
        
        if(!user) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if(!isPasswordValid) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';
        const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_key';

        const access = jwt.sign(
            { 
                id: user._id.toString(), 
                email: user.email,
                name: user.name,
                lastName: user.lastName,
                age: user.age,
                isAdmin: user.isAdmin || false
            },
            jwtSecret,
            { expiresIn: '1h' }
        );
        
        const refresh = jwt.sign(
            { 
                id: user._id.toString(), 
                email: user.email,
                name: user.name,
                lastName: user.lastName,
                age: user.age,
                isAdmin: user.isAdmin || false
            },
            jwtRefreshSecret,
            { expiresIn: '7d' }
        );

        const isProduction = process.env.NODE_ENV === 'production';
        
        res.cookie('accessToken', access, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 60 * 1000 * 60
        });

        res.cookie('refreshToken', refresh, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        return res.json({ 
            message: "Login exitoso", 
            user: { 
                email: user.email, 
                name: user.name,
                isAdmin: user.isAdmin
            } 
        })

    }
    catch(err){
        console.error('Error en logInUser:', err);
        res.status(500).json({ message: 'Error interno del servidor', error: err instanceof Error ? err.message : 'Unknown error' });
    }
}

export async function logout(req: Request, res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax'
    });
    
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax'
    });
    
    res.status(200).json({ message: 'Logout exitoso' });
}

export async function checkSession(req: Request, res: Response) {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json({loggedIn: false});

    try {
        const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';
        const payload: any = jwt.verify(token, jwtSecret);
        
        console.log('checkSession - payload completo:', payload);
        
        const response: any = {
            loggedIn: true, 
            name: payload.name, 
            email: payload.email, 
            lastName: payload.lastName, 
            age: payload.age,
            isAdmin: payload.isAdmin
        };

        if (payload.isAdmin) {
            console.log('checkSession - Usuario es admin!');
            response.features = { adminPanel: true };
        }

        console.log('checkSession - response:', response);
        res.json(response);
    }
    catch (err) {
        res.status(401).json({loggedIn: false});
    }
}

export async function getUsers(req: Request, res: Response) {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    }
    catch (err) {
        console.error('Error en getUsers:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}