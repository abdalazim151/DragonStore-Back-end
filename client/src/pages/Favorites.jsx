import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";
import ProductCard from "../components/ProductCard";

export default function Favorites() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/favourites")
      .then((res) => setRows(res.data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="muted center">Loading…</p>;
  if (error) return <p className="error-banner">{error}</p>;

  const products = rows.map((r) => r.product).filter(Boolean);

  return (
    <div>
      <h1>Favorites</h1>
      {!products.length ? (
        <p className="muted">
          Nothing saved yet. <Link to="/">Browse products</Link>
        </p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
