import { createUser } from "../controllers/userController.js";
import { CreateUserDto } from "../dto/createUser.dto.js";
import  validationMiddleware  from "../middlewares/middleware.js";
import { Router } from "express";

const r = Router();

r.post('/user', validationMiddleware(CreateUserDto), createUser);

export default r;