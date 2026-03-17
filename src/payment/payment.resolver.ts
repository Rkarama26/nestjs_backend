import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaymentMethod } from './model/payment-method.model';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { PaymentService } from './payment.service';
import { Role } from '../generated/prisma/enums';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { UserModel as User } from '../generated/prisma/models/User';
import { UpdatePaymentInput } from './dto/update-payment.input';

@Resolver(PaymentMethod)
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentResolver {
  constructor(private paymentService: PaymentService) {}

  // All roles can view their own payment methods
  @Query(() => [PaymentMethod])
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  myPaymentMethods(@CurrentUser() user: User) {
    console.log(user)
    return this.paymentService.myPaymentMethods(user.id);
  }

  // ADMIN only can update payment method
  @Mutation(() => PaymentMethod)
  @Roles(Role.ADMIN)
  updatePaymentMethod(
    @Args('input', { type: () => UpdatePaymentInput })
    input: UpdatePaymentInput,
    @CurrentUser() user: User,
  ) {
    return this.paymentService.updatePaymentMethod(user, input);
  }
}
