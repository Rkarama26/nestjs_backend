import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  @Field()
  name!: string;
  @Field()
  email!: string;
  @Field()
  password!: string;
  @Field()
  role!: string; // 'ADMIN' | 'MANAGER' | 'MEMBER'
  @Field()
  country!: string; // 'INDIA' | 'USA'
}
