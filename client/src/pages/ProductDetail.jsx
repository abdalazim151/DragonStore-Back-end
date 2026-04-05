import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch, googleAuthUrl } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const { isAuthenticated, userId, isSeller } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [commentText, setCommentText] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setError("");
    Promise.all([
      apiFetch(`/api/products/${id}`),
      apiFetch(`/api/products/${id}/reviews`),
      apiFetch(`/api/products/${id}/comments`),
    ])
      .then(([p, r, c]) => {
        setProduct(p.data);
        setReviews(r.data || []);
        setComments(c.data || []);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  async function addToCart() {
    if (!isAuthenticated) return;
    setBusy(true);
    try {
      await apiFetch("/cart/add", {
        method: "POST",
        body: JSON.stringify({ productId: id, quantity: qty }),
      });
      alert("Added to cart");
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function toggleFavorite() {
    if (!isAuthenticated) return;
    setBusy(true);
    try {
      await apiFetch(`/favourites/${id}`, { method: "POST" });
      alert("Saved to favorites");
    } catch (e) {
      if (String(e.message).includes("already")) {
        alert("Already in favorites");
      } else {
        alert(e.message);
      }
    } finally {
      setBusy(false);
    }
  }

  async function submitReview(e) {
    e.preventDefault();
    if (!isAuthenticated) return;
    setBusy(true);
    try {
      await apiFetch(`/api/products/${id}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating: Number(rating) }),
      });
      const r = await apiFetch(`/api/products/${id}/reviews`);
      setReviews(r.data || []);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitComment(e) {
    e.preventDefault();
    if (!isAuthenticated || !commentText.trim()) return;
    setBusy(true);
    try {
      await apiFetch(`/api/products/${id}/comments`, {
        method: "POST",
        body: JSON.stringify({ content: commentText.trim() }),
      });
      setCommentText("");
      const c = await apiFetch(`/api/products/${id}/comments`);
      setComments(c.data || []);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (error) return <p className="error-banner">{error}</p>;
  if (!product) return <p className="muted center">Loading…</p>;

  const avg =
    product.ratingsQuantity > 0
      ? (product.ratingSum / product.ratingsQuantity).toFixed(2)
      : null;

  const isOwner =
    isSeller && product.user && String(product.user) === String(userId);

  return (
    <div className="product-detail">
      <div className="product-detail-grid">
        <div className="product-detail-media card">
          {product.img ? (
            <img src={product.img} alt="" />
          ) : (
            <div className="no-img">No image</div>
          )}
        </div>
        <div>
          <p className="crumb">
            <Link to="/">Shop</Link> / {product.Type}
          </p>
          <h1>{product.title}</h1>
          <p className="price-lg">${product.price}</p>
          {avg && (
            <p className="muted">
              Rating: {avg} ({product.ratingsQuantity} reviews)
            </p>
          )}
          <p className="desc">{product.description}</p>

          <div className="detail-specs card">
            <h3>Specifications</h3>
            <pre className="spec-json">
              {JSON.stringify(
                { Type: product.Type, ...product },
                (k, v) => (k === "user" || k === "__v" ? undefined : v),
                2
              )}
            </pre>
          </div>

          <div className="actions-row">
            <label className="qty">
              Qty
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value) || 1)}
              />
            </label>
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  className="btn primary"
                  disabled={busy}
                  onClick={addToCart}
                >
                  Add to cart
                </button>
                <button
                  type="button"
                  className="btn ghost"
                  disabled={busy}
                  onClick={toggleFavorite}
                >
                  ♥ Favorite
                </button>
              </>
            ) : (
              <p className="muted">
                <Link to="/login">Log in</Link> to add items or leave reviews.
              </p>
            )}
          </div>
          {!isAuthenticated && (
            <p className="oauth-line">
              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  window.location.href = googleAuthUrl();
                }}
              >
                Continue with Google
              </button>
            </p>
          )}
          {isOwner && (
            <p className="form-hint">
              This listing is yours — manage stock from the seller dashboard
              after orders are placed.
            </p>
          )}
        </div>
      </div>

      <section className="section-block">
        <h2>Reviews</h2>
        {isAuthenticated && (
          <form onSubmit={submitReview} className="inline-form">
            <label>
              Your rating (1–5)
              <input
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </label>
            <button type="submit" className="btn primary" disabled={busy}>
              Submit review
            </button>
          </form>
        )}
        <ul className="review-list">
          {reviews.map((rev) => (
            <li key={rev._id} className="card review-item">
              <strong>
                {rev.user?.firstName || "User"} — {rev.rating}★
              </strong>
            </li>
          ))}
          {!reviews.length && <li className="muted">No reviews yet.</li>}
        </ul>
      </section>

      <section className="section-block">
        <h2>Comments</h2>
        {isAuthenticated && (
          <form onSubmit={submitComment} className="comment-form">
            <textarea
              rows={3}
              placeholder="Write a comment…"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" className="btn primary" disabled={busy}>
              Post
            </button>
          </form>
        )}
        <ul className="comment-tree">
          {comments.map((c) => (
            <CommentNode key={c._id} c={c} depth={0} />
          ))}
        </ul>
        {!comments.length && <p className="muted">No comments yet.</p>}
      </section>
    </div>
  );
}

function CommentNode({ c, depth }) {
  return (
    <li className="comment-node" style={{ marginLeft: depth * 12 }}>
      <div className="card comment-bubble">
        <strong>{c.user?.firstName || "User"}</strong>
        <p>{c.content}</p>
      </div>
      {c.replies?.length > 0 && (
        <ul>
          {c.replies.map((r) => (
            <CommentNode key={r._id} c={r} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}
