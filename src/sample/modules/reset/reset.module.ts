import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from '../../midleware/logger.middleware';
import { ResetController } from './reset.controller/reset.controller';
import { ResetService } from './reset.service/reset.service';

@Module({
  controllers: [ResetController],
  providers: [ResetService],
})
export class ResetModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(ResetController);
  }
}
