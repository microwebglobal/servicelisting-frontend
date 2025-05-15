"use client";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { providerAPI } from "@api/provider";
import { Loader2 } from "lucide-react";

const withSuspensionCheck = (WrappedComponent) => {
  const WithSuspensionCheckComponent = (props) => {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const [statusLoading, setStatusLoading] = useState(true);
    const [isSuspended, setIsSuspended] = useState(false);

    const checkProviderStatus = useCallback(async () => {
      if (!user?.uId) return;

      try {
        const response = await providerAPI.getProviderByUserId(user.uId);
        const providerStatus = response?.data?.User?.account_status;

        console.log(response.data);
        if (providerStatus === "suspended") {
          setIsSuspended(true);
          if (pathname !== "/profile/provider/payouts") {
            router.push("/profile/provider/payouts");
          }
        }
      } catch (error) {
        console.error("Error checking provider status:", error);
        router.push("/profile/provider");
      } finally {
        setStatusLoading(false);
      }
    }, [user?.uId, pathname, router]);

    useEffect(() => {
      checkProviderStatus();
    }, [checkProviderStatus]);

    if (statusLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      );
    }

    if (isSuspended) {
      return null; // Already redirected
    }

    return <WrappedComponent {...props} />;
  };

  WithSuspensionCheckComponent.displayName = `WithSuspensionCheck(${getDisplayName(
    WrappedComponent
  )})`;

  return WithSuspensionCheckComponent;
};

// Helper to name the HOC
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default withSuspensionCheck;
