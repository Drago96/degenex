/*
  Warnings:

  - A unique constraint covering the columns `[symbol]` on the table `Currency` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `symbol` to the `Currency` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Currency" ADD COLUMN     "symbol" CHAR(1) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Currency_symbol_key" ON "Currency"("symbol");
