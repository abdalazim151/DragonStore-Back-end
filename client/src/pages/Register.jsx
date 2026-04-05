import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./FormPage.css";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = new FormData();
      body.append("firstName", firstName);
      body.append("lastName", lastName);
      body.append("email", email);
      body.append("password", password);
      body.append("roles", roles);

      const res = await apiFetch("/auth/register", {
        method: "POST",
        body,
      });
      login(res.accessToken, res.refreshToken);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-page">
      <h1>Create account</h1>
      <form onSubmit={onSubmit} className="card form-card">
        <div className="form-row">
          <label>
            First name
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label>
            Last name
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
        </div>
        <label>
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password (min 6)
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          Role
          <select value={roles} onChange={(e) => setRoles(e.target.value)}>
            <option value="user">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn primary wide" disabled={loading}>
          {loading ? "Creating…" : "Register"}
        </button>
      </form>
      <p className="form-footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
