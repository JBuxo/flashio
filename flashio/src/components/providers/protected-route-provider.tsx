"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import Loader from "@/components/ui/loader";
import { useUserStore } from "@/app/stores/user-store";

interface ProtectedProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedProps) {
  const currentPath = usePathname();
  const router = useRouter();
  const { authUser, loading, initAuthListener } = useUserStore();

  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    if (!loading && !authUser && currentPath !== "/auth/get-authed") {
      router.push("/auth/get-authed");
    }
  }, [loading, authUser, router]);

  if ((loading || !authUser) && currentPath !== "/auth/get-authed") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}
