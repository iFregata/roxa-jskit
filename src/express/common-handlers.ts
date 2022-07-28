import express from 'express';
import { AppError, AuthzError, SysError } from '../errors';

export const exceptionally = (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (err instanceof AppError) {
    res.status(200).send({
      code: err.code,
      messages: {
        type: err.name,
        summary: err.message,
        details: err.options,
      },
    });
  } else if (err instanceof SysError) {
    res.status(500).send({
      code: err.code,
      messages: {
        type: err.name,
        summary: err.message,
        details: err.options,
      },
    });
  } else if (err instanceof AuthzError) {
    res.status(401).send({
      code: err.code,
      messages: {
        type: err.name,
        summary: err.message,
        details: err.options,
      },
    });
  } else {
    res.status(500).send({
      code: 'UNEXPECTED',
      messages: {
        type: 'FATAL',
        summary: err.message,
      },
    });
  }
};

export const succeed = (res: express.Response, payload: any) => {
  return res.status(200).json({
    code: 'SUCCEED',
    payload: payload,
  });
};
