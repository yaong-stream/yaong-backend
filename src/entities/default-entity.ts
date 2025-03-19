import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class DefaultEntity {

  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updated_at',
    nullable: true,
    onUpdate: 'now()',
  })
  updatedAt: Date;
}
