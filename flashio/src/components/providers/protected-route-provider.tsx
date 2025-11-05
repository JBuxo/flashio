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
  const { authUser, loading, initialized, initAuthListener } = useUserStore();

  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe?.();
  }, [initAuthListener]);

  useEffect(() => {
    if (
      initialized &&
      !loading &&
      !authUser &&
      currentPath !== "/auth/get-authed"
    ) {
      router.push("/auth/get-authed");
    }
  }, [initialized, loading, authUser, router, currentPath]);

  if (
    (!initialized || loading || !authUser) &&
    currentPath !== "/auth/get-authed"
  ) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}
