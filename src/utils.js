import bcrypt from 'bcrypt';

// Encriptar contraseña
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Validar contraseña
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);