import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../services/api';
import ProductModal from '../components/ProductModal';
import './Products.css';

const Products = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    if (!isAdmin()) {
      alert('Only admins can add products');
      return;
    }
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    if (!isAdmin()) {
      alert('Only admins can edit products');
      return;
    }
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!isAdmin()) {
      alert('Only admins can delete products');
      return;
    }

    if (window.confirm('Are you sure you want to delete this product? This may affect existing sales records.')) {
      try {
        await productsAPI.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const handleModalSuccess = () => {
    fetchProducts();
  };

  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <div className="products-page">
      <header className="dashboard-header">
        <div>
          <h1>Product Management</h1>
          <p>Manage your product catalog</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/dashboard')} className="btn-back">
            ← Back to Dashboard
          </button>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <div className="products-header">
        <div className="products-stats">
          <div className="stat-card">
            <h3>Total Products</h3>
            <p className="stat-value">{products.length}</p>
          </div>
          <div className="stat-card">
            <h3>Categories</h3>
            <p className="stat-value">{Object.keys(productsByCategory).length}</p>
          </div>
        </div>
        {isAdmin() && (
          <button onClick={handleAddProduct} className="btn-add">
            + Add New Product
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="products-grid">
          {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
            <div key={category} className="category-section">
              <h2>{category}</h2>
              <div className="products-table">
                <table>
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Price</th>
                      {isAdmin() && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {categoryProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>${product.price.toFixed(2)}</td>
                        {isAdmin() && (
                          <td>
                            <div className="action-buttons">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="btn-edit"
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="btn-delete"
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSuccess}
        product={selectedProduct}
      />
    </div>
  );
};

export default Products;
