import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TodoModule } from './todo/todo.module';
import { LoggerMiddleware } from './sample/midleware/logger.middleware';
import { AuthModule } from './sample/modules/auth/auth.module';
import { ResetModule } from './sample/modules/reset/reset.module';

@Module({
  imports: [
    AuthModule,
    TodoModule,
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
    UsersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes();
  }
}
