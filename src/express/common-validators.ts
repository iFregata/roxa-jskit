import express from 'express';
import {
  ValidationChain,
  validationResult,
  ValidationError as expressValidationError,
} from 'express-validator';
import {
  Exclude,
  Expose,
  plainToClassFromExist,
  Type,
} from 'class-transformer';
import {
  ValidateNested,
  validateOrReject,
  ValidationError,
} from 'class-validator';
import { AppError } from '../errors';

class ObjectWrapper<T> {
  @Exclude()
  private type: Function;

  @Expose()
  @Type((options) => {
    return (options?.newObject as ObjectWrapper<T>).type;
  })
  @ValidateNested()
  instance?: T;

  constructor(type: Function) {
    this.type = type;
  }
}

class ArrayWrapper<T> {
  @Exclude()
  private type: Function;

  @Expose()
  @Type((options) => {
    return (options?.newObject as ArrayWrapper<T>).type;
  })
  @ValidateNested()
  instances?: T[];

  constructor(type: Function) {
    this.type = type;
  }
}

export async function validateJsonObject<T>(
  jsonBody: { [key: string]: any },
  clazz: new () => T
) {
  const val = plainToClassFromExist(
    new ObjectWrapper<T>(clazz),
    { instance: jsonBody },
    { excludeExtraneousValues: true }
  );
  return await validateOrReject(val, { validationError: { target: false } });
}

export async function validateJsonArray<T>(
  jsonBody: { [key: string]: any },
  clazz: new () => T
) {
  const val = plainToClassFromExist(
    new ArrayWrapper<T>(clazz),
    { instance: jsonBody },
    { excludeExtraneousValues: true }
  );
  return await validateOrReject(val, { validationError: { target: false } });
}

export const validationChainFilter = (validations: ValidationChain[],invalidAltHandler?: (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
  appError: AppError
) => void) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    await Promise.all(validations.map((val) => val.run(req)));
    const errors = validationResult(req).formatWith(flatFormatter);
    if (errors.isEmpty()) {
      return next();
    }
    const appError = new AppError(
      'Parameters or payload of request is invalid',
      errors.array().flatMap(e=>e)
    )
    if(invalidAltHandler){
      invalidAltHandler(req,res,next,appError);
    }else{
      next(appError);
    }
  };
};

const flatFormatter = ({
  location,
  msg,
  param,
  value,
  nestedErrors,
}: expressValidationError) => {
  if (msg instanceof Array<ValidationError>){
    const collector: string[] = [];
    flatErrors(msg,collector);
    return collector;
  }
  return `${location}.${param}: ${msg}`;
};

const flatErrors = (errors: ValidationError[], collector: string[], msg?: string)=>{
  const ptr = msg ? `${msg}` : '';
  for (const validationError of errors) {
    if (validationError.constraints) {
      for (const key in validationError.constraints) {
        if (validationError.constraints[key]) {
          const formatProperty = ptr
            ? `.${validationError.property}`
            : `${validationError.property}`;
          const field = isNaN(parseInt(validationError.property, 10))
            ? formatProperty
            : `[${validationError.property}]`;
            collector.push(`body${field}: ${validationError.constraints[key]}`);
        }
      }
    }

    if (validationError.children && validationError.children.length) {
      const formatProperty = ptr
        ? `.${validationError.property}`
        : `${validationError.property}`;
      const field = isNaN(parseInt(validationError.property, 10))
        ? formatProperty
        : `[${validationError.property}]`;
        flatErrors(validationError.children, collector, `${ptr}${field}`);
    }
  }
}