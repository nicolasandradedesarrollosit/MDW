import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const validationMiddleware = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const output = plainToInstance(dtoClass, req.body);
    const errors = await validate(output, { forbidNonWhitelisted: true });

    if (errors.length > 0) {
      const formattedErrors = errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
      }));
      return res.status(400).json(formattedErrors);
    }
    next();
  };
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';
    const decoded = jwt.verify(token, jwtSecret) as any;

    (req as any).user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export default validationMiddleware;