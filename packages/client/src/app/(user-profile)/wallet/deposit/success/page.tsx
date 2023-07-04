import { MdCheck } from "react-icons/md";

import Typography from "@/components/ui/typography";
import Link from "@/components/ui/link";

export default function DepositSuccess() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-success dark:text-success-dark">
        <MdCheck size={300} />
      </div>
      <Typography className="text-center text-3xl">
        Deposit successful!
      </Typography>
      <Link variant="button" href="/wallet">
        Back to Wallet
      </Link>
    </div>
  );
}
