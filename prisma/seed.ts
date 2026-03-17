import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client';
import { Role, Country, OrderStatus } from '../src/generated/prisma/enums';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const hashed = await bcrypt.hash('password123', 10);

  // USERS
  const admin = await prisma.user.create({
    data: {
      name: 'Nick Fury',
      email: 'nick@shield.com',
      password: hashed,
      role: Role.ADMIN,
      country: Country.USA, // Admin — country doesn't restrict him but field is required
    },
  });

  const managerIndia = await prisma.user.create({
    data: {
      name: 'Captain Marvel',
      email: 'marvel@shield.com',
      password: hashed,
      role: Role.MANAGER,
      country: Country.INDIA,
    },
  });

  const managerUSA = await prisma.user.create({
    data: {
      name: 'Captain America',
      email: 'america@shield.com',
      password: hashed,
      role: Role.MANAGER,
      country: Country.USA,
    },
  });

  const thor = await prisma.user.create({
    data: {
      name: 'Thor',
      email: 'thor@shield.com',
      password: hashed,
      role: Role.MEMBER,
      country: Country.INDIA,
    },
  });

  const thanos = await prisma.user.create({
    data: {
      name: 'Thanos',
      email: 'thanos@shield.com',
      password: hashed,
      role: Role.MEMBER,
      country: Country.INDIA,
    },
  });

  const travis = await prisma.user.create({
    data: {
      name: 'Travis',
      email: 'travis@shield.com',
      password: hashed,
      role: Role.MEMBER,
      country: Country.USA,
    },
  });

  // RESTAURANTS
  const restaurant1 = await prisma.restaurant.create({
    data: {
      name: 'Avengers Diner',
      country: Country.INDIA,
    },
  });

  const restaurant2 = await prisma.restaurant.create({
    data: {
      name: 'Shield Cafe',
      country: Country.USA,
    },
  });

  // MENU ITEMS
  const burger = await prisma.menuItem.create({
    data: {
      name: 'Burger',
      price: 10,
      restaurantId: restaurant1.id,
    },
  });

  const pizza = await prisma.menuItem.create({
    data: {
      name: 'Pizza',
      price: 15,
      restaurantId: restaurant1.id,
    },
  });

  const pasta = await prisma.menuItem.create({
    data: {
      name: 'Pasta',
      price: 12,
      restaurantId: restaurant2.id,
    },
  });

  const steak = await prisma.menuItem.create({
    data: {
      name: 'Steak',
      price: 25,
      restaurantId: restaurant2.id,
    },
  });

  // PAYMENT METHODS
  await prisma.paymentMethod.create({
    data: {
      userId: thor.id,
      type: 'CARD',
      details: '**** **** **** 4242',
    },
  });

  await prisma.paymentMethod.create({
    data: {
      userId: travis.id,
      type: 'CARD',
      details: '**** **** **** 1234',
    },
  });

  // ORDERS
  const order1 = await prisma.order.create({
    data: {
      userId: thor.id,
      country: Country.INDIA,
      status: OrderStatus.PLACED,
    },
  });

  await prisma.orderItem.createMany({
    data: [
      { orderId: order1.id, menuId: burger.id, quantity: 2 },
      { orderId: order1.id, menuId: pizza.id, quantity: 1 },
    ],
  });

  const order2 = await prisma.order.create({
    data: {
      userId: travis.id,
      country: Country.USA,
      status: OrderStatus.CREATED,
    },
  });

  await prisma.orderItem.createMany({
    data: [
      { orderId: order2.id, menuId: pasta.id, quantity: 1 },
      { orderId: order2.id, menuId: steak.id, quantity: 2 },
    ],
  });

  console.log('✅ Seed data inserted successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
