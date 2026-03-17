/*
  Warnings:

  - Added the required column `country` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "country" "Country" NOT NULL;

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "country" "Country" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "country" "Country" NOT NULL;
