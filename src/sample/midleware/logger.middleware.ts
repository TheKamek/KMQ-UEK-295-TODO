import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction, Request } from 'express';
import { Constants } from '../constants/constants';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const corrId = this.getRandomIntInclusive(100000, 999999);
    req[Constants.correlationId] = corrId;
    const msg = `corrId: ${corrId} -> caller ip: ${req.ip} | baseUrl: ${req.url} | verb: ${req.method}`;
    Logger.debug(msg);
    next();
  }

  private getRandomIntInclusive(min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }
}
