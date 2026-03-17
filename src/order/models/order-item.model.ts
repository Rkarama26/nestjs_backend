import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MenuItem } from '../../restaurant/model/menu-item.model';

@ObjectType()
export class OrderItem {
  @Field()
  id!: string;

  @Field(() => Int)
  quantity!: number;

  @Field(() => MenuItem)
  menu!: MenuItem;
}
