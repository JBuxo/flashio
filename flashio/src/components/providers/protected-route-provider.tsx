"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Loader from "@/components/ui/loader";
import { useUserStore } from "@/app/stores/user-store";

interface ProtectedProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedProps) {
  const { authUser, loading, initialized, initAuthListener } = useUserStore();
  const router = useRouter();
  const currentPath = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe?.();
  }, [initAuthListener]);

  // Redirect after loading & initialization
  useEffect(() => {
    if (!mounted || loading || !initialized) return;
    if (!authUser && currentPath !== "/auth/get-authed") {
      console.log("Redirecting to login page...");
      router.push("/auth/get-authed");
    }
  }, [mounted, initialized, loading, authUser, router, currentPath]);

  if (
    !mounted ||
    loading ||
    !initialized ||
    (!authUser && currentPath !== "/auth/get-authed")
  ) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}
