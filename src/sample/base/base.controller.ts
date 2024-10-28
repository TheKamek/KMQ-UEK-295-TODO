import { BaseLogger } from './base.logger';

export class BaseController extends BaseLogger {
  constructor(modulName: string) {
    super(modulName);
  }
}
