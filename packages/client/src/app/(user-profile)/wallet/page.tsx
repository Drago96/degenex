import Link from "@/components/ui/link";
import Typography from "@/components/ui/typography";

export default function Wallet() {
  return (
    <div className="flex flex-col gap-5 lg:gap-20">
      <div className="flex flex-col gap-5">
        <Typography variant="h2" className="text-3xl font-bold lg:text-5xl">
          Wallet
        </Typography>
        <div className="flex flex-row gap-5">
          <Link variant="button" href="/wallet/deposit">
            Deposit
          </Link>
        </div>
      </div>
    </div>
  );
}
