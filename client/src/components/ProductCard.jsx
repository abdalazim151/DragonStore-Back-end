import { Link } from "react-router-dom";
import "./ProductCard.css";

function avgRating(product) {
  if (!product.ratingsQuantity) return null;
  return (product.ratingSum / product.ratingsQuantity).toFixed(1);
}

export default function ProductCard({ product }) {
  const rating = avgRating(product);
  return (
    <article className="product-card">
      <Link to={`/product/${product._id}`} className="product-card-link">
        <div className="product-card-media">
          {product.img ? (
            <img src={product.img} alt="" loading="lazy" />
          ) : (
            <div className="product-card-placeholder">No image</div>
          )}
        </div>
        <div className="product-card-body">
          <h3>{product.title}</h3>
          <p className="product-type">{product.Type}</p>
          <div className="product-card-meta">
            <span className="price">${product.price}</span>
            {rating != null && (
              <span className="rating" title="Average rating">
                ★ {rating}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
