import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user.service/user.service';
import { JwtService } from '@nestjs/jwt';
import { BearerDto } from '../../../generic.dtos/bearer.dto';
import { LoginDto } from '../../../generic.dtos/login.dto';
import { BaseService } from '../../../base/base.service';
import { UserEntity } from '../../../generic.dtos/userDtoAndEntity';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {
    super('AuthService');
  }
  async validateUser(corrId: number, username: string): Promise<UserEntity> {
    const methodName = 'validUser()';
    this.wl(corrId, methodName, `username: ${username}`);
    const user = await this.usersService.findOne(username);
    if (user) {
      this.wl(corrId, methodName, 'Successfully check the user!');
      return user;
    }
    const msg = 'Username is wrong!';
    this.wl(corrId, methodName, msg);
    throw new BadRequestException(msg);
  }
  async login(corrId: number, loginDto: LoginDto): Promise<BearerDto> {
    const methodName = 'login.controller()';
    this.wl(corrId, methodName, `username: ${loginDto.username}, password: ${loginDto.password}`);
    const user = await this.usersService.findOne(loginDto.username);
    if (user && user.password === loginDto.password) {
      const payload = { username: user.username, sub: user.userId, roles: user.roles };
      this.wl(corrId, methodName, 'Successfully check the user and the password!');
      return {
        token: this.jwtService.sign(payload),
      };
    }
    const msg = 'Username or password is wrong!';
    this.wl(corrId, methodName, msg);
    throw new BadRequestException(msg);
  }
}
