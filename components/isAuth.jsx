import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withAuth = (WrappedComponent, allowedRoles) => {
  const WithAuthComponent = (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && (!user || !allowedRoles.includes(user.role))) {
        router.push("/");
      }
    }, [user, loading, router]); 

    if (loading) {
      return <div>Loading...</div>;
    }

    return user && allowedRoles.includes(user.role) ? (
      <WrappedComponent {...props} />
    ) : null;
  };

  WithAuthComponent.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;
  
  return WithAuthComponent;
};

// Helper function to get the display name of a component
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAuth;