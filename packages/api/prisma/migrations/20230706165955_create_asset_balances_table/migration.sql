-- CreateTable
CREATE TABLE "AssetBalance" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "userId" INTEGER NOT NULL,
    "assetTickerSymbol" TEXT NOT NULL,

    CONSTRAINT "AssetBalance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssetBalance_userId_assetTickerSymbol_key" ON "AssetBalance"("userId", "assetTickerSymbol");

-- AddForeignKey
ALTER TABLE "AssetBalance" ADD CONSTRAINT "AssetBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetBalance" ADD CONSTRAINT "AssetBalance_assetTickerSymbol_fkey" FOREIGN KEY ("assetTickerSymbol") REFERENCES "Asset"("tickerSymbol") ON DELETE RESTRICT ON UPDATE CASCADE;
