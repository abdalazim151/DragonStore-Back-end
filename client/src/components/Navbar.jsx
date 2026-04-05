import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { isAuthenticated, logout, userProfile, isSeller, isAdmin } =
    useAuth();

  return (
    <header className="nav-bar">
      <Link to="/" className="brand">
        <span className="brand-mark">🐉</span>
        <span>DragonStore</span>
      </Link>
      <nav className="nav-links">
        <NavLink to="/" end>
          Shop
        </NavLink>
        {isAuthenticated && (
          <>
            <NavLink to="/cart">Cart</NavLink>
            <NavLink to="/favorites">Favorites</NavLink>
          </>
        )}
        {isSeller && (
          <>
            <NavLink to="/seller">Seller</NavLink>
            <NavLink to="/seller/new">Add product</NavLink>
          </>
        )}
        {isAdmin && <NavLink to="/admin">Admin</NavLink>}
      </nav>
      <div className="nav-auth">
        {isAuthenticated ? (
          <>
            <span className="user-pill" title={userProfile?.email}>
              {userProfile?.name || "Account"}
            </span>
            <button type="button" className="btn ghost" onClick={logout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link className="btn ghost" to="/login">
              Log in
            </Link>
            <Link className="btn primary" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
