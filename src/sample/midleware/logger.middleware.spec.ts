import { LoggerMiddleware } from './logger.middleware';
import { Response, NextFunction, Request } from 'express';
import { Constants } from '../constants/constants';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;
  beforeEach(() => {
    middleware = new LoggerMiddleware();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('check', () => {
    const req: { [Constants.correlationId]: number } = { [Constants.correlationId]: undefined };
    const res: Response = null;
    const next: NextFunction = () => null;
    // call the method
    // HINT yes we have cast to any and then cast as request!
    middleware.use(req as any as Request, res, next);
    expect(req[Constants.correlationId]).toBeDefined();
  });
});
