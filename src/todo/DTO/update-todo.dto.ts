import { IsString } from 'class-validator';
export class UpdateTodoDto {
  @IsString()
  description?: string;
  @IsString()
  title?: string;
  closed?: boolean;
}
