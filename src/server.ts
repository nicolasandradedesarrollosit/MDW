import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import mongoose from 'mongoose';

const PORT = Number(process.env.PORT || 4000);
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mdw';

const connectToDb = async () => {
  try {
    await mongoose.connect(mongoUri, {});
    console.log("MongoDB conectado");
  } catch (error) {
    console.error(`Error de conexión a MongoDB:`, error);
    throw error;
  }
};

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

(async () => {
  try {
    await connectToDb();
    app.listen(PORT, () => console.log(`Servidor siendo escuchado en el puerto ${PORT}`));
  } catch (error) {
    console.error('Error fatal al iniciar el servidor:', error);
    process.exit(1);
  }
})();

export default app;