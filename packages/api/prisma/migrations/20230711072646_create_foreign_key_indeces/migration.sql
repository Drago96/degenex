-- DropIndex
DROP INDEX "Deposit_userId_createdAt_idx";

-- DropIndex
DROP INDEX "Order_userId_createdAt_idx";

-- CreateIndex
CREATE INDEX "Deposit_userId_createdAt_idx" ON "Deposit"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Deposit_assetTickerSymbol_idx" ON "Deposit" USING HASH ("assetTickerSymbol");

-- CreateIndex
CREATE INDEX "Order_userId_createdAt_idx" ON "Order"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Order_tradingPairId_idx" ON "Order" USING HASH ("tradingPairId");

-- CreateIndex
CREATE INDEX "Order_orderBookId_idx" ON "Order" USING HASH ("orderBookId");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken" USING HASH ("userId");
