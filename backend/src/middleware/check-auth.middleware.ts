import {Middleware} from '@loopback/rest';
import jwt from 'jsonwebtoken';

export const log: Middleware = async (middlewareCtx, next) => {
  const {request} = middlewareCtx;
  console.log('Request: %s %s', request.method, request.originalUrl);
  try {
    try {
      const token = request.headers.authorization?.split(' ')[1];
      console.log(token);
      if (token) {
        const decoded = jwt.verify(token, 'JWT_secret');
        if (!request.body) {
          request.body = {};
        }
        request.body.currentUser = decoded;
      } else {
        request.body.currentUser = null;
      }
    } catch (ignore) {}
    const result = await next();
    return result;
  } catch (err) {}
};
