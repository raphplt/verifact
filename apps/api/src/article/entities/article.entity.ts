import { Keyword } from 'src/keyword/entities/keyword.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  resume: string;

  @Column()
  siteName: string;

  @Column()
  credibilityScore: number;

  @Column()
  url: string;

  @Column({
    nullable: true,
  })
  imageUrl: string;

  @ManyToMany(() => Keyword, (keyword) => keyword.articles, { cascade: true })
  @JoinTable()
  keywords?: Keyword[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
