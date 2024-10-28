import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { BaseController } from '../../../base/base.controller';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserInfoDto, UserReturnDto } from '../../../generic.dtos/userDtoAndEntity';
import { ErrorUnauthorizedDto } from '../../../generic.dtos/error.unauthorized.dto';
import { CurrentUser } from '../../../decorators/current-user/current-user.decorator';
import { CorrId } from '../../../decorators/correlation-id/correlation-id.decorator';
import { UserService } from '../user.service/user.service';

@Controller('auth')
@ApiTags('Auth Methods')
@ApiBearerAuth()
export class ProfileController extends BaseController {
  constructor(private readonly userService: UserService) {
    super('ProfileController');
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOkResponse({
    description: 'get the current user back',
    type: UserReturnDto,
  })
  @ApiUnauthorizedResponse({ description: 'Not logged in!', type: ErrorUnauthorizedDto })
  async getProfile(@CorrId() corrId: number, @CurrentUser() userInfoDto: UserInfoDto): Promise<UserReturnDto> {
    const method = 'getProfile';
    this.wl(corrId, method, `userInfoDto: ${JSON.stringify(userInfoDto, null, 2)}`);
    const userEntity = await this.userService.findOne(userInfoDto.username);
    this.wl(corrId, method, `userEntity: ${JSON.stringify(userEntity, null, 2)}`);
    const userReturn = {
      userId: userEntity.userId,
      username: userEntity.username,
      roles: userEntity.roles,
    } as UserReturnDto;
    this.wl(corrId, method, `userReturn: ${JSON.stringify(userReturn, null, 2)}`);
    return userReturn;
  }
}
