-- CreateEnum
CREATE TYPE "CandlestickInterval" AS ENUM ('OneHour');

-- CreateTable
CREATE TABLE "Candlestick" (
    "id" SERIAL NOT NULL,
    "openTime" TIMESTAMP(3) NOT NULL,
    "openPrice" DECIMAL(65,30) NOT NULL,
    "closePrice" DECIMAL(65,30) NOT NULL,
    "highestPrice" DECIMAL(65,30) NOT NULL,
    "lowestPrice" DECIMAL(65,30) NOT NULL,
    "baseAssetVolume" DECIMAL(65,30) NOT NULL,
    "quoteAssetVolume" DECIMAL(65,30) NOT NULL,
    "tradesCount" INTEGER NOT NULL,
    "interval" "CandlestickInterval" NOT NULL,
    "tradingPairId" INTEGER NOT NULL,

    CONSTRAINT "Candlestick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Candlestick_tradingPairId_interval_openTime_idx" ON "Candlestick"("tradingPairId", "interval", "openTime" DESC);

-- AddForeignKey
ALTER TABLE "Candlestick" ADD CONSTRAINT "Candlestick_tradingPairId_fkey" FOREIGN KEY ("tradingPairId") REFERENCES "TradingPair"("id") ON DELETE CASCADE ON UPDATE CASCADE;
