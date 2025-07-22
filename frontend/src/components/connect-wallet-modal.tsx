import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomConnectButton } from "./custom-connect-button";

export default function ConnectWalletModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={open}>
      <DialogContent className="bg-cyber-dark border-neon-blue flex flex-col items-center justify-center">
        <DialogHeader>
          <DialogTitle className="text-neon-purple text-center">
            Wallet Not Connected
          </DialogTitle>
          <DialogDescription>
            Please connect your wallet to create or join a room.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          {/* <ConnectButtonWithPetra /> */}
          <CustomConnectButton onClose={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
