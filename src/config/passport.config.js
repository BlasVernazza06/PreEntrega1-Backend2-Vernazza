import passport from 'passport';
import jwt from 'passport-jwt';

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
    // Extractor personalizado para leer el token de la cookie
    const cookieExtractor = req => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies[process.env.COOKIE_NAME]; // Nombre de la cookie desde .env
        }
        return token;
    };

    passport.use('current', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET // Secreto desde .env
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }));
};

export default initializePassport;