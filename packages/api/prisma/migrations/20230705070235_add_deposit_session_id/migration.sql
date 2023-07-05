/*
  Warnings:

  - Added the required column `sessionId` to the `Deposit` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Deposit_transactionId_idx";

-- AlterTable
ALTER TABLE "Deposit" ADD COLUMN     "sessionId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Deposit_sessionId_idx" ON "Deposit"("sessionId");
