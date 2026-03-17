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

Base URL (GraphQL endpoint):

- `http://localhost:3000/graphql`

Auth header for protected operations:

- `Authorization: Bearer <access_token>`

### Types

#### AuthResponse

- `access_token: String!`

#### Restaurant

- `id: ID!`
- `name: String!`
- `menu: [MenuItem!]!`

#### MenuItem

- `id: ID!`
- `name: String!`
- `price: Float!`

#### Order

- `id: ID!`
- `country: String!` (enum value stored as string: `INDIA`, `USA`)
- `status: String!` (`CREATED`, `PLACED`, `CANCELLED`)
- `items: [OrderItem!]!`

#### OrderItem

- `id: String!`
- `quantity: Int!`
- `menu: MenuItem!`

#### PaymentMethod

- `id: ID!`
- `type: String!`
- `details: String!`
- `userId: String!`

### Inputs

#### RegisterInput

- `name: String!`
- `email: String!`
- `password: String!`
- `role: String!` (use one of: `ADMIN`, `MANAGER`, `MEMBER`)
- `country: String!` (use one of: `INDIA`, `USA`)

#### LoginInput

- `email: String!`
- `password: String!`

#### UpdatePaymentInput

- `paymentMethodId: ID!`
- `type: String!`
- `details: String!`

### Queries

#### `getRestaurant: [Restaurant!]!`

- Access: `ADMIN`, `MANAGER`, `MEMBER`
- Behavior:
  - `ADMIN` sees all restaurants
  - `MANAGER` / `MEMBER` see only restaurants in their own country

Example:

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

#### `myOrders: [Order!]!`

- Access: `ADMIN`, `MANAGER`, `MEMBER`
- Behavior:
  - `ADMIN` sees all orders
  - `MANAGER` sees all orders in own country
  - `MEMBER` sees only own orders (country-scoped)

Example:

```graphql
query MyOrders {
  myOrders {
    id
    country
    status
    items {
      id
      quantity
      menu {
        id
        name
        price
      }
    }
  }
}
```

#### `myPaymentMethods: [PaymentMethod!]!`

- Access: `ADMIN`, `MANAGER`, `MEMBER`
- Behavior: returns only payment methods owned by the authenticated user

Example:

```graphql
query MyPaymentMethods {
  myPaymentMethods {
    id
    type
    details
    userId
  }
}
```

### Mutations

#### `register(input: RegisterInput!): AuthResponse!`

- Public endpoint (no token required)
- Returns JWT access token
- Common error: email already exists

Example:

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

#### `login(input: LoginInput!): AuthResponse!`

- Public endpoint (no token required)
- Returns JWT access token
- Common error: invalid credentials

Example:

```graphql
mutation Login {
  login(input: { email: "nick@example.com", password: "password123" }) {
    access_token
  }
}
```

#### `createOrder(menuItemIds: [ID!]!, quantity: Float!): Order!`

- Access: `ADMIN`, `MANAGER`, `MEMBER`
- Behavior:
  - Creates an order for the current user
  - Order country is auto-assigned from user country
  - Initial status is `CREATED`
  - Creates one order item per provided menu item id using the same quantity
- Note: schema exposes `quantity` as `Float`, but order items store quantity as integer; send whole numbers

Example:

```graphql
mutation CreateOrder {
  createOrder(menuItemIds: ["menu-item-id-1", "menu-item-id-2"], quantity: 2) {
    id
    country
    status
    items {
      id
      quantity
      menu {
        id
        name
      }
    }
  }
}
```

#### `placeOrder(orderId: ID!): Order!`

- Access: `ADMIN`, `MANAGER`
- Behavior:
  - Changes order status to `PLACED`
  - `MANAGER` can only place orders from own country
- Common errors:
  - order not found
  - trying to access order from another country
  - order already placed / cancelled

Example:

```graphql
mutation PlaceOrder {
  placeOrder(orderId: "order-id") {
    id
    status
  }
}
```

#### `cancelOrder(orderId: ID!): Order!`

- Access: `ADMIN`, `MANAGER`
- Behavior:
  - Changes order status to `CANCELLED`
  - `MANAGER` can only cancel orders from own country
- Common errors:
  - order not found
  - trying to access order from another country
  - order already cancelled

Example:

```graphql
mutation CancelOrder {
  cancelOrder(orderId: "order-id") {
    id
    status
  }
}
```

#### `updatePaymentMethod(input: UpdatePaymentInput!): PaymentMethod!`

- Access: `ADMIN` only
- Behavior: updates payment method `type` and `details` by id
- Common errors:
  - payment method not found
  - non-admin user access denied

Example:

```graphql
mutation UpdatePaymentMethod {
  updatePaymentMethod(
    input: {
      paymentMethodId: "payment-id"
      type: "CARD"
      details: "**** **** **** 4242"
    }
  ) {
    id
    type
    details
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
