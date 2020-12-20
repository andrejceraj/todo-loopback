import {HttpErrors, RequestContext} from '@loopback/rest';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || "JWT_secret";

export const checkAuth = (context: RequestContext): any => {
  try {
    const token = context.request.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, jwtSecret);
      if (decoded) {
        return decoded;
      }
    }
    throw {};
  } catch (err) {
    throw new HttpErrors.Unauthorized('Not authorized for action');
  }
};

export const generateToken = (userData: {id?: number, username: string}): string => {
  const token = jwt.sign(userData, jwtSecret);
  return token;
}
