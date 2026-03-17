import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UserModel as User } from '../generated/prisma/models/User';
import { OrderStatus, Role } from '../generated/prisma/enums';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async myOrders(currentUser: User) {
    return this.prismaService.order.findMany({
      where: {
        ...(currentUser.role !== Role.ADMIN && {
          country: currentUser.country, // country scoping
        }),
        // Members only see their own orders, Manager/Admin see all in country
        ...(currentUser.role === Role.MEMBER && {
          userId: currentUser.id,
        }),
      },
      include: {
        items: {
          include: {
            menu: true,
          },
        },
      },
    });
  }

  // Create order — all roles allowed, order gets user's country
  async createOrder(
    currentUser: User,
    menuItemIds: string[],
    quantity: number,
  ) {
    return this.prismaService.order.create({
      data: {
        userId: currentUser.id,
        country: currentUser.country, // assign country from user
        status: OrderStatus.CREATED,
        items: {
          create: menuItemIds.map((menuId) => ({
            menuId,
            quantity,
          })),
        },
      },
      include: {
        items: {
          include: { menu: true },
        },
      },
    });
  }

  // Place order — ADMIN/MANAGER only, must be same country
  async placeOrder(currentUser: User, orderId: string) {
    const order = await this.prismaService.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new NotFoundException('Order not found');

    // Country check
    if (
      currentUser.role !== Role.ADMIN &&
      order.country !== currentUser.country
    ) {
      throw new ForbiddenException(
        'You cannot access orders from another country',
      );
    }

    if (
      order.status !== OrderStatus.CREATED &&
      order.status === OrderStatus.CANCELLED
    ) {
      throw new ForbiddenException(
        'This order has been cancelled and cannot be placed',
      );
    }

    if (
      order.status !== OrderStatus.CREATED &&
      order.status === OrderStatus.PLACED
    ) {
      throw new ForbiddenException('This order is already placed');
    }

    return this.prismaService.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.PLACED },
      include: { items: { include: { menu: true } } },
    });
  }

  // Cancel order — ADMIN/MANAGER only, must be same country
  async cancelOrder(currentUser: User, orderId: string) {
    const order = await this.prismaService.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (
      currentUser.role !== Role.ADMIN &&
      order.country !== currentUser.country
    ) {
      throw new ForbiddenException(
        'You cannot access orders from another country',
      );
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new ForbiddenException('Order is already cancelled');
    }

    return this.prismaService.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
      include: { items: { include: { menu: true } } },
    });
  }
}
