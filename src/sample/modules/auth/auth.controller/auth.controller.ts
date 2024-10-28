import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../base/base.controller';
import { AuthService } from '../auth.service/auth.service';
import { ErrorDto } from '../../../generic.dtos/error.dto';
import { BearerDto } from '../../../generic.dtos/bearer.dto';
import { LoginDto } from '../../../generic.dtos/login.dto';
import { CorrId } from '../../../decorators/correlation-id/correlation-id.decorator';

@Controller('auth')
@ApiTags('Auth Methods')
export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super('AuthController');
  }
  @ApiOkResponse({ description: 'The user has logged in, and get back the bearer info!', type: BearerDto })
  @ApiBadRequestResponse({ description: 'When the user does not exists or the password is wrong!', type: ErrorDto })
  @Post('login')
  async login(@CorrId() corrId: number, @Body() loginDto: LoginDto): Promise<BearerDto> {
    return this.authService.login(corrId, loginDto);
  }
}
