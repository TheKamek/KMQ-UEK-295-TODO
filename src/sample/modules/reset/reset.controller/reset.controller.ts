import { Controller, Delete, MethodNotAllowedException, Param, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiMethodNotAllowedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CorrId } from '../../../decorators/correlation-id/correlation-id.decorator';
import { BaseController } from '../../../base/base.controller';
import { ResetService } from '../reset.service/reset.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../decorators/current-user/current-user.decorator';
import { UserEntity } from '../../../generic.dtos/userDtoAndEntity';
import { ErrorUnauthorizedDto } from '../../../generic.dtos/error.unauthorized.dto';

@ApiTags('Reset Table Methods')
@Controller()
@ApiBearerAuth()
export class ResetController extends BaseController {
  constructor(private readonly resetService: ResetService) {
    super('reset.controller');
  }

  @UseGuards(JwtAuthGuard)
  @Delete('reset/:table')
  @ApiOkResponse({
    description: 'reset the table by calling an SQL Script that drop the table and reset the identity column',
    type: String,
  })
  @ApiMethodNotAllowedResponse({
    description: 'You have to be member of the role admin to call this method!',
    type: MethodNotAllowedException,
  })
  @ApiBadRequestResponse({ description: 'Table [tableName] not found!', type: String })
  @ApiUnauthorizedResponse({ description: 'Not logged in!', type: ErrorUnauthorizedDto })
  async resetTable(
    @CurrentUser() user: UserEntity,
    @CorrId() corrId: number,
    @Param('table') tableName: string,
  ): Promise<string> {
    const methodName = 'resetTable';
    // hint: usually we should do this with a guard, I just this example here to explain how we can access the user context in a method
    if (user.roles.find((f) => f === 'admin')) {
      this.wl(corrId, methodName);
      return this.resetService.resetTable(corrId, tableName);
    } else {
      throw new MethodNotAllowedException('You have to be member of the role admin to call this method!');
    }
  }
}
