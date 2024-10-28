import { IsNotEmpty, IsString } from 'class-validator';
export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsString()
  title: string;
}
