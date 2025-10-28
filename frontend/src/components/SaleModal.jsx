import { useState, useEffect } from 'react';
import { salesAPI, productsAPI } from '../services/api';
import './SaleModal.css';

const SaleModal = ({ isOpen, onClose, onSuccess, sale }) => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    totalAmount: '',
    saleDate: '',
    customerName: '',
    region: '',
    paymentMethod: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      if (sale) {
        // Editing existing sale
        setFormData({
          productId: sale.productId,
          quantity: sale.quantity,
          totalAmount: sale.totalAmount,
          saleDate: sale.saleDate.substring(0, 16), // Format for datetime-local
          customerName: sale.customerName || '',
          region: sale.region || '',
          paymentMethod: sale.paymentMethod || '',
        });
      } else {
        // Creating new sale
        resetForm();
      }
    }
  }, [isOpen, sale]);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const resetForm = () => {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    setFormData({
      productId: '',
      quantity: '1',
      totalAmount: '',
      saleDate: localDateTime,
      customerName: '',
      region: 'North',
      paymentMethod: 'Credit Card',
    });
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.productId) newErrors.productId = 'Product is required';
    if (!formData.quantity || formData.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
    if (!formData.totalAmount || formData.totalAmount <= 0) newErrors.totalAmount = 'Amount must be positive';
    if (!formData.saleDate) newErrors.saleDate = 'Sale date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const saleData = {
        ...formData,
        productId: parseInt(formData.productId),
        quantity: parseInt(formData.quantity),
        totalAmount: parseFloat(formData.totalAmount),
        saleDate: formData.saleDate + ':00', // Add seconds
      };

      if (sale) {
        await salesAPI.updateSale(sale.id, saleData);
      } else {
        await salesAPI.createSale(saleData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving sale:', error);
      alert(error.response?.data?.message || 'Failed to save sale');
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    setFormData({ ...formData, productId });

    // Auto-calculate total if quantity is entered
    if (productId && formData.quantity) {
      const product = products.find((p) => p.id === parseInt(productId));
      if (product) {
        const total = product.price * parseFloat(formData.quantity);
        setFormData((prev) => ({ ...prev, totalAmount: total.toFixed(2) }));
      }
    }
  };

  const handleQuantityChange = (e) => {
    const quantity = e.target.value;
    setFormData({ ...formData, quantity });

    // Auto-calculate total if product is selected
    if (formData.productId && quantity) {
      const product = products.find((p) => p.id === parseInt(formData.productId));
      if (product) {
        const total = product.price * parseFloat(quantity);
        setFormData((prev) => ({ ...prev, totalAmount: total.toFixed(2) }));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{sale ? 'Edit Sale' : 'Add New Sale'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="sale-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="productId">Product *</label>
              <select
                id="productId"
                value={formData.productId}
                onChange={handleProductChange}
                className={errors.productId ? 'error' : ''}
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price}
                  </option>
                ))}
              </select>
              {errors.productId && <span className="error-text">{errors.productId}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleQuantityChange}
                className={errors.quantity ? 'error' : ''}
              />
              {errors.quantity && <span className="error-text">{errors.quantity}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="totalAmount">Total Amount *</label>
              <input
                type="number"
                id="totalAmount"
                step="0.01"
                min="0"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                className={errors.totalAmount ? 'error' : ''}
              />
              {errors.totalAmount && <span className="error-text">{errors.totalAmount}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="saleDate">Sale Date *</label>
              <input
                type="datetime-local"
                id="saleDate"
                value={formData.saleDate}
                onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
                className={errors.saleDate ? 'error' : ''}
              />
              {errors.saleDate && <span className="error-text">{errors.saleDate}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="customerName">Customer Name</label>
              <input
                type="text"
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="region">Region</label>
              <select
                id="region"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              >
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Saving...' : sale ? 'Update Sale' : 'Create Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleModal;
