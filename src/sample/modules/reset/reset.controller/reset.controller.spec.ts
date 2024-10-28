import { Test, TestingModule } from '@nestjs/testing';
import { MockType } from '../../../mocktypes/mocktype';
import { BadRequestException, MethodNotAllowedException } from '@nestjs/common';
import { ResetService } from '../reset.service/reset.service';
import { ResetController } from './reset.controller';
import { UserEntity } from '../../../generic.dtos/userDtoAndEntity';

const user: UserEntity = {
  password: 'no',
  roles: ['demo', 'user', 'admin'],
  userId: 0,
  username: 'demo',
};

export const ResetServiceMockFactory: () => MockType<ResetService> = jest.fn(() => ({
  getAwait: jest.fn((entity) => entity),
  getHealthCheck: jest.fn((entity) => entity),
  getHello: jest.fn((entity) => entity),
  getVersion: jest.fn((entity) => entity),
  resetTable: jest.fn((entity) => entity),
}));
describe('ResetController', () => {
  let appController: ResetController;
  let resetServiceMock: MockType<ResetService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ResetController],
      providers: [{ provide: ResetService, useFactory: ResetServiceMockFactory }],
    }).compile();

    appController = app.get<ResetController>(ResetController);
    resetServiceMock = app.get(ResetService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });
  it('resetTable not allowed', async () => {
    const msg = 'You have to be member of the role admin to call this method!';
    resetServiceMock.resetTable.mockImplementation(() => {
      throw new MethodNotAllowedException(msg);
    });
    try {
      const wrongUser = { ...user, roles: [] };
      await appController.resetTable(wrongUser, 0, 'Test');
    } catch (err: any) {
      expect(err instanceof MethodNotAllowedException).toEqual(true);
      expect(err.message).toEqual(msg);
    }
  });

  it('resetTable not found', async () => {
    const msg = 'Table Test not found!';
    resetServiceMock.resetTable.mockImplementation(() => {
      throw new BadRequestException(msg);
    });
    try {
      await appController.resetTable(user, 0, 'Test');
    } catch (err: any) {
      expect(err instanceof BadRequestException).toEqual(true);
      expect(err.message).toEqual(msg);
    }
  });
  it('resetTable valid', async () => {
    const msg = 'Reset table article done!';
    resetServiceMock.resetTable.mockReturnValue(msg);
    expect(await appController.resetTable(user, 0, 'Test')).toEqual(msg);
  });
});
