import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service/auth.service';
import { Security } from '../../../../security';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Security.secret,
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(0, payload.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
