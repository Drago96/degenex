-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Pending', 'Active');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'Pending';

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User" USING HASH ("status");
