import Modal from "@/components/ui/modal";
import DepositForm from "@/components/wallet/deposit-form";

export default function DepositModal() {
  return (
    <Modal>
      <DepositForm variant="modal" />
    </Modal>
  );
}
