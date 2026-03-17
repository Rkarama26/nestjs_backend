import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UserModel as User } from '../generated/prisma/models/User';
import { Role } from '../generated/prisma/enums';

@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}

  async getRestaurant(currentUser: User) {
    return this.prisma.restaurant.findMany({
      where: {
        ...(currentUser.role !== Role.ADMIN && {
          country: currentUser.country,
        }),
      },
      // include menu also
      include: {
        menu: true,
      },
    });
  }
}
