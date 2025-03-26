import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import {
  DefaultEntity,
} from './default-entity';
import {
  Stream,
} from './stream';

@Entity({
  name: 'stream_histories',
})
export class StreamHistory extends DefaultEntity {

  @ManyToOne(() => Stream, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'stream_id',
  })
  stream: Stream;

  @Column({
    type: 'timestamptz',
    name: 'ended_at',
    nullable: true,
  })
  endedAt: Date;
}
