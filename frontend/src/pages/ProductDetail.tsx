import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore, Product } from '../context/StoreContext';
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, RefreshCw, Minus, Plus, Star } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToStore = null } = useStore(); // safe references
  const { products, addToCart, fetchProducts, loading } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      // Fetch individually if not in cache (e.g. reload or direct link)
      const fetchSingleProduct = async () => {
        setFetching(true);
        try {
          const res = await fetch(`/api/products/${id}`);
          if (!res.ok) throw new Error('Product not found');
          const data = await res.json();
          setProduct(data);
        } catch (err) {
          navigate('/');
        } finally {
          setFetching(false);
        }
      };
      if (id) fetchSingleProduct();
    }
  }, [id, products, navigate]);

  if (loading || fetching) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: '16px',
      }}>
        <div className="spinner" style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(99, 102, 241, 0.1)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}></div>
      </div>
    );
  }

  if (!product) return null;

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty);
    }
  };

  const isOutOfStock = product.countInStock <= 0;

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      
      {/* Back Link */}
      <Link to="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
        marginBottom: '40px',
        transition: 'var(--transition-fast)',
      }} className="back-link">
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      {/* Main Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '50px',
        alignItems: 'start',
      }}>
        
        {/* Left Column - Product Image */}
        <div className="glass" style={{
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.01)',
          border: '1px solid var(--border-color)',
        }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              maxHeight: '450px',
              objectFit: 'contain',
              borderRadius: 'var(--radius-md)',
            }}
          />
        </div>

        {/* Right Column - Product Specs / Purchasing */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Category */}
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--color-secondary)',
            letterSpacing: '0.1em',
            marginBottom: '12px',
          }}>
            {product.category}
          </span>

          {/* Product Name */}
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '16px',
            fontFamily: 'var(--font-heading)',
          }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '24px',
          }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
            ))}
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
              Verified (5.0 based on 42 reviews)
            </span>
          </div>

          {/* Price Tag */}
          <div style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '24px',
            fontFamily: 'var(--font-heading)',
          }}>
            ${Number(product.price).toFixed(2)}
          </div>

          {/* Description */}
          <p style={{
            fontSize: '1rem',
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            marginBottom: '32px',
          }}>
            {product.description}
          </p>

          {/* Stock info & Quantity Actions */}
          <div className="glass" style={{
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Inventory Status</span>
              {isOutOfStock ? (
                <span className="badge badge-danger" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5' }}>
                  Unavailable
                </span>
              ) : (
                <span className="badge badge-success">
                  {product.countInStock} Units Available
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-color)',
              }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Quantity</span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <button
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    style={{ padding: '8px 16px', cursor: 'pointer' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ fontSize: '1rem', width: '30px', textAlign: 'center', fontWeight: 'bold' }}>
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((prev) => Math.min(product.countInStock, prev + 1))}
                    style={{ padding: '8px 16px', cursor: 'pointer' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="btn btn-primary"
            style={{
              padding: '16px 24px',
              fontSize: '1rem',
              width: '100%',
              borderRadius: 'var(--radius-md)',
              opacity: isOutOfStock ? 0.5 : 1,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              marginBottom: '40px',
            }}
          >
            <ShoppingCart size={18} />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Shopping Cart'}</span>
          </button>

          {/* Guarantee Badges */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '16px',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '30px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <Truck size={16} color="var(--color-secondary)" />
              <span>Free Delivery</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <RefreshCw size={16} color="var(--color-secondary)" />
              <span>30-Day Returns</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <ShieldCheck size={16} color="var(--color-secondary)" />
              <span>1-Year Warranty</span>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .back-link:hover {
          color: #ffffff !important;
          transform: translateX(-4px);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
export default ProductDetail;
