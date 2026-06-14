import React from 'react';
import { Link } from 'react-router-dom';
import { useStore, Product } from '../context/StoreContext';
import { ShoppingCart, Star, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  const isOutOfStock = product.countInStock <= 0;
  const isLowStock = product.countInStock > 0 && product.countInStock <= 5;

  return (
    <div className="glass-interactive" style={{
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
    }}>
      {/* Product Image Link Container */}
      <Link to={`/product/${product.id}`} style={{
        position: 'relative',
        display: 'block',
        paddingTop: '80%', // 5:4 aspect ratio
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.01)',
      }} className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="product-card-image"
        />
        
        {/* Category tag */}
        <span style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          padding: '4px 8px',
          fontSize: '0.65rem',
          borderRadius: '4px',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          fontWeight: 600,
          color: '#ffffff',
        }}>
          {product.category}
        </span>

        {/* Hover overlay with a quick-view eye icon */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }} className="product-card-overlay">
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--text-main)',
            color: 'var(--text-dark)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 600,
            boxShadow: 'var(--shadow-md)',
          }}>
            <Eye size={14} />
            Quick View
          </span>
        </div>
      </Link>

      {/* Info Container */}
      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
      }}>
        {/* Rating Stars Mock */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginBottom: '8px',
        }}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} fill="#fbbf24" color="#fbbf24" />
          ))}
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginLeft: '4px',
          }}>
            (5.0)
          </span>
        </div>

        {/* Title */}
        <Link to={`/product/${product.id}`} style={{
          marginBottom: '8px',
        }}>
          <h3 style={{
            fontSize: '1.05rem',
            fontWeight: 600,
            lineHeight: 1.4,
            height: '2.8em',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            color: '#ffffff',
            transition: 'color var(--transition-fast)',
          }} className="product-title">
            {product.name}
          </h3>
        </Link>

        {/* Price & Stock info */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
          marginBottom: '16px',
        }}>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-secondary)',
          }}>
            ${Number(product.price).toFixed(2)}
          </span>

          {/* Stock state dot indicator */}
          {isOutOfStock ? (
            <span style={{ fontSize: '0.75rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}></span>
              Out of stock
            </span>
          ) : isLowStock ? (
            <span style={{ fontSize: '0.75rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', animation: 'pulse-glow 1.5s infinite' }}></span>
              {product.countInStock} Left
            </span>
          ) : (
            <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
              In Stock
            </span>
          )}
        </div>

        {/* Add to Cart Action */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: '0.85rem',
            opacity: isOutOfStock ? 0.5 : 1,
            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
          }}
        >
          <ShoppingCart size={16} />
          <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
        </button>
      </div>

      {/* Scoped hover interactions */}
      <style>{`
        .product-image-container:hover .product-card-image {
          transform: scale(1.08);
        }
        .product-image-container:hover .product-card-overlay {
          opacity: 1 !important;
        }
        .product-title:hover {
          color: var(--color-primary-light) !important;
        }
      `}</style>
    </div>
  );
};
export default ProductCard;
