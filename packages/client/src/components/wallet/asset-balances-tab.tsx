import { PendingFetch } from "@/types/pending-fetch";
import { AssetBalanceResponseDto } from "@degenex/common";
import Typography from "../ui/typography";

type AssetBalancesTabProps = PendingFetch<{
  assetBalances: AssetBalanceResponseDto[];
}>;

export default function AssetBalancesTab(props: AssetBalancesTabProps) {
  if (props.loading) {
    return <Typography>Loading...</Typography>;
  }

  return <Typography>{JSON.stringify(props.assetBalances)}</Typography>;
}
