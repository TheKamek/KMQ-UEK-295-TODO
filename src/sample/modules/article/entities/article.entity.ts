import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity({
  name: 'article',
})
export class ArticleEntity {
  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: 'pk-article',
  })
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;
}
