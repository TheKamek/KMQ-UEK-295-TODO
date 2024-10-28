import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../../base/base.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class RootService extends BaseService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super('root.service');
  }

  getHello(corrId: number): string {
    const method = 'getHello()';
    this.wl(corrId, method);
    const ret = 'Hello World!';
    this.wl(corrId, method, `ret: ${ret}`);
    return ret;
  }

  async getAwait(corrId: number): Promise<string> {
    const method = 'getAwait()';
    this.wl(corrId, method);
    Logger.debug(`corrId: ${corrId} -> app.service->getAwait() start`);
    return new Promise((resolve) => {
      setTimeout(() => {
        const ret = 'Await 2s!';
        this.wl(corrId, method, `ret: ${ret}!`);
        this.wl(corrId, method, `end!`);
        resolve(ret);
      }, 2000);
    });
  }

  getVersion(corrId: number) {
    const method = `getVersion()!`;
    this.wl(corrId, method);
    const ret = process.env.npm_package_version;
    this.wl(corrId, method, `ret: ${ret}`);
    return ret;
  }

  getHealthCheck() {
    // there is on purpose no log for this method at all
    return 'healthy!';
  }
}
