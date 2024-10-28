import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as pk from 'pkginfo';

pk(module);
const version = module.exports.version;
describe('Base (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // app.useLogger(new TestLogger());
    await app.init();
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });

  it('/version (GET)', () => {
    return request(app.getHttpServer()).get('/version').expect(200).expect(version);
  });

  it('/healthcheck (GET)', () => {
    return request(app.getHttpServer()).get('/healthcheck').expect(200).expect('healthy!');
  });

  it('/wait2s (GET)', () => {
    return request(app.getHttpServer()).get('/wait2s').expect(200).expect('Await 2s!');
  });
});
