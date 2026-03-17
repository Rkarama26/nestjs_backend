import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './models/order.model';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../generated/prisma/enums';
import type { UserModel as User } from '../generated/prisma/models/User';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';

@Resolver(Order)
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  // All roles can view their own orders
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  @Query(() => [Order])
  myOrders(@CurrentUser() user: User) {
    // console.log(user);
    return this.orderService.myOrders(user);
  }

  // All roles can create an order
  @Mutation(() => Order)
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  createOrder(
    @Args('menuItemIds', { type: () => [ID] }) menuItemIds: string[],
    @Args('quantity', { type: () => Number }) quantity: number,
    @CurrentUser() user,
  ) {
    return this.orderService.createOrder(user, menuItemIds, quantity);
  }

  // Only ADMIN and MANAGER can place (checkout) an order
  @Mutation(() => Order)
  @Roles(Role.ADMIN, Role.MANAGER)
  placeOrder(
    @Args('orderId', { type: () => ID }) orderId: string,
    @CurrentUser() user: User,
  ) {
    return this.orderService.placeOrder(user, orderId);
  }

  // Only ADMIN and MANAGER can cancel an order
  @Mutation(() => Order)
  @Roles(Role.ADMIN, Role.MANAGER)
  cancelOrder(
    @Args('orderId', { type: () => ID }) orderId: string,
    @CurrentUser() user: User,
  ) {
    return this.orderService.cancelOrder(user, orderId);
  }
}
