import { Test, TestingModule } from '@nestjs/testing';
import { RootService } from './root.service';
import * as process from 'process';
import { MockType } from '../../../mocktypes/mocktype';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';

export const dataSourceMockFactory: () => MockType<DataSource> = jest.fn(() => ({
  query: jest.fn((entity) => entity),
}));

describe('root.service', () => {
  let service: RootService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RootService,
        {
          provide: getDataSourceToken(),
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();
    service = module.get<RootService>(RootService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getHello', () => {
    expect(service.getHello(0)).toEqual('Hello World!');
  });

  it('getAwait', async () => {
    expect(await service.getAwait(0)).toEqual('Await 2s!');
  });

  it('getVersion', () => {
    const version = process.env.npm_package_version;
    expect(service.getVersion(0)).toEqual(version);
  });

  it('getHealthCheck', () => {
    expect(service.getHealthCheck()).toEqual('healthy!');
  });
});
