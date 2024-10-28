import { Controller, Get } from '@nestjs/common';
import { RootService } from '../root.service/root.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CorrId } from '../../../decorators/correlation-id/correlation-id.decorator';
import { BaseController } from '../../../base/base.controller';

@ApiTags('Root Methods')
@Controller()
export class RootController extends BaseController {
  constructor(private readonly rootService: RootService) {
    super('root.controller');
  }

  @Get()
  @ApiOkResponse({
    description: 'please try /todo!',
    type: String,
  })
  getHello(@CorrId() corrId: number): string {
    this.wl(corrId, 'getHello()');
    return this.rootService.getHello(corrId);
  }

  @Get('/healthcheck')
  @ApiOkResponse({
    description: 'healthy!',
    type: String,
  })
  async getHealthCheck(): Promise<string> {
    // there is on purpose no log for this method at all
    return this.rootService.getHealthCheck();
  }

  @Get('/version')
  @ApiOkResponse({
    description: 'Get the version of the api back!',
    type: String,
  })
  async getVersion(@CorrId() corrId: number): Promise<string> {
    this.wl(corrId, 'getVersion()');
    return this.rootService.getVersion(corrId);
  }

  @Get('/wait2s')
  @ApiOkResponse({
    description: 'wait 2s',
    type: String,
  })
  async getAwait(@CorrId() corrId: number): Promise<string> {
    this.wl(corrId, 'getHello()');
    return await this.rootService.getAwait(corrId);
  }
}
