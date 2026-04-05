import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  apiFetch,
  clearTokens,
  getStoredAccessToken,
  parseJwtPayload,
  setTokens,
} from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessTokenState] = useState(() =>
    getStoredAccessToken()
  );
  const [userProfile, setUserProfile] = useState(null);

  const payload = useMemo(
    () => parseJwtPayload(accessToken),
    [accessToken]
  );

  const roles = payload?.roles || [];
  const userId = payload?.id;

  const refreshProfile = useCallback(async () => {
    if (!userId) {
      setUserProfile(null);
      return;
    }
    try {
      const res = await apiFetch(`/auth/users/${userId}`);
      setUserProfile(res.data);
    } catch {
      setUserProfile(null);
    }
  }, [userId]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = useCallback((access, refresh) => {
    setTokens(access, refresh);
    setAccessTokenState(access);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setAccessTokenState(null);
    setUserProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      accessToken,
      userId,
      roles,
      userProfile,
      isAuthenticated: Boolean(accessToken),
      isSeller: roles.includes("seller") || roles.includes("admin"),
      isAdmin: roles.includes("admin"),
      login,
      logout,
      refreshProfile,
    }),
    [
      accessToken,
      userId,
      roles,
      userProfile,
      login,
      logout,
      refreshProfile,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
