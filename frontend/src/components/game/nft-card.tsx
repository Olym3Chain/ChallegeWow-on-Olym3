import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Copy, Check, ExternalLink } from "lucide-react";
import { useNftMetadata } from "@/hooks/use-nft-metadata"; // <-- dùng hook bạn đã có
import type { NftReward } from "@/types/schema";

const shortHex = (val: string, chars = 4) => {
  if (!val) return "";
  if (val.length <= chars * 2 + 2) return val;
  return `${val.slice(0, chars + 2)}…${val.slice(-chars)}`; // giữ "0x" + đầu + cuối
};

//
// Reusable info row (label + value + copy + optional external link)
//
interface InfoRowProps {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
  isLink?: boolean;
  display?: string; // if provided, show this instead of value
}
const InfoRow = ({
  label,
  value,
  display,
  onCopy,
  copied,
  isLink = false,
}: InfoRowProps) => (
  <div className="flex flex-col gap-1">
    <span className="uppercase tracking-wide text-gray-400 text-xs">
      {label}
    </span>
    <div className="flex items-center gap-2">
      {isLink ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate max-w-[220px] text-emerald-300 underline decoration-dotted hover:text-emerald-200"
          title={value}
        >
          {display ?? value}
        </a>
      ) : (
        <code className="font-mono text-emerald-300 break-all">
          {display ?? value}
        </code>
      )}
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 p-0"
        onClick={onCopy}
      >
        {copied ? (
          <Check className="w-3 h-3 text-emerald-300" />
        ) : (
          <Copy className="w-3 h-3" />
        )}
      </Button>
      {isLink && (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center h-6 w-6 rounded-md border border-emerald-400/40 hover:bg-emerald-400/10 transition"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  </div>
);

//
// NFTRewardCard
//
interface NFTRewardCardProps {
  nft: NftReward;
  className?: string;
}

export const NFTRewardCard = ({ nft, className }: NFTRewardCardProps) => {
  // Lấy ảnh (image URL) từ metadata nhờ hook bạn đã viết
  const img = useNftMetadata(nft);

  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const handleCopy = React.useCallback((field: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  }, []);

  // Optional: loading skeleton khi chưa có img và đang chờ metadata
  const ImageSlot = (
    <div className="w-40 h-40 relative rounded-lg overflow-hidden bg-cyber-darker/60 border border-emerald-400/40 flex items-center justify-center">
      {img === null ? (
        // skeleton / fallback
        <div className="w-full h-full animate-pulse bg-emerald-400/10 flex items-center justify-center text-center p-4 text-xs text-gray-400">
          NFT #{nft.blockId}
        </div>
      ) : (
        <Image
          src={img}
          alt={`NFT #${nft.blockId}`}
          fill
          sizes="160px"
          className="object-cover"
          unoptimized
        />
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`w-full max-w-xl mx-auto mb-8 mt-10 ${className ?? ""}`}
    >
      <Card className="glass-morphism-deep border border-emerald-400/40 shadow-neon-glow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-300 text-xl">
            <Gift className="w-5 h-5" />
            NFT Reward
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            {/* Image */}
            {ImageSlot}

            {/* Details */}
            <div className="flex-1 w-full space-y-3 text-sm">
              <InfoRow
                label="Block ID"
                value={String(nft.blockId)}
                onCopy={() => handleCopy("Block ID", String(nft.blockId))}
                copied={copiedField === "Block ID"}
              />
              {nft.sender && (
                <InfoRow
                  label="Sender"
                  value={nft.sender}
                  display={shortHex(nft.sender)}
                  onCopy={() => handleCopy("sender", nft?.sender ?? "")}
                  copied={copiedField === "Sender"}
                />
              )}
              <InfoRow
                label="Owner"
                value={nft.owner}
                display={shortHex(nft.owner)}
                onCopy={() => handleCopy("Owner", nft.owner)}
                copied={copiedField === "Owner"}
              />
              <InfoRow
                label="Metadata"
                value={nft.uri}
                display={nft.uri}
                isLink
                onCopy={() => handleCopy("Metadata URL", nft.uri)}
                copied={copiedField === "Metadata URL"}
              />

              {/* 
              // NFT đã mint & gửi ví, không cần claim.
              // Nếu sau này cần khôi phục nút claim, bỏ comment khối dưới:
              //
              // <div className="pt-2">
              //   <Button
              //     onClick={handleClaim}
              //     className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-sm font-bold"
              //   >
              //     Claim NFT
              //   </Button>
              // </div>
              */}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
