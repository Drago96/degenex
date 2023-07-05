/*
  Warnings:

  - A unique constraint covering the columns `[transactionId]` on the table `Deposit` will be added. If there are existing duplicate values, this will fail.
  - Made the column `transactionId` on table `Deposit` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Deposit_transactionId_idx";

-- AlterTable
ALTER TABLE "Deposit" ALTER COLUMN "transactionId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_transactionId_key" ON "Deposit"("transactionId");
