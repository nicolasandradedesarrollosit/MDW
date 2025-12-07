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
                isAdmin: savedUser.isAdmin
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
                isAdmin: savedUser.isAdmin
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
        console.log('Intento de login con:', { email: req.body.email });
        
        const { email, password } = req.body;
        
        if (!email || !password) {
            console.log('Faltan credenciales');
            return res.status(400).json({ message: 'Email y contraseña son requeridos' });
        }

        console.log('Buscando usuario en la base de datos...');
        const user = await User.findOne({email});
        
        if(!user) {
            console.log('Usuario no encontrado:', email);
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        console.log('Usuario encontrado, verificando contraseña...');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if(!isPasswordValid) {
            console.log('Contraseña inválida para:', email);
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        console.log('Generando tokens JWT...');
        const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';
        const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_key';

        const access = jwt.sign(
            { 
                id: user._id.toString(), 
                email: user.email,
                name: user.name,
                lastName: user.lastName,
                age: user.age,
                isAdmin: user.isAdmin
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
                isAdmin: user.isAdmin
            },
            jwtRefreshSecret,
            { expiresIn: '7d' }
        );

        console.log('Configurando cookies...');
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

        console.log('Login exitoso para:', email);
        return res.json({ message: "Login exitoso", user: { email: user.email, name: user.name } })

    }
    catch(err){
        console.error('Error en logInUser:', err);
        res.status(500).json({ message: 'Error interno del servidor', error: err instanceof Error ? err.message : 'Unknown error' });
    }
}

export async function checkSession(req: Request, res: Response) {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json({loggedIn: false});

    try {
        const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';
        const payload: any = jwt.verify(token, jwtSecret);
        
        const response: any = {
            loggedIn: true, 
            name: payload.name, 
            email: payload.email, 
            lastName: payload.lastName, 
            age: payload.age
        };

        if (payload.isAdmin) {
            response.features = { adminPanel: true };
        }

        res.json(response);
    }
    catch (err) {
        res.status(401).json({loggedIn: false});
    }
}