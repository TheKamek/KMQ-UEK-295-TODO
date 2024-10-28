import { JwtStrategy } from './jwt.strategy';
import { MockType } from '../../../mocktypes/mocktype';
import { AuthService } from '../auth.service/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

export const AuthServiceMockupFactory: () => MockType<AuthService> = jest.fn(() => ({
  login: jest.fn((entity) => entity),
  validateUser: jest.fn((entity) => entity),
}));
describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let serviceMock: MockType<AuthService>;
  beforeEach(async () => {
    process.env.JWT_SECRET = 'my dummy secret';
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy, { provide: AuthService, useFactory: AuthServiceMockupFactory }],
    }).compile();
    strategy = module.get(JwtStrategy);
    serviceMock = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('check valid user', async () => {
    const mockUser = { userId: 1 };
    serviceMock.validateUser.mockReturnValue(mockUser);
    expect(await strategy.validate('user')).toEqual(mockUser);
  });
  it('check invalid user', async () => {
    serviceMock.validateUser.mockReturnValue(null);
    try {
      await strategy.validate('user');
    } catch (err) {
      expect(err instanceof UnauthorizedException).toEqual(true);
      expect(err.message).toBe('Unauthorized');
    }
  });
});
