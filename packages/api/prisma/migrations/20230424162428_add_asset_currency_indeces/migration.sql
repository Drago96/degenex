-- CreateIndex
CREATE INDEX "Asset_type_idx" ON "Asset" USING HASH ("type");

-- CreateIndex
CREATE INDEX "Asset_ticker_fullName_idx" ON "Asset"("ticker", "fullName");

-- CreateIndex
CREATE INDEX "Currency_code_fullName_idx" ON "Currency"("code", "fullName");
