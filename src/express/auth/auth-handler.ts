import express from 'express';

export interface AuthzHandler {
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void>;
};