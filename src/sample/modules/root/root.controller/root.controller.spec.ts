import { Test, TestingModule } from '@nestjs/testing';
import { RootController } from './root.controller';
import { RootService } from '../root.service/root.service';
import { MockType } from '../../../mocktypes/mocktype';

export const RootServiceMockFactory: () => MockType<RootService> = jest.fn(() => ({
  getAwait: jest.fn((entity) => entity),
  getHealthCheck: jest.fn((entity) => entity),
  getHello: jest.fn((entity) => entity),
  getVersion: jest.fn((entity) => entity),
  resetTable: jest.fn((entity) => entity),
}));
describe('RootController', () => {
  let appController: RootController;
  let rootServiceMock: MockType<RootService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RootController],
      providers: [{ provide: RootService, useFactory: RootServiceMockFactory }],
    }).compile();

    appController = app.get<RootController>(RootController);
    rootServiceMock = app.get(RootService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });
  describe('root', () => {
    it('getHello', async () => {
      rootServiceMock.getHello.mockReturnValue('Hello World!');
      expect(appController.getHello(0)).toBe('Hello World!');
    });

    it('getHealthCheck', async () => {
      rootServiceMock.getHealthCheck.mockReturnValue('Healthy!');
      expect(await appController.getHealthCheck()).toEqual('Healthy!');
    });
    it('getVersion', async () => {
      rootServiceMock.getVersion.mockReturnValue(process.env.npm_package_version);
      expect(await appController.getVersion(0)).toEqual(process.env.npm_package_version);
    });
    it('getAwait', async () => {
      rootServiceMock.getAwait.mockReturnValue('Await 2s!');
      expect(await appController.getAwait(0)).toEqual('Await 2s!');
    });
  });
});
