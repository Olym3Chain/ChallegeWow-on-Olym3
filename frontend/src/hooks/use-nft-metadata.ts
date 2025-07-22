import { guessImageUrl } from "@/lib/nft/utilts";
import { NftReward } from "@/types/schema";
import React from "react";

export const useNftMetadata = (nft: NftReward | null) => {
  const [img, setImg] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!nft) return;
    // first heuristic
    const direct = guessImageUrl(nft.uri);
    if (direct) {
      setImg(direct);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(nft.uri, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        // Common JSON metadata fields
        const imageField = data?.image || data?.image_url || data?.imageURI;
        if (
          !cancelled &&
          typeof imageField === "string" &&
          imageField.trim() !== ""
        ) {
          setImg(imageField);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nft?.uri]);
  return img;
};
