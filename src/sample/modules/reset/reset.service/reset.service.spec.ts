import { Test, TestingModule } from '@nestjs/testing';
import { ResetService } from './reset.service';
import { MockType } from '../../../mocktypes/mocktype';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

export const dataSourceMockFactory: () => MockType<DataSource> = jest.fn(() => ({
  query: jest.fn((entity) => entity),
}));

describe('root.service', () => {
  let service: ResetService;
  let dataSourceMock: MockType<DataSource>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResetService,
        {
          provide: getDataSourceToken(),
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();
    service = module.get<ResetService>(ResetService);
    dataSourceMock = module.get(getDataSourceToken());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Reset Table test not found', async () => {
    dataSourceMock.query.mockReturnValue([]);
    expect(service.resetTable(0, 'test')).rejects.toBeInstanceOf(NotFoundException);
  });
  it('Reset Table test found', async () => {
    dataSourceMock.query.mockReturnValue(['test']);
    // dataSourceMock.query.mockReturnValue(true);
    expect(await service.resetTable(0, 'test')).toEqual('Reset table test done!');
  });
});
