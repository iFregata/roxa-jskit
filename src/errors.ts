export class AppError extends Error {
  code!: string;
  options!: any;
  constructor(message: string);
  constructor(message: string, options: any);
  constructor(message: string, options?: any, code?: string) {
    super(message);
    this.name = 'APP_ERROR';
    this.code = code || 'FAILED';
    if (options) this.options = options;
  }
}

export class AuthzError extends Error {
  code!: string;
  options!: any;
  constructor(message: string);
  constructor(message: string, options: any);
  constructor(message: string, options?: any, code?: string) {
    super(message);
    this.name = 'AUTH_ERROR';
    this.code = code || 'UNAUTHORIZED';
    if (options) this.options = options;
  }
}

export class SysError extends Error {
  code!: string;
  options!: any;
  constructor(message: string);
  constructor(message: string, cause: any);
  constructor(message: string, cause?: any, code?: string) {
    super(message);
    this.name = 'SYS_ERROR';
    this.code = code || 'SEVERE';
    if (cause) this.options = { cause: cause };
  }
}
