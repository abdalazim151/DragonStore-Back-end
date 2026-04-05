import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import "./AdminStats.css";

export default function AdminStats() {
  const [buyers, setBuyers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch("/auth/users/top-buyers?limit=10"),
      apiFetch("/auth/users/top-sellers?limit=10"),
    ])
      .then(([b, s]) => {
        setBuyers(b.data || []);
        setSellers(s.data || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="muted center">Loading stats…</p>;
  if (error) return <p className="error-banner">{error}</p>;

  return (
    <div className="admin-page">
      <h1>Admin analytics</h1>
      <p className="muted">
        Top buyers and sellers by accepted checkout volume (from cart orders).
      </p>
      <div className="admin-grid">
        <section className="card admin-block">
          <h2>Top buyers</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Spent</th>
                <th>Orders</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((b) => (
                <tr key={b.userId}>
                  <td>{b.name}</td>
                  <td>${b.totalSpent?.toFixed?.(2) ?? b.totalSpent}</td>
                  <td>{b.ordersCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!buyers.length && <p className="muted small">No data yet.</p>}
        </section>
        <section className="card admin-block">
          <h2>Top sellers</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Revenue</th>
                <th>Units</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((s) => (
                <tr key={s.sellerId}>
                  <td>{s.name}</td>
                  <td>${s.totalRevenue?.toFixed?.(2) ?? s.totalRevenue}</td>
                  <td>{s.totalUnitsSold}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!sellers.length && <p className="muted small">No data yet.</p>}
        </section>
      </div>
    </div>
  );
}
