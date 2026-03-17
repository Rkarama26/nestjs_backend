import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdatePaymentInput {
  @Field(() => ID)
  paymentMethodId!: string;

  @Field()
  type!: string;

  @Field()
  details!: string;
}
