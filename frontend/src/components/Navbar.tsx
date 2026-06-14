import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Search, User as UserIcon, LogOut, ShieldAlert, BookOpen } from 'lucide-react';

interface NavbarProps {
  onSearch: (term: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const { cart, user, logoutUser, setCartOpen } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const cartItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
    navigate('/');
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <header className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 99,
      width: '100%',
      padding: '16px 0',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-nav)',
      backdropFilter: 'blur(20px)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            fontFamily: 'var(--font-heading)',
            background: 'linear-gradient(135deg, #ffffff, var(--color-primary-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            AURA
          </span>
          <span style={{
            padding: '2px 6px',
            fontSize: '0.65rem',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '4px',
            color: 'var(--color-primary-light)',
            fontWeight: 'bold',
          }}>
            STORE
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{
          position: 'relative',
          maxWidth: '400px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}>
          <input
            type="text"
            placeholder="Search premium products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onSearch(e.target.value);
            }}
            className="input-field"
            style={{
              paddingLeft: '44px',
              height: '42px',
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 'var(--radius-full)',
            }}
          />
          <Search size={18} style={{
            position: 'absolute',
            left: '16px',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }} />
        </form>

        {/* Navigation Actions */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}>
          {user && (
            <Link to="/orders" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
            }} className="nav-link-hover">
              <BookOpen size={16} />
              <span className="hide-mobile">My Orders</span>
            </Link>
          )}

          {user?.isAdmin && (
            <Link to="/admin" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-secondary)',
              fontSize: '0.9rem',
              fontWeight: 500,
            }} className="nav-link-hover">
              <ShieldAlert size={16} />
              <span className="hide-mobile">Dashboard</span>
            </Link>
          )}

          {/* User Section */}
          {user ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                lineHeight: 1.2,
              }} className="hide-mobile">
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {user.isAdmin ? 'Admin' : 'Member'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer',
                  border: '1px solid var(--border-color)',
                  color: '#ef4444',
                  transition: 'var(--transition-fast)',
                }}
                title="Logout"
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-secondary" style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
            }}>
              <UserIcon size={16} />
              <span>Login</span>
            </Link>
          )}

          {/* Cart Trigger Button */}
          <button
            onClick={() => setCartOpen(true)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1))',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              cursor: 'pointer',
              color: 'var(--color-primary-light)',
              transition: 'var(--transition-fast)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = 'var(--color-primary)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
            }}
          >
            <ShoppingBag size={18} />
            {cartItemsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                minWidth: '18px',
                height: '18px',
                padding: '0 4px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-accent), #f43f5e)',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
              }}>
                {cartItemsCount}
              </span>
            )}
          </button>
        </nav>
      </div>
      
      {/* Mobile media queries styling injection */}
      <style>{`
        @media (max-width: 600px) {
          .hide-mobile {
            display: none !important;
          }
        }
        .nav-link-hover:hover {
          color: var(--text-main) !important;
        }
      `}</style>
    </header>
  );
};
export default Navbar;
