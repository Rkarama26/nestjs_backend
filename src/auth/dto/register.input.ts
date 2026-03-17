import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class RegisterInput {
  @IsNotEmpty()
  @Field()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  @Field()
  email!: string;

  @IsNotEmpty()
  @Field()
  password!: string;

  @IsNotEmpty()
  @Field()
  role!: string; // 'ADMIN' | 'MANAGER' | 'MEMBER'

  @IsNotEmpty()
  @Field()
  country!: string; // 'INDIA' | 'USA'
}
