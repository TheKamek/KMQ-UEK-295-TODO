import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RootController } from './root.controller/root.controller';
import { RootService } from './root.service/root.service';
import { LoggerMiddleware } from '../../midleware/logger.middleware';

@Module({
  controllers: [RootController],
  providers: [RootService],
})
export class RootModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(RootController);
  }
}
