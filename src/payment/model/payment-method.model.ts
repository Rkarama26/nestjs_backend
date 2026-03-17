import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaymentMethod {
  @Field(() => ID)
  id!: string;

  @Field()
  type!: string;

  @Field()
  details!: string;

  @Field()
  userId!: string;
}