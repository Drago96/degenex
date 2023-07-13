/*
  Warnings:

  - You are about to drop the column `buyOrderId` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `sellOrderId` on the `Trade` table. All the data in the column will be lost.
  - Added the required column `type` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `makerOrderId` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `takerOrderId` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('Market', 'Limit');

-- DropForeignKey
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_buyOrderId_fkey";

-- DropForeignKey
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_sellOrderId_fkey";

-- DropIndex
DROP INDEX "Trade_buyOrderId_idx";

-- DropIndex
DROP INDEX "Trade_sellOrderId_idx";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "type" "OrderType" NOT NULL;

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "buyOrderId",
DROP COLUMN "sellOrderId",
ADD COLUMN     "makerOrderId" INTEGER NOT NULL,
ADD COLUMN     "takerOrderId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Trade_takerOrderId_idx" ON "Trade" USING HASH ("takerOrderId");

-- CreateIndex
CREATE INDEX "Trade_makerOrderId_idx" ON "Trade" USING HASH ("makerOrderId");

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_makerOrderId_fkey" FOREIGN KEY ("makerOrderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_takerOrderId_fkey" FOREIGN KEY ("takerOrderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
