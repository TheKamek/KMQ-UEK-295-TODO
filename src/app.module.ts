import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerMiddleware } from './sample/midleware/logger.middleware';
import { ArticleModule } from './sample/modules/article/article.module';
import { AuthModule } from './sample/modules/auth/auth.module';
import { RootModule } from './sample/modules/root/root.module';
import { ResetModule } from './sample/modules/reset/reset.module';

@Module({
  imports: [
    ArticleModule,
    AuthModule,
    RootModule,
    ResetModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'better-sqlite3',
        database: process.env.DATABASE_NAME || 'database/api.db',
        dropSchema: true,
        entities: [],
        autoLoadEntities: true,
        logging: process.env.DATABASE_LOG?.toLowerCase() === 'true' || false,
        // todo: achtung nicht benutzen in der Produktion
        synchronize: true,
      }),
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes();
  }
}
