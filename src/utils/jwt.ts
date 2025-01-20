// utils/jwt.ts
import jwt from 'jsonwebtoken';

// import { isTokenBlacklisted } from './redius';
const SECRET_KEY = 'b113d52a-ea2c-4236-a46d-f195459728bc'; //code will not work on env 
const JWT_ACCESS_EXPIRATION = '1d';


export function generateToken(payload: object, expiresIn: string = JWT_ACCESS_EXPIRATION): string {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

export function verifyToken(token: string): any {
    try {
        // if (isTokenBlacklisted(token)) {
        //     throw new Error('Token blacklisted');
        // }
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        throw new Error('Invalid token');
    }


}
export function expireToken(token: string): any {
    try {
        const authHeader = (token?.split("Bearer ")[1] ||
            token?.split("bearer ")[1] ||
            token?.split("b ")[1]) as string;
        const decoded = jwt.verify(authHeader, SECRET_KEY);
        console.log(decoded)
        // const id = decoded.id?
    } catch (error) {
        throw new Error('Invalid token');
    }
}