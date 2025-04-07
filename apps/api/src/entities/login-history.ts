import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {
  DefaultEntity,
} from './default-entity';
import {
  Member,
} from './member';

@Entity({
  name: 'login_histories'
})
export class LoginHistory extends DefaultEntity {
  @Column({
    type: 'varchar',
    name: 'device_id',
    nullable: false,
    length: 36,
    unique: true,
  })
  deviceId: string;

  @Column({
    type: 'varchar',
    name: 'refresh_token',
    nullable: false,
    length: 500,
  })
  refreshToken: string;

  @Column({
    type: 'varchar',
    name: 'ip_address',
    nullable: false,
    length: 45,
  })
  ipAddress: string;

  @Column({
    type: 'varchar',
    name: 'user_agent',
    nullable: false,
    length: 500,
  })
  userAgent: string;

  @Column({
    type: 'varchar',
    name: 'device_type',
    nullable: false,
    length: 20,
  })
  deviceType: string;

  @Column({
    type: 'varchar',
    name: 'browser_name',
    nullable: false,
    length: 50,
  })
  browserName: string;

  @Column({
    type: 'varchar',
    name: 'browser_version',
    nullable: false,
    length: 20,
  })
  browserVersion: string;

  @ManyToOne(() => Member, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Member;
}
