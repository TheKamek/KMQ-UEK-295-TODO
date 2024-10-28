import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { LoginDto } from '../src/sample/generic.dtos/login.dto';
import { BearerDto } from '../src/sample/generic.dtos/bearer.dto';
import { UserReturnDto } from '../src/sample/generic.dtos/userDtoAndEntity';
import { TestLogger } from './testing-tools/logger.tools';
import { TestHttpClient } from './testing-tools/test-http-client';
export const loginDtoUser: LoginDto = {
  username: 'user',
  password: '12345',
};
export const loginDtoAdmin: LoginDto = {
  username: 'admin',
  password: '12345',
};
describe('AppController Security (e2e)', () => {
  let app: INestApplication;
  let httpClient: TestHttpClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useLogger(new TestLogger());
    // init app
    await app.init();
    // init httpClient
    httpClient = new TestHttpClient(app, '');
    // prepare tokens
    await httpClient.createTokens();
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  it('/auth/login wrong username (POST)', () => {
    const loginDto: LoginDto = {
      username: 'user2',
      password: '12345',
    };
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(400)
      .expect({ statusCode: 400, message: 'Username or password is wrong!', error: `Bad Request` });
  });
  it('/auth/login wrong password (POST)', () => {
    const loginDto: LoginDto = {
      username: 'user',
      password: '123456',
    };
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(400)
      .expect({ statusCode: 400, message: 'Username or password is wrong!', error: `Bad Request` });
  });

  it('/auth/profile wrong (GET)', () => {
    return request(app.getHttpServer())
      .get('/auth/profile')
      .expect(401)
      .expect({ statusCode: 401, message: 'Unauthorized' });
  });

  it('/auth/login user (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDtoUser)
      .expect(201)
      .then((res) => {
        const body: BearerDto = res.body;
        expect(body.token).toBeDefined();
        httpClient.userToken = body.token;
      });
  });

  it('/auth/login admin (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDtoAdmin)
      .expect(201)
      .then((res) => {
        const body: BearerDto = res.body;
        expect(body.token).toBeDefined();
        httpClient.adminToken = body.token;
      });
  });

  it('/auth/profile user (GET)', () => {
    return request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${httpClient.userToken}`)
      .expect(200)
      .then((res) => {
        const body: UserReturnDto = res.body;
        expect(body.username).toBe('user');
        expect(body.userId).toBe(1);
        expect(body.roles).toStrictEqual(['user']);
      });
  });

  it('/auth/profile admin (GET)', () => {
    return request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${httpClient.adminToken}`)
      .expect(200)
      .then((res) => {
        const body: UserReturnDto = res.body;
        expect(body.username).toBe('admin');
        expect(body.userId).toBe(2);
        expect(body.roles).toStrictEqual(['user', 'admin']);
      });
  });
});
