import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, ArrowDownWideNarrow, ArrowUpWideNarrow } from 'lucide-react';

interface HomeProps {
  searchTerm: string;
}

export const Home: React.FC<HomeProps> = ({ searchTerm }) => {
  const { products, fetchProducts, loading } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const categories = ['All', 'Audio', 'Wearables', 'Accessories', 'Lifestyle'];

  // Fetch products when category or search changes
  useEffect(() => {
    fetchProducts(selectedCategory === 'All' ? '' : selectedCategory, searchTerm);
  }, [selectedCategory, searchTerm]);

  // Sort logic
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') {
      return Number(a.price) - Number(b.price);
    }
    if (sortBy === 'price-high') {
      return Number(b.price) - Number(a.price);
    }
    return 0; // Default sorting by database order
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      
      {/* Hero Section */}
      <section style={{
        padding: '80px 0',
        background: 'radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 60%)',
        marginBottom: '40px',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <div className="container" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '800px',
        }}>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-primary-light)',
            marginBottom: '16px',
            background: 'rgba(99, 102, 241, 0.08)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
          }}>
            Aura Premium Collection
          </span>
          <h1 style={{
            fontSize: '3.5rem',
            lineHeight: 1.1,
            marginBottom: '20px',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            letterSpacing: '-0.03em',
          }}>
            Designed for <span style={{
              background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Precision</span>, Engineered for <span style={{
              background: 'linear-gradient(135deg, var(--color-secondary), var(--color-accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Life</span>.
          </h1>
          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '32px',
          }}>
            Explore our curated selection of state-of-the-art consumer audio, lifestyle accessories, and futuristic wearable hardware designed to elevate your daily routine.
          </p>
          <a href="#catalog" className="btn btn-primary" style={{
            padding: '14px 32px',
            fontSize: '0.95rem',
            borderRadius: 'var(--radius-full)',
          }}>
            Browse Catalog
          </a>
        </div>
      </section>

      {/* Catalog Filters and Section */}
      <section id="catalog" className="container" style={{ scrollMarginTop: '100px' }}>
        
        {/* Filter bar */}
        <div className="glass" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          padding: '16px 24px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '40px',
        }}>
          
          {/* Categories select row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '4px',
            maxWidth: '100%',
          }} className="category-scroll">
            {categories.map((cat) => {
              const isActive = (cat === 'All' && selectedCategory === '') || (selectedCategory === cat);
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-full)',
                    background: isActive ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.04)',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--color-primary-light)' : 'var(--border-color)',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-muted)';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                    }
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Sort selection widgets */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <SlidersHorizontal size={16} color="var(--text-muted)" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-color)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                color: 'var(--text-main)',
                cursor: 'pointer',
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            >
              <option value="default" style={{ background: '#121826' }}>Featured</option>
              <option value="price-low" style={{ background: '#121826' }}>Price: Low to High</option>
              <option value="price-high" style={{ background: '#121826' }}>Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
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
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Loading collection...</span>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            color: 'var(--text-muted)',
            gap: '12px',
          }}>
            <p style={{ fontSize: '1.1rem' }}>No products found matching your criteria.</p>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSelectedCategory('');
                fetchProducts('', '');
              }}
              style={{ fontSize: '0.85rem' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '30px',
          }}>
            {sortedProducts.map((product) => (
              <div key={product.id} className="animate-fade-in">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Embedded Animations styling */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .category-scroll::-webkit-scrollbar {
          height: 0px;
        }
      `}</style>
    </div>
  );
};
export default Home;
