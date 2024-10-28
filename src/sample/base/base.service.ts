import { BaseLogger } from './base.logger';

export class BaseService extends BaseLogger {
  constructor(modulName: string) {
    super(modulName);
  }
}
