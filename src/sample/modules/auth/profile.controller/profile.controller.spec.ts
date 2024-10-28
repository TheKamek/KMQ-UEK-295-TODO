import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { UserInfoDto, UserReturnDto } from '../../../generic.dtos/userDtoAndEntity';
import { MockType } from '../../../mocktypes/mocktype';
import { UserService } from '../user.service/user.service';

// we're testing with these users, and we expect this users
const retUser: UserReturnDto = {
  userId: 1,
  username: 'user',
  roles: ['user'],
};
// we mock up the login method to create a showcase
export const UserServiceMockupFactory: () => MockType<UserService> = jest.fn(() => ({
  findOne: jest.fn((entity) => entity),
}));

describe('ProfileController', () => {
  let controller: ProfileController;
  let serviceMock: MockType<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [{ provide: UserService, useFactory: UserServiceMockupFactory }],
    }).compile();
    controller = module.get<ProfileController>(ProfileController);
    serviceMock = module.get(UserService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('getProfile', async () => {
    serviceMock.findOne.mockReturnValue(retUser);
    expect(await controller.getProfile(0, { userId: 1, username: '12345' } as UserInfoDto)).toEqual(retUser);
  });
});
