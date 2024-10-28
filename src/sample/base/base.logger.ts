import { Logger } from '@nestjs/common';

export class BaseLogger {
  constructor(private readonly modulName: string) {
    this.wl(0, 'constructor');
  }
  protected wl(corrId: number, methodName: string, text = 'start!'): void {
    Logger.debug(`corrId: ${corrId} | ${this.modulName}.${methodName} -> ${text}`);
  }
}
