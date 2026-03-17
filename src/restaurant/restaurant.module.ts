import { Module } from '@nestjs/common';
import { RestaurantResolver } from './restaurant.resolver';
import { RestaurantService } from './restaurant.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [RestaurantResolver, RestaurantService],
})
export class RestaurantModule {}
