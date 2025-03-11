import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiX, FiPackage, FiClock, FiDollarSign, FiUser, FiCalendar, FiSearch, FiTrash2 } from "react-icons/fi";
import api from "../../config/axios_api";
import PropTypes from "prop-types";

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: FiClock },
    processing: { bg: "bg-blue-100", text: "text-blue-800", icon: FiPackage },
    completed: { bg: "bg-green-100", text: "text-green-800", icon: FiDollarSign },
    cancelled: { bg: "bg-red-100", text: "text-red-800", icon: FiX }
  };
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="w-4 h-4 mr-1.5" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

OrderStatusBadge.propTypes = {
  status: PropTypes.string.isRequired
};

const OrderRow = ({ order, onUpdateStatus, onViewDetails, onDelete }) => {
  const statusOptions = ["pending", "processing", "completed", "cancelled"];

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center">
              <span className="text-white font-medium">#{order.id}</span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              Order #{order.id}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <FiCalendar className="mr-1.5 h-4 w-4 text-gray-400" />
              {new Date(order.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <FiUser className="h-5 w-5 text-gray-400 mr-2" />
          <div>
            <div className="text-sm font-medium text-gray-900">{order.user.username}</div>
            <div className="text-sm text-gray-500">{order.user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          Ksh.{parseFloat(order.total_amount).toLocaleString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <OrderStatusBadge status={order.status} />
          <select
            value={order.status}
            onChange={(e) => onUpdateStatus(order.id, e.target.value)}
            className="text-sm rounded-lg border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewDetails(order)}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded-lg transition-colors duration-150"
          >
            <FiPackage className="mr-1.5 h-4 w-4" />
            View Details
          </button>
          <button
            onClick={() => onDelete(order.id)}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors duration-150"
          >
            <FiTrash2 className="mr-1.5 h-4 w-4" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

OrderRow.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    created_at: PropTypes.string.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired
    }).isRequired,
    status: PropTypes.string.isRequired,
    total_amount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]).isRequired
  }).isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

const OrderDetails = ({ order, onClose }) => {
  if (!order) return null;

  const items = order.order_items || [];

  const formatPrice = (price) => parseFloat(price).toLocaleString();

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Order #{order.id} Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Customer</p>
            <p className="font-medium">{order.user.username}</p>
            <p className="text-sm text-gray-500">{order.user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Order Date</p>
            <p className="font-medium">
              {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.product.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Ksh.{formatPrice(item.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Ksh.{formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="text-right">
            <div className="grid grid-cols-2 gap-x-8 text-right mb-2">
              <div>
                <p className="text-sm text-gray-500">Items Total</p>
                <p className="text-lg font-medium">Ksh.{formatPrice(items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-lg font-bold text-orange-600">Ksh.{formatPrice(order.total_amount)}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Order Status: <OrderStatusBadge status={order.status} /></p>
          </div>
        </div>
      </div>
    </div>
  );
};

OrderDetails.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    created_at: PropTypes.string.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired
    }).isRequired,
    status: PropTypes.string.isRequired,
    order_items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
      price: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]).isRequired,
      product: PropTypes.shape({
        title: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired
      }).isRequired
    })).isRequired,
    total_amount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]).isRequired
  }),
  onClose: PropTypes.func.isRequired
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    total_orders: 0,
    completed_orders: 0,
    pending_orders: 0,
    total_revenue: 0
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/admin/orders");
      if (response.data) {
        setOrders(response.data.orders || []);
        setStats(response.data.stats || {
          total_orders: 0,
          completed_orders: 0,
          pending_orders: 0,
          total_revenue: 0
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}`, { status: newStatus });
      toast.success("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status");
    }
  };

  const onViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      try {
        await api.delete(`/admin/orders/${orderId}`);
        toast.success("Order deleted successfully");
        fetchOrders(); // Refresh the orders list
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.error("Failed to delete order");
      }
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id.toString().includes(searchTerm) ||
    order.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-500">View and manage customer orders</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-xs text-gray-500 block">Total Orders</span>
                  <span className="text-lg font-medium text-gray-900">{stats.total_orders}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Completed</span>
                  <span className="text-lg font-medium text-green-600">
                    {stats.completed_orders}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Pending</span>
                  <span className="text-lg font-medium text-yellow-600">
                    {stats.pending_orders}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Revenue</span>
                  <span className="text-lg font-medium text-orange-600">
                    Ksh.{parseFloat(stats.total_revenue || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-96 pl-10 pr-4 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
          <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <OrderRow 
                  key={order.id} 
                  order={order} 
                  onUpdateStatus={handleUpdateStatus}
                  onViewDetails={onViewDetails}
                  onDelete={handleDeleteOrder}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default AdminOrders; 