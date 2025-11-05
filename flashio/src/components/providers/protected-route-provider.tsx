"use client";

import { ReactNode, useEffect, useState } from "react";
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
  const [isMounted, setIsMounted] = useState(false);

  // ensure mounted bc of annnoying issue
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe?.();
  }, [initAuthListener]);

  useEffect(() => {
    // after mounting
    if (
      isMounted &&
      initialized &&
      !loading &&
      !authUser &&
      currentPath !== "/auth/get-authed"
    ) {
      router.push("/auth/get-authed");
    }
  }, [isMounted, initialized, loading, authUser, router, currentPath]);

  // Show loader
  if (!isMounted || !initialized || loading || !authUser) {
    //  allow the auth page
    if (currentPath === "/auth/get-authed") {
      return <>{children}</>;
    }

    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}
