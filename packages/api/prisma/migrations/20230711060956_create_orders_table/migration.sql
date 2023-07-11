/*
  Warnings:

  - You are about to drop the column `baseAssetId` on the `TradingPair` table. All the data in the column will be lost.
  - You are about to drop the column `quoteAssetId` on the `TradingPair` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[baseAssetTickerSymbol,quoteAssetTickerSymbol]` on the table `TradingPair` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `baseAssetTickerSymbol` to the `TradingPair` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quoteAssetTickerSymbol` to the `TradingPair` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderSide" AS ENUM ('Buy', 'Sell');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Pending', 'Canceled', 'PartiallyFilled', 'Filled');

-- DropForeignKey
ALTER TABLE "TradingPair" DROP CONSTRAINT "TradingPair_baseAssetId_fkey";

-- DropForeignKey
ALTER TABLE "TradingPair" DROP CONSTRAINT "TradingPair_quoteAssetId_fkey";

-- DropIndex
DROP INDEX "TradingPair_baseAssetId_quoteAssetId_key";

-- AlterTable
ALTER TABLE "TradingPair" DROP COLUMN "baseAssetId",
DROP COLUMN "quoteAssetId",
ADD COLUMN     "baseAssetTickerSymbol" TEXT NOT NULL,
ADD COLUMN     "quoteAssetTickerSymbol" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL DEFAULT uuid7(),
    "side" "OrderSide" NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "userId" INTEGER NOT NULL,
    "tradingPairId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Order_userId_createdAt_idx" ON "Order"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "TradingPair_baseAssetTickerSymbol_quoteAssetTickerSymbol_key" ON "TradingPair"("baseAssetTickerSymbol", "quoteAssetTickerSymbol");

-- AddForeignKey
ALTER TABLE "TradingPair" ADD CONSTRAINT "TradingPair_baseAssetTickerSymbol_fkey" FOREIGN KEY ("baseAssetTickerSymbol") REFERENCES "Asset"("tickerSymbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradingPair" ADD CONSTRAINT "TradingPair_quoteAssetTickerSymbol_fkey" FOREIGN KEY ("quoteAssetTickerSymbol") REFERENCES "Asset"("tickerSymbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_tradingPairId_fkey" FOREIGN KEY ("tradingPairId") REFERENCES "TradingPair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
