import Decimal from "decimal.js";
import classNames from "classnames";

import Typography from "../ui/typography";

type PriceChangeBadgeProps = {
  currentPrice: Decimal;
  priceChange: Decimal;
};

export default function PriceChangeBadge({
  currentPrice,
  priceChange,
}: PriceChangeBadgeProps) {
  const priceChangePercentage = priceChange
    .div(currentPrice)
    .times(new Decimal(100));
  const priceChangeSign = priceChangePercentage.gte(new Decimal(0)) ? "+" : "-";

  return (
    <div
      className={classNames(
        "flex h-8 w-[100px] items-center justify-center rounded-lg",
        {
          "bg-success": priceChange.gt(0),
          "bg-error": priceChange.lt(0),
          "bg-muted-contrastText": priceChange.eq(0),
        },
      )}
    >
      <Typography
        variant="span"
        className="margin-auto text-primary-contrastText-dark"
      >
        {priceChangeSign}
        {priceChangePercentage.abs().toFixed(2)}%
      </Typography>
    </div>
  );
}
