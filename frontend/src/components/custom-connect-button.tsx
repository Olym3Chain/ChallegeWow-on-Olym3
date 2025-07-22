import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./ui/button";

interface CustomConnectButtonProps {
  className?: string;
  onClose?: () => void; // thêm prop onClose
}

export function CustomConnectButton({
  className,
  onClose,
}: CustomConnectButtonProps) {
  return (
    <div className="flex gap-2">
      <ConnectButton.Custom>
        {({ account, openConnectModal, mounted }) => {
          return (
            <Button
              onClick={() => {
                if (onClose) onClose();
                setTimeout(() => openConnectModal?.(), 100);
              }}
              disabled={!mounted}
              className={className}
              variant="default"
            >
              {mounted && account
                ? `Connected: ${account.displayName}`
                : "Connect Wallet"}
            </Button>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}
