import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import "./SellerDashboard.css";

export default function SellerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/seller");
      const list = Array.isArray(data) ? data : [];
      setOrders(list.filter((o) => o.product));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function respond(id, accept) {
    setBusyId(id);
    try {
      await apiFetch(`/seller/${id}/${accept}`, { method: "PATCH" });
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p className="muted center">Loading orders…</p>;
  if (error) return <p className="error-banner">{error}</p>;

  return (
    <div className="seller-page">
      <h1>Pending orders</h1>
      <p className="muted">
        When buyers check out, line items appear here until you accept or reject
        them.
      </p>
      {!orders.length ? (
        <p className="muted">No pending orders.</p>
      ) : (
        <ul className="order-list">
          {orders.map((o) => (
            <li key={o._id} className="card order-card">
              <div>
                <strong>{o.product?.title}</strong>
                <p className="small muted">
                  Qty {o.quantity} · ${o.product?.price} · Buyer cart item{" "}
                  <code>{o._id}</code>
                </p>
              </div>
              <div className="order-actions">
                <button
                  type="button"
                  className="btn primary"
                  disabled={busyId === o._id}
                  onClick={() => respond(o._id, "true")}
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="btn ghost"
                  disabled={busyId === o._id}
                  onClick={() => respond(o._id, "false")}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
