import { NftReward } from "@/types/schema";

type AnyObj = Record<string, any>;

const pick = <T = any>(o: AnyObj, keys: string[], fallback?: T): T =>
  keys.find((k) => k in o) !== undefined
    ? (o[keys.find((k) => k in o)!] as T)
    : (fallback as T);

export const parseNftReward = (raw: unknown): NftReward | null => {
  if (!raw) return null;

  // --- Case 1: Array/Tuple [blockId, sender, owner, uri, claimable] ---
  if (Array.isArray(raw)) {
    if (raw.length < 5) return null;
    return {
      blockId: Number(raw[0]),
      sender: raw[1] != null ? String(raw[1]) : undefined,
      owner: String(raw[2] ?? ""),
      uri: String(raw[3] ?? ""),
      claimable: Boolean(raw[4]),
    };
  }

  // --- Case 2: Object-like ---
  if (typeof raw === "object") {
    const o = raw as AnyObj;

    // Hỗ trợ nhiều biến thể khóa (camelCase, snake_case, khác API)
    const blockId = Number(
      pick(o, ["blockId", "block_id", "height", "block"], 0)
    );
    const sender = pick<string | undefined>(
      o,
      ["sender", "from", "sender_address", "minter"],
      undefined
    );
    const owner = String(pick(o, ["owner", "to", "recipient", "wallet"], ""));
    const uri = String(
      pick(o, ["uri", "tokenUri", "token_uri", "metadata", "url"], "")
    );
    const claimable = Boolean(
      pick(
        o,
        ["claimable", "is_claimable", "can_claim", "unclaimed", "available"],
        false
      )
    );
    const image = pick<string | null>(o, ["image", "img", "image_url"], null);

    // Nếu không có owner + uri thì coi như invalid.
    if (!owner && !uri) return null;

    return { blockId, sender, owner, uri, claimable, image };
  }

  return null;
};

export const guessImageUrl = (uri: string): string | null => {
  if (!uri) return null;
  const lower = uri.toLowerCase();
  if (
    lower.endsWith(".png") ||
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".gif") ||
    lower.endsWith(".webp") ||
    lower.endsWith(".svg")
  ) {
    return uri;
  }
  return null;
};
