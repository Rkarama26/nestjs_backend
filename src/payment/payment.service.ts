import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePaymentInput } from './dto/update-payment.input';
import { UserModel as User } from '../generated/prisma/models/User';
import { Role } from '../generated/prisma/enums';

@Injectable()
export class PaymentService {
  constructor(private prismaService: PrismaService) {}

  async myPaymentMethods(userId: string) {
    return this.prismaService.paymentMethod.findMany({
      where: { userId },
    });
  }

  // Only ADMIN can update — double check here as well as in guard
  async updatePaymentMethod(currentUser: User, input: UpdatePaymentInput) {
    const paymentMethod = await this.prismaService.paymentMethod.findUnique({
      where: { id: input.paymentMethodId },
    });

    if (!paymentMethod) throw new NotFoundException('Payment method not found');

    // Extra safety check beyond the guard
    if (currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Only Admin can update payment methods');
    }

    return this.prismaService.paymentMethod.update({
      where: { id: input.paymentMethodId },
      data: {
        type: input.type,
        details: input.details,
      },
    });
  }
}