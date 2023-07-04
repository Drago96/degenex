/*
  Warnings:

  - You are about to drop the column `checkoutSessionId` on the `Deposit` table. All the data in the column will be lost.
  - You are about to drop the column `currencyCode` on the `Deposit` table. All the data in the column will be lost.
  - You are about to drop the column `assetId` on the `TradingPair` table. All the data in the column will be lost.
  - You are about to drop the column `currencyId` on the `TradingPair` table. All the data in the column will be lost.
  - You are about to drop the `Currency` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[currencySymbol]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[baseAssetId,quoteAssetId]` on the table `TradingPair` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assetTickerSymbol` to the `Deposit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseAssetId` to the `TradingPair` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quoteAssetId` to the `TradingPair` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "AssetType" ADD VALUE 'FiatMoney';

-- DropForeignKey
ALTER TABLE "Deposit" DROP CONSTRAINT "Deposit_currencyCode_fkey";

-- DropForeignKey
ALTER TABLE "TradingPair" DROP CONSTRAINT "TradingPair_assetId_fkey";

-- DropForeignKey
ALTER TABLE "TradingPair" DROP CONSTRAINT "TradingPair_currencyId_fkey";

-- DropIndex
DROP INDEX "TradingPair_assetId_currencyId_key";

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "currencySymbol" CHAR(1);

-- AlterTable
ALTER TABLE "Deposit" DROP COLUMN "checkoutSessionId",
DROP COLUMN "currencyCode",
ADD COLUMN     "assetTickerSymbol" TEXT NOT NULL,
ADD COLUMN     "transactionId" TEXT;

-- AlterTable
ALTER TABLE "TradingPair" DROP COLUMN "assetId",
DROP COLUMN "currencyId",
ADD COLUMN     "baseAssetId" INTEGER NOT NULL,
ADD COLUMN     "quoteAssetId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Currency";

-- CreateIndex
CREATE UNIQUE INDEX "Asset_currencySymbol_key" ON "Asset"("currencySymbol");

-- CreateIndex
CREATE INDEX "Deposit_userId_createdAt_idx" ON "Deposit"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "TradingPair_baseAssetId_quoteAssetId_key" ON "TradingPair"("baseAssetId", "quoteAssetId");

-- AddForeignKey
ALTER TABLE "TradingPair" ADD CONSTRAINT "TradingPair_baseAssetId_fkey" FOREIGN KEY ("baseAssetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradingPair" ADD CONSTRAINT "TradingPair_quoteAssetId_fkey" FOREIGN KEY ("quoteAssetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_assetTickerSymbol_fkey" FOREIGN KEY ("assetTickerSymbol") REFERENCES "Asset"("tickerSymbol") ON DELETE RESTRICT ON UPDATE CASCADE;
