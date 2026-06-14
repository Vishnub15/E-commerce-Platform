import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Calendar, Tag, ShieldCheck, ChevronDown, ChevronUp, Package, MapPin } from 'lucide-react';

export const OrderHistory: React.FC = () => {
  const { orders, fetchMyOrders, user, loading, showToast } = useStore();
  const navigate = useNavigate();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      showToast('Please login to view your order history', 'info');
      navigate('/login');
    } else {
      fetchMyOrders();
    }
  }, [user, navigate]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'badge-info';
      case 'shipped':
        return 'badge-warning';
      case 'delivered':
        return 'badge-success';
      default:
        return 'badge-info';
    }
  };

  if (loading && orders.length === 0) {
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

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '40px',
      }}>
        <div>
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            marginBottom: '8px',
          }}>
            Your Purchase History
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Track your shipping status and view invoice details of your past orders.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="glass" style={{
          padding: '60px 24px',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          border: '1px solid var(--border-color)',
        }}>
          <Package size={48} color="var(--text-muted)" strokeWidth={1} />
          <h3 style={{ fontFamily: 'var(--font-heading)' }}>No orders found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto', fontSize: '0.9rem' }}>
            It looks like you haven't placed any orders yet. Head back to the store catalog to discover premium gear.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Go Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const formattedDate = new Date(order.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            return (
              <div
                key={order.id}
                className="glass"
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  transition: 'var(--transition-fast)',
                }}
              >
                {/* Header Summary Row */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  style={{
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '20px',
                    cursor: 'pointer',
                    background: isExpanded ? 'rgba(255,255,255,0.015)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                    {/* Order ID */}
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        ORDER NUMBER
                      </span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'monospace' }}>
                        #{order.id.substring(0, 8).toUpperCase()}...
                      </span>
                    </div>

                    {/* Date */}
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        DATE PLACED
                      </span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} color="var(--text-muted)" />
                        {formattedDate}
                      </span>
                    </div>

                    {/* Total Price */}
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        TOTAL AMOUNT
                      </span>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-secondary)' }}>
                        ${Number(order.totalAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Badges and Collapsible Arrow */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Collapsible Details Area */}
                {isExpanded && (
                  <div style={{
                    padding: '24px',
                    borderTop: '1px solid var(--border-color)',
                    background: 'rgba(0, 0, 0, 0.15)',
                    animation: 'fadeIn var(--transition-fast) forwards',
                  }}>
                    {/* Grid of Items and Shipping Info */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '30px',
                    }}>
                      
                      {/* Left: Items list */}
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Tag size={14} color="var(--color-primary-light)" />
                          Ordered Items
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {order.items.map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  style={{
                                    width: '36px',
                                    height: '36px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-color)',
                                  }}
                                />
                                <span style={{ fontSize: '0.85rem' }}>
                                  {item.name} <span style={{ color: 'var(--text-muted)' }}>x{item.qty}</span>
                                </span>
                              </div>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                                ${(item.price * item.qty).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Shipping destination info */}
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={14} color="var(--color-primary-light)" />
                          Shipping Destination
                        </h4>
                        <div className="glass" style={{
                          padding: '16px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem',
                          lineHeight: 1.5,
                          color: 'var(--text-muted)',
                        }}>
                          <p style={{ fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>{user?.name}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                          <p>{order.shippingAddress.country}</p>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
export default OrderHistory;
