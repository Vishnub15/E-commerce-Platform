import React, { useState } from 'react';
import { Mail, Shield, ShieldCheck, CreditCard } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useStore();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      showToast('Thank you for subscribing to our newsletter!', 'success');
      setEmail('');
    }
  };

  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      background: 'rgba(10, 13, 20, 0.9)',
      padding: '60px 0 30px',
      marginTop: '80px',
    }}>
      <div className="container">
        {/* Top Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '50px',
        }}>
          {/* Brand Col */}
          <div>
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              marginBottom: '16px',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.05em',
            }}>
              AURA
            </h3>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              marginBottom: '20px',
            }}>
              Designing the future of premium tech accessories and luxury lifestyle gear. Crafted with precision, engineered for reliability.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
            }}>
              <span className="badge badge-info" style={{ gap: '4px' }}>
                <Shield size={12} />
                Secured SSL
              </span>
              <span className="badge badge-success" style={{ gap: '4px' }}>
                <ShieldCheck size={12} />
                Certified
              </span>
            </div>
          </div>

          {/* Links Col */}
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '20px',
              color: '#ffffff',
            }}>
              Store Directory
            </h4>
            <ul style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
            }}>
              <li><a href="/" className="footer-link">Explore Catalog</a></li>
              <li><a href="/orders" className="footer-link">Order Status</a></li>
              <li><a href="/login" className="footer-link">Member Area</a></li>
              <li><a href="/admin" className="footer-link">Admin Console</a></li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '20px',
              color: '#ffffff',
            }}>
              Exclusive Updates
            </h4>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              marginBottom: '16px',
              lineHeight: 1.5,
            }}>
              Subscribe to receive updates, access to exclusive deals, and early launch announcements.
            </p>
            <form onSubmit={handleSubscribe} style={{
              display: 'flex',
              gap: '8px',
            }}>
              <div style={{
                position: 'relative',
                flexGrow: 1,
              }}>
                <input
                  type="email"
                  placeholder="Enter email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  style={{
                    height: '42px',
                    paddingLeft: '40px',
                    fontSize: '0.85rem',
                  }}
                  required
                />
                <Mail size={16} style={{
                  position: 'absolute',
                  left: '14px',
                  top: '13px',
                  color: 'var(--text-muted)',
                }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{
                padding: '0 16px',
                height: '42px',
                fontSize: '0.85rem',
              }}>
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
          }}>
            &copy; {new Date().getFullYear()} AURA Store. All rights reserved. Built with precision and care.
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CreditCard size={14} />
              Secure payments powered by MockPay
            </span>
          </div>
        </div>
      </div>
      <style>{`
        .footer-link:hover {
          color: #ffffff;
          padding-left: 4px;
        }
        .footer-link {
          transition: all var(--transition-fast);
        }
      `}</style>
    </footer>
  );
};
export default Footer;
