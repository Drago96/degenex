/*
  Warnings:

  - You are about to drop the column `ticker` on the `Asset` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tickerSymbol]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tickerSymbol` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Asset_ticker_fullName_idx";

-- DropIndex
DROP INDEX "Asset_ticker_key";

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "ticker",
ADD COLUMN     "tickerSymbol" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Asset_tickerSymbol_key" ON "Asset"("tickerSymbol");

-- CreateIndex
CREATE INDEX "Asset_tickerSymbol_fullName_idx" ON "Asset"("tickerSymbol", "fullName");
