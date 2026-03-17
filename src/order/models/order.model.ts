import { Field, ID, ObjectType } from '@nestjs/graphql';
import { OrderItem } from './order-item.model';

@ObjectType()
export class Order {
  @Field(() => ID)
  id!: string;

  @Field(() => String) 
  country!: string;

  @Field()
  status!: string;

  @Field(() => [OrderItem])
  items!: OrderItem[];
}
