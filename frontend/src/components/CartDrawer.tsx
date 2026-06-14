import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { cart, cartOpen, setCartOpen, changeCartQty, removeFromCart } = useStore();
  const navigate = useNavigate();

  if (!cartOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
    }} onClick={() => setCartOpen(false)}>
      
      {/* Drawer Panel */}
      <div style={{
        maxWidth: '460px',
        width: '100%',
        height: '100%',
        background: '#0d121f',
        borderLeft: '1px solid var(--border-color)',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '30px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '16px',
        }}>
          <h2 style={{
            fontSize: '1.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <ShoppingBag size={20} color="var(--color-primary-light)" />
            Your Cart
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            style={{
              padding: '6px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.04)',
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition-fast)',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Area */}
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          paddingRight: '4px',
        }}>
          {cart.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60%',
              color: 'var(--text-muted)',
              gap: '16px',
            }}>
              <ShoppingBag size={48} strokeWidth={1} />
              <p style={{ fontSize: '0.95rem' }}>Your shopping cart is empty</p>
              <button
                className="btn btn-secondary"
                onClick={() => setCartOpen(false)}
                style={{ fontSize: '0.85rem', padding: '10px 20px', borderRadius: 'var(--radius-full)' }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.productId}
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-color)',
                }}
              >
                {/* Product thumbnail */}
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: 'var(--radius-sm)',
                    objectFit: 'cover',
                    border: '1px solid var(--border-color)',
                  }}
                />
                
                {/* Item Details */}
                <div style={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <h4 style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      marginBottom: '4px',
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {item.name}
                    </h4>
                    <span style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: 'var(--color-secondary)',
                    }}>
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity Actions */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '10px',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      <button
                        onClick={() => changeCartQty(item.productId, item.qty - 1)}
                        style={{ padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '0.85rem', width: '24px', textAlign: 'center', fontWeight: 'bold' }}>
                        {item.qty}
                      </span>
                      <button
                        onClick={() => changeCartQty(item.productId, item.qty + 1)}
                        style={{ padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      style={{
                        color: '#fca5a5',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Area */}
        {cart.length > 0 && (
          <div style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '20px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Subtotal</span>
              <span style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#ffffff',
                fontFamily: 'var(--font-heading)',
              }}>
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px 20px',
                fontSize: '0.95rem',
                borderRadius: 'var(--radius-md)',
              }}
            >
              Checkout Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default CartDrawer;
