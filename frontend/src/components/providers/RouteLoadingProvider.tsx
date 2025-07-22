"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RouteLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400); // 400ms để tránh nháy
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="route-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <Loader className="w-8 h-8 text-neon-blue animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
