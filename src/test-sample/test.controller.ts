import { Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TestService } from './test.service';
import { CurrentUser } from '../sample/decorators/current-user/current-user.decorator';
import { JwtAuthGuard } from '../sample/modules/auth/guards/jwt-auth.guard';

export class User {
  name: string;
  roles: string[];
}

@Controller('test')
@UseGuards(JwtAuthGuard)
export class TestController {
  constructor(private readonly testService: TestService) {}

  // bitte beachten, dass wir hier die ParseIntPipe verwenden können, um sicher eine Zahl zu haben
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.testService.findOneTest(+id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    const findRole = user.roles.find((role: string) => role === 'admin');
    if (!findRole) {
      // not allowed
      throw new ForbiddenException('User ist nicht in der richtigen Rolle. Es wird die Rolle Administrator erwartet'!);
    }
    return this.testService.delete(id);
  }
}
