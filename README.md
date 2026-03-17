# Backend Challenge - NestJS GraphQL Food Ordering API

This project is a role-based food ordering backend built with NestJS, GraphQL, Prisma, and PostgreSQL.



## Tech Stack

- NestJS 11
- GraphQL (code-first with Apollo)
- Prisma 7 + PostgreSQL
- Passport JWT

## Project Structure

- `src/auth` - register/login, JWT strategy, guards, roles decorator
- `src/restaurant` - restaurant queries with country filtering
- `src/order` - order creation and status transitions with access rules
- `src/payment` - payment method queries and updates
- `src/prisma` - Prisma service (Postgres adapter)
- `prisma/schema.prisma` - data model and enums
- `prisma/seed.ts` - sample data for testing




## Authorization Rules

### Restaurant

- `getRestaurant`
  - `ADMIN`: all restaurants
  - `MANAGER` / `MEMBER`: only restaurants in their country

### Orders

- `myOrders`
  - `ADMIN`: all orders
  - `MANAGER`: all orders in their country
  - `MEMBER`: only own orders (and country scoped)

- `createOrder`
  - allowed for all roles
  - order country is automatically set from the logged-in user

- `placeOrder`, `cancelOrder`
  - allowed for `ADMIN`, `MANAGER`
  - non-admin users are restricted to orders in their own country

### Payments

- `myPaymentMethods`
  - all roles can see only their own payment methods

- `updatePaymentMethod`
  - `ADMIN` only (guard-level + service-level check)


## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DB_NAME"
JWT_SECRET="your_super_secret_key"
PORT=3000
```

## Installation & Setup

1. Install dependencies

```bash
pnpm install
```

2. Generate Prisma client

```bash
pnpm prisma generate
```

3. Run migrations

```bash
pnpm prisma migrate deploy
```

For local development (if creating new migration state):

```bash
pnpm prisma migrate dev
```

4. Seed sample data

```bash
pnpm run seed
```

5. Start development server

```bash
pnpm run start:dev
```

GraphQL Playground:

- `http://localhost:3000/graphql`

## Available Scripts

- `pnpm run start:dev` - run in watch mode
- `pnpm run build` - compile project
- `pnpm run start:prod` - run compiled build
- `pnpm run seed` - seed database
- `pnpm run test` - run unit tests
- `pnpm run test:e2e` - run e2e tests

## GraphQL API

### Auth

`register(input: RegisterInput!): AuthResponse!`

```graphql
mutation Register {
  register(
    input: {
      name: "Nick Fury"
      email: "nick@example.com"
      password: "password123"
      role: "ADMIN"
      country: "USA"
    }
  ) {
    access_token
  }
}
```

`login(input: LoginInput!): AuthResponse!`

```graphql
mutation Login {
  login(input: { email: "nick@example.com", password: "password123" }) {
    access_token
  }
}
```

Use `Authorization: Bearer <token>` for protected queries/mutations.

### Restaurants

```graphql
query GetRestaurant {
  getRestaurant {
    id
    name
    menu {
      id
      name
      price
    }
  }
}
```

## Seed Credentials

Password for all seeded users: `password123`

Sample seeded users:

- `nick@shield.com` (`ADMIN`, `USA`)
- `marvel@shield.com` (`MANAGER`, `INDIA`)
- `america@shield.com` (`MANAGER`, `USA`)
- `thor@shield.com` (`MEMBER`, `INDIA`)
- `travis@shield.com` (`MEMBER`, `USA`)

## Notes

- GraphQL schema is auto-generated to `schema.gql`.
- Input validation is enabled globally using `ValidationPipe`.

