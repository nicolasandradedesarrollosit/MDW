import { 
    createUser,
    logInUser,
    checkSession,
    logout,
    getUsers
 } from "../controllers/userController.js";
import { CreateUserDto } from "../dto/createUser.dto.js";
import { validationMiddleware, adminMiddleware, authMiddleware } from "../middlewares/middleware.js";
import { Router } from "express";

const r = Router();

r.post('/user', validationMiddleware(CreateUserDto), createUser);
r.post('/login', logInUser);
r.post('/logout', logout);
r.get('/check-session', checkSession);
r.get('/users', authMiddleware, adminMiddleware, getUsers);

export default r;