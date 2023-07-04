/*
  Warnings:

  - Made the column `transactionId` on table `Deposit` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Deposit" ALTER COLUMN "transactionId" SET NOT NULL;
