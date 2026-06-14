import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Lock, Mail, User as UserIcon, ArrowRight, Info } from 'lucide-react';

export const LoginRegister: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const { loginUser, registerUser, user, showToast } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!email || !password) {
      setValidationError('Please fill in all required fields');
      return;
    }

    if (!isLogin) {
      if (!name) {
        setValidationError('Please enter your name');
        return;
      }
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match');
        return;
      }
    }

    let success = false;
    if (isLogin) {
      success = await loginUser(email, password);
    } else {
      success = await registerUser(name, email, password);
    }

    if (success) {
      // Navigates automatically due to useEffect redirect
    }
  };

  return (
    <div className="container animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '40px 24px',
    }}>
      
      {/* Outer Card */}
      <div className="glass" style={{
        maxWidth: '450px',
        width: '100%',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 30px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Decorative background blur inside card */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}></div>

        {/* Tab Toggle */}
        <div style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.2)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '32px',
          border: '1px solid var(--border-color)',
        }}>
          <button
            onClick={() => {
              setIsLogin(true);
              setValidationError('');
            }}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              background: isLogin ? 'var(--color-primary)' : 'none',
              color: isLogin ? '#ffffff' : 'var(--text-muted)',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setValidationError('');
            }}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              background: !isLogin ? 'var(--color-primary)' : 'none',
              color: !isLogin ? '#ffffff' : 'var(--text-muted)',
            }}
          >
            Create Account
          </button>
        </div>

        {/* Form Title */}
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: 800,
          marginBottom: '8px',
          fontFamily: 'var(--font-heading)',
        }}>
          {isLogin ? 'Welcome Back' : 'Get Started'}
        </h2>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          marginBottom: '30px',
        }}>
          {isLogin ? 'Sign in to access your orders and checkout.' : 'Create an account to start shopping premium gear.'}
        </p>

        {/* Validation Error Banner */}
        {validationError && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            color: '#fca5a5',
            fontSize: '0.85rem',
            marginBottom: '24px',
          }}>
            {validationError}
          </div>
        )}

        {/* Input Forms */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          
          {/* Name input (Register only) */}
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '44px' }}
                required={!isLogin}
              />
              <UserIcon size={18} style={{
                position: 'absolute',
                left: '16px',
                top: '14px',
                color: 'var(--text-muted)',
              }} />
            </div>
          )}

          {/* Email input */}
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '44px' }}
              required
            />
            <Mail size={18} style={{
              position: 'absolute',
              left: '16px',
              top: '14px',
              color: 'var(--text-muted)',
            }} />
          </div>

          {/* Password input */}
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '44px' }}
              required
            />
            <Lock size={18} style={{
              position: 'absolute',
              left: '16px',
              top: '14px',
              color: 'var(--text-muted)',
            }} />
          </div>

          {/* Password confirmation (Register only) */}
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '44px' }}
                required={!isLogin}
              />
              <Lock size={18} style={{
                position: 'absolute',
                left: '16px',
                top: '14px',
                color: 'var(--text-muted)',
              }} />
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.95rem',
              marginTop: '10px',
            }}
          >
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>

      {/* Default Accounts Callout Box (Highly convenient for testing) */}
      <div className="glass" style={{
        maxWidth: '450px',
        width: '100%',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        marginTop: '24px',
        border: '1px solid rgba(6, 182, 212, 0.15)',
        background: 'rgba(6, 182, 212, 0.03)',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
      }}>
        <Info size={18} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--color-secondary)' }}>Demo Accounts (Pre-Seeded):</strong>
          <div style={{ marginTop: '8px' }}>
            <strong>Regular User:</strong> user@store.com / user123
          </div>
          <div style={{ marginTop: '4px' }}>
            <strong>Admin User:</strong> admin@store.com / admin123
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginRegister;
