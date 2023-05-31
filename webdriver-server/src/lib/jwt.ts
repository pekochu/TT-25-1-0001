/**
 * This library is used to generate confirmation tokens needed for certain actions.
 */

import { sign, verify } from 'jsonwebtoken';
import { UserSession } from '@project/server/app/lib/types/auth';

export const generateToken = (
  payload: any,
  secret: string,
  expiresIn: string | number | undefined
): string => {
  return sign(payload, secret, {
    expiresIn,
  });
};

export const verifyToken = (
  token: string,
  secret: string
): Promise<UserSession> => {
  return new Promise((resolve, reject) => {
    try {
      verify(token, secret, (err, decoded) => {
        if (err || !decoded) {
          return reject(err);
        }
        const userDecoded = decoded as UserSession;
        // Now, convert decoded to UserSession by removing additional properties
        const userSession: UserSession = {
          id: userDecoded.id,
          email: userDecoded.email,
          nombre: userDecoded.nombre,
        };
        resolve(userSession);
      });
    } catch (err) {
      reject(err);
    }
  });
};