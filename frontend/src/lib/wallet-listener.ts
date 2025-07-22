import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useGameState } from "./game-state";
import { fetchUserStatsByWallet, loginUser } from "./api";
import { useUsernameModal } from "@/hooks/username-modal-context";

export function WalletListener() {
  const { address, isConnected } = useAccount();
  const { currentUser, setCurrentUser } = useGameState();
  const { showModal } = useUsernameModal();

  useEffect(() => {
    if (!isConnected || !address) {
      setCurrentUser(null);
      return;
    }

    if (currentUser && currentUser.walletId === address) {
      return;
    }

    const fetchUserData = async () => {
      try {
        const user = await loginUser(address);

        if (user) {
          try {
            const userStats = await fetchUserStatsByWallet(address);
            user.gamesWon = userStats.games_won;
            user.rank = userStats.rank;
            user.totalScore = userStats.total_score;
          } catch (e) {
            console.warn("Cannot fetch user stats:", e);
          }
        }

        if (user && !user.username) {
          showModal(address);
        }

        setCurrentUser(user);
      } catch (error) {
        console.error(
          "Lỗi khi đăng nhập hoặc lấy thông tin người dùng:",
          error
        );
        setCurrentUser(null);
      }
    };

    fetchUserData();
  }, [isConnected, address]);

  return null;
}
