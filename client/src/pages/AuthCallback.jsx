import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const access = params.get("accessToken");
    const refresh = params.get("refreshToken");
    if (access && refresh) {
      login(access, refresh);
      navigate("/", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [params, login, navigate]);

  return (
    <p className="muted center" style={{ padding: "2rem" }}>
      Completing sign-in…
    </p>
  );
}
