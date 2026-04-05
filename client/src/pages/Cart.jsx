import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";
import "./Cart.css";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/cart");
      setItems(res.data || []);
      setTotalPrice(res.totalPrice ?? 0);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateQty(cartItemId, quantity) {
    setBusy(true);
    try {
      await apiFetch(`/cart/update/${cartItemId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity: Number(quantity) }),
      });
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function removeItem(cartItemId) {
    setBusy(true);
    try {
      await apiFetch(`/cart/remove/${cartItemId}`, { method: "DELETE" });
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function checkout() {
    if (!items.length) return;
    setBusy(true);
    try {
      await apiFetch("/cart/checkout", { method: "PATCH" });
      alert("Checkout complete — sellers have been notified.");
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function clearAll() {
    setBusy(true);
    try {
      await apiFetch("/cart/clear", { method: "DELETE" });
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="muted center">Loading cart…</p>;
  if (error) return <p className="error-banner">{error}</p>;

  return (
    <div className="cart-page">
      <h1>Your cart</h1>
      {!items.length ? (
        <p className="muted">
          Cart is empty. <Link to="/">Continue shopping</Link>
        </p>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((row) => (
              <li key={row._id} className="card cart-row">
                <div className="cart-thumb">
                  {row.product?.img ? (
                    <img src={row.product.img} alt="" />
                  ) : (
                    <div className="ph">—</div>
                  )}
                </div>
                <div className="cart-info">
                  <Link to={`/product/${row.product?._id}`}>
                    {row.product?.title || "Product"}
                  </Link>
                  <p className="muted small">
                    ${row.product?.price ?? "—"} each
                  </p>
                </div>
                <label>
                  Qty
                  <input
                    type="number"
                    min={1}
                    disabled={busy}
                    defaultValue={row.quantity}
                    key={row._id + row.quantity}
                    onBlur={(e) =>
                      updateQty(row._id, e.target.value)
                    }
                  />
                </label>
                <button
                  type="button"
                  className="btn ghost"
                  disabled={busy}
                  onClick={() => removeItem(row._id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-summary card">
            <p>
              <strong>Estimated total:</strong> ${totalPrice?.toFixed?.(2) ?? totalPrice}
            </p>
            <div className="cart-actions">
              <button
                type="button"
                className="btn primary"
                disabled={busy}
                onClick={checkout}
              >
                Checkout (notify sellers)
              </button>
              <button
                type="button"
                className="btn ghost"
                disabled={busy}
                onClick={clearAll}
              >
                Clear cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
