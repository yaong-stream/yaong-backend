import {
  Column,
  Entity,
  Index,
} from 'typeorm';
import {
  DefaultEntity,
} from './default-entity';

@Entity({
  name: 'members',
})
export class Member extends DefaultEntity {

  @Index()
  @Column({
    type: 'varchar',
    name: 'email',
    nullable: false,
    length: 320,
    unique: true,
  })
  email: string;

  @Column({
    type: 'boolean',
    name: 'email_verified',
    nullable: false,
    default: false,
  })
  isEmailVerified: boolean;

  @Column({
    type: 'varchar',
    name: 'nickname',
    nullable: false,
    length: 32,
  })
  nickname: string;
}
