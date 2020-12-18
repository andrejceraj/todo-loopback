import {RequestContext} from '@loopback/rest';
import jwt from 'jsonwebtoken';

export const checkAuth = (context: RequestContext): any => {
  try {
    const token = context.request.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, 'JWT_secret');
      if (decoded) {
        return decoded;
      }
    }
    throw {};
  } catch (err) {
    throw {
      code: 401,
      message: 'Unauthorized',
    };
  }
};
