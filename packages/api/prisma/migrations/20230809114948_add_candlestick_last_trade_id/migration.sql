/*
  Warnings:

  - Added the required column `lastTradeId` to the `Candlestick` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Candlestick" ADD COLUMN     "lastTradeId" INTEGER NOT NULL;
