import Paper from "@/components/ui/paper";
import DepositForm from "@/components/wallet/deposit-form";

export default function DepositPage() {
  return (
    <div className="flex justify-center">
      <Paper>
        <DepositForm />
      </Paper>
    </div>
  );
}
