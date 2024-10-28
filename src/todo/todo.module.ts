import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entities';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { AuthModule } from '../sample/modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), AuthModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
