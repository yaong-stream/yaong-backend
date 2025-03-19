import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import {
  DefaultEntity,
} from './default-entity';
import {
  Member,
} from './member';

@Entity({
  name: 'member_credentials'
})
export class MemberCredential extends DefaultEntity {

  @Column({
    type: 'varchar',
    name: 'password',
    nullable: false,
    select: false,
  })
  password: string;

  @OneToOne(() => Member, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Member;
}
