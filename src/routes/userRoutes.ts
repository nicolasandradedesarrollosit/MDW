import { 
    createUser,
    logInUser,
    checkSession,
    logout,
    getUsers
 } from "../controllers/userController.js";
import { CreateUserDto, LogInDto } from "../dto/user.dto.js";
import { validationMiddleware, adminMiddleware, authMiddleware } from "../middlewares/middleware.js";
import { Router } from "express";

const r = Router();

r.post('/user', validationMiddleware(CreateUserDto), createUser);
r.post('/login', validationMiddleware(LogInDto), logInUser);
r.post('/logout', authMiddleware, logout);
r.get('/check-session', authMiddleware, checkSession);
r.get('/users', authMiddleware, adminMiddleware, getUsers);

export default r;