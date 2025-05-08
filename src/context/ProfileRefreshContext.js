// @src/context/ProfileRefreshContext.js
import { createContext, useContext, useState } from "react";

const ProfileRefreshContext = createContext();

export const ProfileRefreshProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <ProfileRefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </ProfileRefreshContext.Provider>
  );
};

export const useProfileRefresh = () => {
  const context = useContext(ProfileRefreshContext);
  if (!context) {
    throw new Error(
      "useProfileRefresh must be used within a ProfileRefreshProvider"
    );
  }
  return context;
};
