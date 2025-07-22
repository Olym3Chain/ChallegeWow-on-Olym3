"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

import { loginUser, updateUser } from "@/lib/api";
import { useGameState } from "@/lib/game-state";

import UsernameModal from "@/components/username-modal";

interface UsernameModalContextType {
  showModal: (address: string) => void;
}

const UsernameModalContext = createContext<
  UsernameModalContextType | undefined
>(undefined);

export function UsernameModalProvider({ children }: { children: ReactNode }) {
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [pendingAddress, setPendingAddress] = useState<string | null>(null);

  const { setCurrentUser } = useGameState();

  const showModal = useCallback((address: string) => {
    setPendingAddress(address);
    setShowUsernameModal(true);
  }, []);

  const handleSaveUsername = useCallback(
    async (username: string) => {
      if (!pendingAddress) return;
      try {
        // cập nhật username
        await updateUser(pendingAddress, username);

        // reload user sau update
        const updatedUser = await loginUser(pendingAddress);
        setCurrentUser(updatedUser);

        // đóng modal + reset state
        setShowUsernameModal(false);
        setPendingAddress(null);
      } catch (error) {
        console.error("Lỗi khi lưu username:", error);
      }
    },
    [pendingAddress, setCurrentUser]
  );

  const handleOpenChange = useCallback((open: boolean) => {
    setShowUsernameModal(open);
    if (!open) {
      setPendingAddress(null);
    }
  }, []);

  return (
    <UsernameModalContext.Provider value={{ showModal }}>
      <UsernameModal
        open={showUsernameModal}
        onOpenChange={handleOpenChange}
        onSubmit={handleSaveUsername}
      />
      {children}
    </UsernameModalContext.Provider>
  );
}

export function useUsernameModal(): UsernameModalContextType {
  const ctx = useContext(UsernameModalContext);
  if (!ctx) {
    throw new Error(
      "useUsernameModal must be used within a UsernameModalProvider"
    );
  }
  return ctx;
}
