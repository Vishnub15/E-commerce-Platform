import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, Product } from '../context/StoreContext';
import { DollarSign, ShoppingBag, Users, Plus, Edit, Trash2, ShieldAlert, Package, Check, Truck } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    user,
    products,
    allOrders,
    usersList,
    fetchAdminOrders,
    fetchAdminUsers,
    fetchProducts,
    updateOrderToDelivered,
    adminCreateProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    showToast,
  } = useStore();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'users'>('products');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields for Product Create/Edit
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [countInStock, setCountInStock] = useState('');

  // Validate admin role
  useEffect(() => {
    if (!user || !user.isAdmin) {
      showToast('Access denied. Administrator privileges required.', 'error');
      navigate('/login');
    } else {
      fetchProducts();
      fetchAdminOrders();
      fetchAdminUsers();
    }
  }, [user, navigate]);

  // Open Create Modal
  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setDescription('');
    setCategory('Audio');
    setImage('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800');
    setCountInStock('10');
    setShowProductModal(true);
  };

  // Open Edit Modal
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setDescription(product.description);
    setCategory(product.category);
    setImage(product.image);
    setCountInStock(product.countInStock.toString());
    setShowProductModal(true);
  };

  // Handle Product Form Submit
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !description || !category || !image || !countInStock) {
      showToast('All fields are required', 'error');
      return;
    }

    const payload = {
      name,
      price: parseFloat(price),
      description,
      category,
      image,
      countInStock: parseInt(countInStock, 10),
    };

    let success = false;
    if (editingProduct) {
      success = await adminUpdateProduct(editingProduct.id, payload);
    } else {
      success = await adminCreateProduct(payload);
    }

    if (success) {
      setShowProductModal(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await adminDeleteProduct(id);
    }
  };

  if (!user || !user.isAdmin) return null;

  // Calculate Overview Stats
  const totalRevenue = allOrders.reduce((acc, order) => acc + Number(order.totalAmount), 0);
  const salesCount = allOrders.length;
  const productsCount = products.length;
  const usersCount = usersList.length;

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      
      {/* Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '40px',
      }}>
        <ShieldAlert size={28} color="var(--color-primary-light)" />
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
          Admin Management Center
        </h1>
      </div>

      {/* Stats Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px',
        marginBottom: '40px',
      }}>
        {/* Rev Card */}
        <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(6,182,212,0.1)', color: 'var(--color-secondary)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>TOTAL REVENUE</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              ${totalRevenue.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Orders Card */}
        <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(99,102,241,0.1)', color: 'var(--color-primary-light)' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>ORDERS FULFILLED</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              {salesCount}
            </span>
          </div>
        </div>

        {/* Products Card */}
        <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(217,70,239,0.1)', color: 'var(--color-accent)' }}>
            <Package size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>ITEMS IN CATALOG</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              {productsCount}
            </span>
          </div>
        </div>

        {/* Users Card */}
        <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', color: '#ffffff' }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>REGISTERED USERS</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              {usersCount}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '30px',
        gap: '24px',
      }}>
        {(['products', 'orders', 'users'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 8px',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              borderBottom: '2px solid',
              borderColor: activeTab === tab ? 'var(--color-primary-light)' : 'transparent',
              color: activeTab === tab ? '#ffffff' : 'var(--text-muted)',
              transition: 'var(--transition-fast)',
              textTransform: 'capitalize',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="glass" style={{ padding: '30px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Catalog Directory</h3>
            <button className="btn btn-primary" onClick={openCreateModal} style={{ fontSize: '0.85rem', padding: '10px 18px' }}>
              <Plus size={16} />
              <span>Add New Product</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px' }}>Image</th>
                  <th style={{ padding: '12px 16px' }}>Name</th>
                  <th style={{ padding: '12px 16px' }}>Category</th>
                  <th style={{ padding: '12px 16px' }}>Price</th>
                  <th style={{ padding: '12px 16px' }}>Stock</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id} style={{ borderBottom: '1px solid var(--border-color)' }} className="table-row">
                    <td style={{ padding: '12px 16px' }}>
                      <img src={prod.image} alt={prod.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{prod.name}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{prod.category}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-secondary)', fontWeight: 600 }}>${Number(prod.price).toFixed(2)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${prod.countInStock <= 5 ? 'badge-warning' : 'badge-success'}`}>
                        {prod.countInStock} Units
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => openEditModal(prod)}
                          style={{ color: 'var(--color-primary-light)', padding: '6px', cursor: 'pointer' }}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          style={{ color: '#fca5a5', padding: '6px', cursor: 'pointer' }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Contents: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="glass" style={{ padding: '30px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px' }}>System Sales Log</h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px' }}>ID</th>
                  <th style={{ padding: '12px 16px' }}>Date</th>
                  <th style={{ padding: '12px 16px' }}>Total Price</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action Toggle</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.map((ord) => (
                  <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>#{ord.id.substring(0, 8).toUpperCase()}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{new Date(ord.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>${Number(ord.totalAmount).toFixed(2)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${ord.status.toLowerCase() === 'delivered' ? 'badge-success' : ord.status.toLowerCase() === 'shipped' ? 'badge-warning' : 'badge-info'}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      {ord.status !== 'Delivered' && (
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          {ord.status === 'Paid' && (
                            <button
                              onClick={() => updateOrderToDelivered(ord.id, 'Shipped')}
                              className="btn btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '0.75rem', gap: '4px', borderRadius: '4px' }}
                            >
                              <Truck size={12} />
                              Ship
                            </button>
                          )}
                          <button
                            onClick={() => updateOrderToDelivered(ord.id, 'Delivered')}
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.75rem', gap: '4px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#34d399' }}
                          >
                            <Check size={12} />
                            Deliver
                          </button>
                        </div>
                      )}
                      {ord.status === 'Delivered' && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fulfilled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Contents: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="glass" style={{ padding: '30px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px' }}>Registered Accounts</h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px' }}>User ID</th>
                  <th style={{ padding: '12px 16px' }}>Full Name</th>
                  <th style={{ padding: '12px 16px' }}>Email</th>
                  <th style={{ padding: '12px 16px' }}>Authorization Level</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((usr) => (
                  <tr key={usr.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{usr.id}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{usr.name}</td>
                    <td style={{ padding: '12px 16px' }}>{usr.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${usr.isAdmin ? 'badge-warning' : 'badge-info'}`}>
                        {usr.isAdmin ? 'Administrator' : 'Customer'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRODUCT CREATION/EDITING MODAL FORM */}
      {showProductModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }} onClick={() => setShowProductModal(false)}>
          
          <div className="glass animate-fade-in" style={{
            maxWidth: '550px',
            width: '100%',
            borderRadius: 'var(--radius-lg)',
            padding: '30px',
            background: '#0d121f',
            border: '1px solid var(--border-color)',
          }} onClick={(e) => e.stopPropagation()}>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>
              {editingProduct ? 'Edit Product Details' : 'Introduce New Product'}
            </h2>

            <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px' }}>
                {/* Category Selection */}
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border-color)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      width: '100%',
                      color: 'var(--text-main)',
                      outline: 'none',
                    }}
                  >
                    <option value="Audio" style={{ background: '#121826' }}>Audio</option>
                    <option value="Wearables" style={{ background: '#121826' }}>Wearables</option>
                    <option value="Accessories" style={{ background: '#121826' }}>Accessories</option>
                    <option value="Lifestyle" style={{ background: '#121826' }}>Lifestyle</option>
                  </select>
                </div>

                {/* Name */}
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Product Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Price */}
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                {/* Stock */}
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Initial Stock</label>
                  <input
                    type="number"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Description Specs</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  required
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      <style>{`
        .table-row {
          transition: background var(--transition-fast);
        }
        .table-row:hover {
          background: rgba(255,255,255,0.01);
        }
      `}</style>
    </div>
  );
};
export default AdminDashboard;
