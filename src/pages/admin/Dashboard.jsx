import { useState, useEffect } from "react";
import {
  FiUsers,
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiCheck,
  FiEdit2,
} from "react-icons/fi";
import api from "../../config/axios_api";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { EditProductModal } from "./Products";

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
    <div className="flex justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend && (
          <p
            className={`text-sm mt-2 ${
              trend > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% from last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
      </div>
    </div>
  </div>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
  trend: PropTypes.number,
};

const RecentOrderCard = ({ order }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
        <p className="text-sm text-gray-500">{order.user.username}</p>
      </div>
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          order.status === "completed"
            ? "bg-green-100 text-green-800"
            : order.status === "pending"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {order.status}
      </span>
    </div>
    <div className="mt-2">
      <p className="text-sm font-medium text-gray-900">
        Ksh.{parseFloat(order.total_amount).toLocaleString()}
      </p>
      <p className="text-xs text-gray-500">
        {new Date(order.created_at).toLocaleDateString()}
      </p>
    </div>
  </div>
);

RecentOrderCard.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    total_amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    created_at: PropTypes.string.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const LowStockCard = ({ product, onEdit }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-medium text-gray-900">{product.title}</p>
        <p className="text-sm text-gray-500">Ksh.{(product.price * 130).toLocaleString()}</p>
      </div>
      <div className="flex items-center space-x-3">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          product.stock === 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}
        </span>
        <button
          onClick={() => onEdit(product)}
          className="inline-flex items-center p-1.5 text-sm font-medium text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded-lg transition-colors duration-150"
        >
          <FiEdit2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

LowStockCard.propTypes = {
  product: PropTypes.shape({
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired
  }).isRequired,
  onEdit: PropTypes.func.isRequired
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    lowStockProducts: 0,
    lowStockItems: [],
    trends: {
      users: 0,
      orders: 0,
      revenue: 0
    }
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, ordersResponse] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/orders?limit=5"),
      ]);
      setStats(statsResponse.data);
      setRecentOrders(ordersResponse.data.orders || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers || 0,
      icon: FiUsers,
      color: "bg-blue-500",
      trend: stats.trends?.users,
    },
    {
      title: "Total Products",
      value: stats.totalProducts || 0,
      icon: FiPackage,
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders || 0,
      icon: FiShoppingBag,
      color: "bg-purple-500",
      trend: stats.trends?.orders,
    },
    {
      title: "Revenue",
      value: `Ksh.${(stats.revenue || 0).toLocaleString()}`,
      icon: FiDollarSign,
      color: "bg-orange-500",
      trend: stats.trends?.revenue,
      description: "From completed orders only"
    },
  ];

  const additionalStats = [
    {
      title: "Pending Orders",
      value: stats.pendingOrders || 0,
      icon: FiClock,
      color: "bg-yellow-500",
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders || 0,
      icon: FiCheck,
      color: "bg-green-500",
    },
    {
      title: "Low Stock Products",
      value: stats.lowStockProducts || 0,
      icon: FiTrendingUp,
      color: "bg-red-500",
    },
  ];

  const handleEditProduct = async (updatedProduct) => {
    try {
      await api.put(`/admin/products/${updatedProduct.id}`, updatedProduct);
      toast.success("Product updated successfully");
      fetchDashboardData(); // Refresh the data
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error updating product");
    }
  };

  const onEdit = (product) => {
    setEditingProduct({
      id: product.id,
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      stock: product.stock
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome to your admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 text-black gap-6 mb-8">
        {additionalStats.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <Link
              to="/admin/orders"
              className="text-sm text-orange-600 hover:text-orange-700"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders?.map((order) => (
              <RecentOrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Low Stock Products
            </h2>
            <Link
              to="/admin/products"
              className="text-sm text-orange-600 hover:text-orange-700"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {stats.lowStockItems?.map((product) => (
              <LowStockCard 
                key={product.id} 
                product={product} 
                onEdit={onEdit}
              />
            ))}
            {!stats.lowStockItems?.length && (
              <p className="text-center text-gray-500">No low stock products</p>
            )}
          </div>
        </div>
      </div>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleEditProduct}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
