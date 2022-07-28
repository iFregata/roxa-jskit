import express from 'express';
import { AuthzHandler } from './auth-handler';

export const mockAuth: AuthzHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  next();
};


