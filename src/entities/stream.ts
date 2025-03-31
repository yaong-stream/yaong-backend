import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  Unique,
} from 'typeorm';
import {
  DefaultEntity,
} from './default-entity';
import {
  Member,
} from './member';
import {
  Category,
} from './category';
import {
  StreamHistory,
} from './stream-history';

@Unique([
  'streamer',
])
@Entity({
  name: 'streams',
})
export class Stream extends DefaultEntity {

  @Column({
    type: 'varchar',
    name: 'name',
    nullable: false,
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    name: 'description',
    nullable: false,
    length: 255,
  })
  description: string;

  @Column({
    type: 'text',
    name: 'thumbnail_image',
    nullable: false,
    default: '',
  })
  thumbnailImage: string;

  @Column({
    type: 'char',
    name: 'stream_key',
    nullable: false,
    length: 32,
  })
  streamKey: string;

  @OneToOne(() => Member, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'member_id',
  })
  streamer: Member;

  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({
    name: 'category_id',
  })
  category: Category;

  @OneToMany(() => StreamHistory, (history) => history.stream)
  histories: StreamHistory[];
}
