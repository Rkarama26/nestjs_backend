import { Query, Resolver } from '@nestjs/graphql';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './model/restaurant.model';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../generated/prisma/enums';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserModel as User } from '../generated/prisma/models/User';

@Resolver(() => Restaurant)
@UseGuards(JwtAuthGuard, RolesGuard)
export class RestaurantResolver {
  constructor(private restaurantService: RestaurantService) {}

  @Query(() => [Restaurant])
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  getRestaurant(@CurrentUser() user: User) {
     console.log('user', user);
    return this.restaurantService.getRestaurant(user);

  }
}
