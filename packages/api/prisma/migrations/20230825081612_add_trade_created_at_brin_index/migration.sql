-- DropIndex
DROP INDEX "Trade_createdAt_idx";

-- CreateIndex
CREATE INDEX "Trade_createdAt_idx" ON "Trade" USING BRIN ("createdAt" timestamp_bloom_ops);
