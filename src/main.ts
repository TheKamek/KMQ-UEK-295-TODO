import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as os from 'os';
import * as pk from 'pkginfo';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// read package.json and add it to the module.exports
pk(module);

const serverProtocol = process.env.SERVER_PROTOCOL || 'http';
const httpInterface = process.env.SERVER_LISTEN_ON || '0.0.0.0';
const accessServer = process.env.URI_SERVER || os.hostname();
const port = process.env.SERVER_PORT || 3000;

const apiName = process.env.API_NAME || 'api';

const name = module.exports.name;
const version = module.exports.version;
const description = module.exports.description;
const authorInfo = module.exports.author.split('|');
const licenseInfo = module.exports.license.split('|');

async function bootstrap() {
  const logger = new Logger('bootstrap');

  // enable CORS
  const app = await NestFactory.create(AppModule, { cors: true });

  // hint: Hier kommt die openApi Konfiguration hin
  const config = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .setContact(authorInfo[0], authorInfo[1], authorInfo[2])
    .setLicense(licenseInfo[0], licenseInfo[1])
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port, httpInterface);

  logger.debug(`Der Server ist jetzt erreichbar unter: ${serverProtocol}://${accessServer}:${port}`);
  logger.debug(
    `Die Api Dokumentation in der Version ${version} ist erreichbar unter: ${serverProtocol}://${accessServer}:${port}/${apiName}`,
  );
}
bootstrap().finally();
