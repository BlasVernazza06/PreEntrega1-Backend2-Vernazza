import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import dotenv from 'dotenv';
import initializePassport from './config/passport.config.js';
import sessionRouter from './routes/sessions.router.js';

dotenv.config({ path: './.env.development' });

const app = express();
const PORT = process.env.PORT || 8080;

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB connected"))
    .catch(error => console.error("Error en conexión:", error));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Passport
initializePassport();
app.use(passport.initialize());

// Rutas
app.use('/api/sessions', sessionRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));