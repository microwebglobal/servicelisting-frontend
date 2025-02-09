import { useAuth } from "@src/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withAuth = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && (!user || !allowedRoles.includes(user.role))) {
        router.push("/");
      }
    }, [user, loading, allowedRoles, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    return user && allowedRoles.includes(user.role) ? (
      <WrappedComponent {...props} />
    ) : null;
  };
};

export default withAuth;
