import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cart: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'carts' // Asegúrate que el nombre coincida con tu colección de carritos
    },
    role: { type: String, default: 'user' }
});

export const userModel = mongoose.model(userCollection, userSchema);