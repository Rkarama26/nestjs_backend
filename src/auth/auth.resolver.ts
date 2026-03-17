import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth-response.type';
import  { RegisterInput } from './dto/register.input';
import  { LoginInput } from './dto/login.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(
    @Args('input', { type: () => RegisterInput }) input: RegisterInput,
  ): Promise<AuthResponse> {
    return this.authService.register(
      input.name,
      input.email,
      input.password,
      input.role,
      input.country,
    );
  }

  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
    return this.authService.login(input.email, input.password);
  }
}
