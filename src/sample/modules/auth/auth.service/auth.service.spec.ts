import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user.service/user.service';
import { BadRequestException } from '@nestjs/common';

class JwtServiceMockup {
  sign() {
    return {
      token: 'a mockup token',
    };
  }
}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, AuthService, { provide: JwtService, useClass: JwtServiceMockup }],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser Methods', () => {
    it('validateUser user hardcoded', async () => {
      expect(await service.validateUser(0, 'user')).toEqual({
        userId: 1,
        username: 'user',
        password: '12345',
        roles: ['user'],
      });
    });
    it('validateUser admin hardcoded', async () => {
      expect(await service.validateUser(0, 'admin')).toEqual({
        userId: 2,
        username: 'admin',
        password: '12345',
        roles: ['user', 'admin'],
      });
    });
    it('validateUser wrong user', async () => {
      try {
        await service.validateUser(0, 'wrongUser');
      } catch (err: any) {
        expect(err instanceof BadRequestException).toEqual(true);
        expect(err.message).toBe('Username is wrong!');
      }
    });
  });

  describe('login', () => {
    it('login successfully', async () => {
      const obj = await service.login(0, { username: 'user', password: '12345' });
      expect(obj.token).toEqual({ token: 'a mockup token' });
    });
    it('login wrong user', async () => {
      try {
        await service.login(0, { username: 'wrong', password: '12345' });
      } catch (err: any) {
        expect(err instanceof BadRequestException).toEqual(true);
        expect(err.message).toEqual('Username or password is wrong!');
      }
    });
  });
});
