import { Field, ID, ObjectType } from '@nestjs/graphql';
import { MenuItem } from './menu-item.model';

@ObjectType()
export class Restaurant {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => [MenuItem])
  menu!: MenuItem[];
}
