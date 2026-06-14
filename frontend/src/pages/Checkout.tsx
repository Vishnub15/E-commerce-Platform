import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CreditCard, ShoppingBag, ShieldCheck, MapPin, Truck } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { cart, user, placeOrder, showToast } = useStore();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      showToast('Please login to continue to checkout', 'info');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    }
  }, [user, navigate]);

  // Shipping Address Fields
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  // Mock Payment Fields
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);

  // Totals calculations
  const itemsPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 150 ? 0 : 15;
  const taxPrice = itemsPrice * 0.08;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  if (cart.length === 0) {
    return (
      <div className="container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '20px',
      }}>
        <ShoppingBag size={64} color="var(--text-muted)" strokeWidth={1} />
        <h2 style={{ fontFamily: 'var(--font-heading)' }}>Your cart is empty</h2>
        <p style={{ color: 'var(--text-muted)' }}>Cannot complete checkout without items in cart.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Shop Our Products
        </button>
      </div>
    );
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || !city || !postalCode || !country) {
      showToast('Please fill in all shipping fields', 'error');
      return;
    }

    if (!cardName || !cardNumber || !cardExpiry || !cardCvc) {
      showToast('Please fill in all card details', 'error');
      return;
    }

    // Mock validation of credit card
    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 15 || cleanCard.length > 16) {
      showToast('Please enter a valid credit card number', 'error');
      return;
    }
    if (cardCvc.length < 3 || cardCvc.length > 4) {
      showToast('Please enter a valid CVC', 'error');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing time
    setTimeout(async () => {
      const order = await placeOrder({
        address,
        city,
        postalCode,
        country,
      });

      setIsProcessing(false);

      if (order) {
        navigate('/orders');
      }
    }, 2000);
  };

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Expiry Date (adds slash)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    let formatted = value;
    if (value.length > 2) {
      formatted = `${value.substring(0, 2)}/${value.substring(2)}`;
    }
    setCardExpiry(formatted);
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <h1 style={{
        fontSize: '2.2rem',
        fontWeight: 800,
        marginBottom: '32px',
        fontFamily: 'var(--font-heading)',
      }}>
        Secure Checkout
      </h1>

      <form onSubmit={handleCheckoutSubmit} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        alignItems: 'start',
      }}>
        
        {/* Left Hand Column - Checkout Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Shipping Form */}
          <div className="glass" style={{
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
          }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 600,
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <MapPin size={18} color="var(--color-primary-light)" />
              Shipping Address
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="text"
                placeholder="Street Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input-field"
                required
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="input-field"
                  required
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Payment Form (Mock Stripe Elements style) */}
          <div className="glass" style={{
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
          }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 600,
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <CreditCard size={18} color="var(--color-primary-light)" />
              Payment Information
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="text"
                placeholder="Cardholder Name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Card Number (0000 0000 0000 0000)"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="input-field"
                required
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <input
                  type="text"
                  placeholder="Expiry (MM/YY)"
                  value={cardExpiry}
                  onChange={handleExpiryChange}
                  className="input-field"
                  required
                />
                <input
                  type="password"
                  placeholder="CVC"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value.substring(0, 4))}
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Hand Column - Order Summary */}
        <div style={{
          position: 'sticky',
          top: '100px',
        }}>
          <div className="glass" style={{
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
          }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 600,
              marginBottom: '20px',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '12px',
            }}>
              Order Summary
            </h3>

            {/* Cart Items List */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              marginBottom: '24px',
              maxHeight: '200px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}>
              {cart.map((item) => (
                <div key={item.productId} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '75%' }}>
                    <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    <span style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {item.name} <span style={{ color: 'var(--text-muted)' }}>x{item.qty}</span>
                    </span>
                  </div>
                  <span style={{ fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '20px',
              marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping</span>
                <span>{shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Est. Tax (8%)</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              
              {/* Grand Total */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#ffffff',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '16px',
                fontFamily: 'var(--font-heading)',
              }}>
                <span>Total Due</span>
                <span style={{ color: 'var(--color-secondary)' }}>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Check Out Action Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.95rem',
                justifyContent: 'center',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
              }}
            >
              {isProcessing ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="spinner" style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.2)',
                    borderTopColor: '#ffffff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}></div>
                  <span>Securing payment...</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} />
                  <span>Authorize Charge & Checkout</span>
                </div>
              )}
            </button>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginTop: '16px',
            }}>
              <Truck size={14} color="var(--color-secondary)" />
              <span>Orders over $150 qualify for Free Next-Day Shipping</span>
            </div>
          </div>
        </div>

      </form>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
export default Checkout;
