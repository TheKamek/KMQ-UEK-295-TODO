import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
export class ReturnTodoDto {
  @IsNumber()
  id: number;
  title: string;
  description: string;
  closed: boolean;
}
