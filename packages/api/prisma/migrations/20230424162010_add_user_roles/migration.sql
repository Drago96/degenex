-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roles" "UserRole"[];

-- CreateIndex
CREATE INDEX "User_roles_idx" ON "User" USING GIN ("roles" array_ops);
