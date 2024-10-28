import { IsNumber } from 'class-validator';
export class ReturnTodoDto {
  @IsNumber()
  id: number;
  title: string;
  description: string;
  closed: boolean;
}
