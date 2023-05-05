import { Controller, Query, Sse, MessageEvent } from '@nestjs/common';
import { interval, map, Observable, withLatestFrom } from 'rxjs';

import { AssetPricesStreamService } from './asset-prices-stream.service';

@Controller('assets')
export class AssetsController {
  constructor(private assetPricesStreamService: AssetPricesStreamService) {}

  @Sse('track-prices')
  trackPrices(
    @Query('tradingPairSymbols') tradingPairSymbols: string[],
  ): Observable<MessageEvent> {
    return interval(1000).pipe(
      withLatestFrom(
        this.assetPricesStreamService.getPricesForTradingSymbols$(
          tradingPairSymbols,
        ),
      ),
      map(([_, assetPrices]) => ({ data: assetPrices })),
    );
  }
}
