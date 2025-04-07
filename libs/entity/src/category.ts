import {
  Column,
  Entity,
} from 'typeorm';
import {
  DefaultEntity,
} from './default-entity';

@Entity({
  name: 'categories',
})
export class Category extends DefaultEntity {

  @Column({
    type: 'varchar',
    name: 'name',
    nullable: false,
    length: 50,
  })
  name: string;

  @Column({
    type: 'text',
    name: 'thumbnail_image',
    nullable: false,
    default: '',
  })
  thumbnailImage: string;
}
