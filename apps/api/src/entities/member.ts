import {
  Column,
  Entity,
  Index,
  OneToOne,
} from 'typeorm';
import {
  DefaultEntity,
} from './default-entity';
import {
  MemberCredential,
} from './member-credential';

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
    unique: true,
    length: 32,
  })
  nickname: string;

  @Column({
    type: 'text',
    name: 'profile_image',
    nullable: false,
    default: '',
  })
  profileImage: string;

  @OneToOne(() => MemberCredential, (credential) => credential.member)
  credential: MemberCredential;
}
