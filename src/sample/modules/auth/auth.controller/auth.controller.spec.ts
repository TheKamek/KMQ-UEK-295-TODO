import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../auth.service/auth.service';
import { LoginDto } from '../../../generic.dtos/login.dto';
import { UserReturnDto } from '../../../generic.dtos/userDtoAndEntity';
import { MockType } from '../../../mocktypes/mocktype';
import { BadRequestException } from '@nestjs/common';

// we're testing with these users, and we expect this users
const retUser: UserReturnDto = {
  userId: 1,
  username: 'user',
  roles: ['user'],
};
const retAdmin: UserReturnDto = {
  userId: 2,
  username: 'admin',
  roles: ['user', 'admin'],
};
// we mock up the login method to create a showcase
export const AuthServiceMockupFactory: () => MockType<AuthService> = jest.fn(() => ({
  login: jest.fn((entity) => entity),
}));

describe('AuthController', () => {
  let controller: AuthController;
  let serviceMock: MockType<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useFactory: AuthServiceMockupFactory }],
    }).compile();
    controller = module.get<AuthController>(AuthController);
    serviceMock = module.get(AuthService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('login wrong credential', async () => {
    serviceMock.login.mockImplementation(() => {
      throw new BadRequestException('Username or password is wrong!');
    });
    try {
      await controller.login(0, { username: 'wrong', password: '12345' } as LoginDto);
    } catch (err: any) {
      expect(err instanceof BadRequestException).toEqual(true);
      expect(err.message).toEqual('Username or password is wrong!');
    }
  });
  it('login user', async () => {
    serviceMock.login.mockReturnValue(retUser);
    expect(await controller.login(0, { username: 'user', password: '12345' } as LoginDto)).toEqual(retUser);
  });
  it('login admin', async () => {
    serviceMock.login.mockReturnValue(retAdmin);
    expect(await controller.login(0, { username: 'admin', password: '12345' } as LoginDto)).toEqual(retAdmin);
  });
});
