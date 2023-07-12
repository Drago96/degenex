/*
  Warnings:

  - You are about to drop the column `amount` on the `AssetBalance` table. All the data in the column will be lost.
  - Added the required column `available` to the `AssetBalance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locked` to the `AssetBalance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssetBalance" DROP COLUMN "amount",
ADD COLUMN     "available" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "locked" DECIMAL(65,30) NOT NULL;
