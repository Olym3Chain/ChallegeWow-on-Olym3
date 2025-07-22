"use client";

import { WalletListener } from "@/lib/wallet-listener";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

interface CustomRainbowKitProviderProps {
  children: React.ReactNode;
}

export function CustomRainbowKitProvider({
  children,
}: CustomRainbowKitProviderProps) {
  return <RainbowKitProvider>{children}</RainbowKitProvider>;
}
