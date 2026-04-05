import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { apiFetch } from "../api/client";
import "./Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    const q = new URLSearchParams();
    q.set("page", String(page));
    q.set("limit", "12");
    if (category) q.set("category", category);
    if (search.trim()) q.set("search", search.trim());
    if (minPrice !== "") q.set("minPrice", minPrice);
    if (maxPrice !== "") q.set("maxPrice", maxPrice);

    setLoading(true);
    setError("");
    apiFetch(`/api/products?${q.toString()}`)
      .then((res) => {
        setProducts(res.data || []);
        setTotal(res.total ?? 0);
        setTotalPages(res.totalPages ?? 1);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [page, category, search, minPrice, maxPrice]);

  return (
    <div className="home">
      <section className="hero">
        <h1>Find your next device</h1>
        <p>
          Laptops, mobiles, and headphones — browse the catalog and checkout
          with the cart API.
        </p>
      </section>

      <section className="filters card-panel">
        <div className="filter-row">
          <label>
            Search
            <input
              type="search"
              placeholder="Search titles..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </label>
          <label>
            Category
            <select
              value={category}
              onChange={(e) => {
                setPage(1);
                setCategory(e.target.value);
              }}
            >
              <option value="">All</option>
              <option value="laptop">Laptop</option>
              <option value="mobiles">Mobiles</option>
              <option value="headphone">Headphone</option>
            </select>
          </label>
          <label>
            Min price
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) => {
                setPage(1);
                setMinPrice(e.target.value);
              }}
            />
          </label>
          <label>
            Max price
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => {
                setPage(1);
                setMaxPrice(e.target.value);
              }}
            />
          </label>
        </div>
        <p className="filter-meta">
          {total} products · page {page} of {totalPages}
        </p>
      </section>

      {error && <p className="error-banner">{error}</p>}
      {loading ? (
        <p className="muted center">Loading…</p>
      ) : (
        <>
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          {!products.length && !error && (
            <p className="muted center">No products match your filters.</p>
          )}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                className="btn ghost"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span>
                {page} / {totalPages}
              </span>
              <button
                type="button"
                className="btn ghost"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
