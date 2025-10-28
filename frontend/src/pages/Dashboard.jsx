import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { salesAPI } from '../services/api';
import { format, subDays } from 'date-fns';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import SaleModal from '../components/SaleModal';
import './Dashboard.css';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: format(subDays(new Date(), 30), "yyyy-MM-dd'T'00:00"),
    endDate: format(new Date(), "yyyy-MM-dd'T'23:59"),
    page: 0,
    size: 100,
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  useEffect(() => {
    fetchSales();
  }, [filters]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await salesAPI.getSales(filters);
      setSales(response.data.content || []);
    } catch (error) {
      console.error('Error fetching sales:', error);
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await salesAPI.exportSales({
        startDate: filters.startDate,
        endDate: filters.endDate,
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sales_export_${format(new Date(), 'yyyyMMdd')}.csv`;
      link.click();
    } catch (error) {
      console.error('Error exporting sales:', error);
      alert('Failed to export sales. Admin role required.');
    }
  };

  const handleAddSale = () => {
    setSelectedSale(null);
    setShowModal(true);
  };

  const handleEditSale = (sale) => {
    setSelectedSale(sale);
    setShowModal(true);
  };

  const handleDeleteSale = async (id) => {
    if (!isAdmin()) {
      alert('Only admins can delete sales');
      return;
    }

    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await salesAPI.deleteSale(id);
        fetchSales(); // Refresh the list
      } catch (error) {
        console.error('Error deleting sale:', error);
        alert('Failed to delete sale. Admin role required.');
      }
    }
  };

  const handleModalSuccess = () => {
    fetchSales(); // Refresh the list after create/update
  };

  // Analytics calculations
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalSales = sales.length;
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Sales by category
  const categoryData = sales.reduce((acc, sale) => {
    const category = sale.productCategory;
    if (!acc[category]) {
      acc[category] = { name: category, value: 0 };
    }
    acc[category].value += sale.totalAmount;
    return acc;
  }, {});
  const categoryChartData = Object.values(categoryData);

  // Sales by region
  const regionData = sales.reduce((acc, sale) => {
    const region = sale.region;
    if (!acc[region]) {
      acc[region] = { name: region, sales: 0 };
    }
    acc[region].sales += sale.totalAmount;
    return acc;
  }, {});
  const regionChartData = Object.values(regionData);

  // Sales over time
  const dailySales = sales.reduce((acc, sale) => {
    const date = format(new Date(sale.saleDate), 'MM/dd');
    if (!acc[date]) {
      acc[date] = { date, revenue: 0, count: 0 };
    }
    acc[date].revenue += sale.totalAmount;
    acc[date].count += 1;
    return acc;
  }, {});
  const timeSeriesData = Object.values(dailySales).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Sales Dashboard</h1>
          <p>Welcome, {user?.username}!</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/products')} className="btn-products">
            📦 Products
          </button>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <div className="filters">
        <div className="filter-group">
          <label>Start Date:</label>
          <input
            type="datetime-local"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
        </div>
        <div className="filter-group">
          <label>End Date:</label>
          <input
            type="datetime-local"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>
        <button onClick={handleAddSale} className="btn-add">
          + Add New Sale
        </button>
        {isAdmin() && (
          <button onClick={handleExport} className="btn-export">
            Export CSV
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <p className="stat-value">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="stat-card">
              <h3>Total Sales</h3>
              <p className="stat-value">{totalSales}</p>
            </div>
            <div className="stat-card">
              <h3>Average Order Value</h3>
              <p className="stat-value">${averageOrderValue.toFixed(2)}</p>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <h3>Sales Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#667eea" name="Revenue" />
                  <Line type="monotone" dataKey="count" stroke="#764ba2" name="Orders" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Revenue by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card full-width">
              <h3>Sales by Region</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#667eea" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="sales-table">
            <h3>Recent Sales</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Customer</th>
                    <th>Region</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.slice(0, 20).map((sale) => (
                    <tr key={sale.id}>
                      <td>{format(new Date(sale.saleDate), 'MM/dd/yyyy HH:mm')}</td>
                      <td>{sale.productName}</td>
                      <td>{sale.productCategory}</td>
                      <td>{sale.customerName}</td>
                      <td>{sale.region}</td>
                      <td>{sale.quantity}</td>
                      <td>${sale.totalAmount.toFixed(2)}</td>
                      <td>{sale.paymentMethod}</td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => handleEditSale(sale)} className="btn-edit" title="Edit">
                            ✏️
                          </button>
                          {isAdmin() && (
                            <button onClick={() => handleDeleteSale(sale.id)} className="btn-delete" title="Delete">
                              🗑️
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <SaleModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSuccess}
        sale={selectedSale}
      />
    </div>
  );
};

export default Dashboard;
