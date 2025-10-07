import app from './app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT || 4000);
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mdw';

const connectToDb = async () => {
  try {
    await mongoose.connect(mongoUri, {});
    console.log("MongoDB conectado");
  } catch (error) {
    console.error(`Error de conexión a MongoDB: ${error}`);
  }
};

(async () => {
  await connectToDb();
  app.listen(PORT, () => console.log(`Servidor siendo escuchado en el puerto ${PORT}`));
})();