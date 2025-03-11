import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "../config/axios_api";
import { useAuth } from "../hooks/useAuth";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [cart, setCart] = useState(null);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState("");
  const { token } = useAuth();

  // Fetch product data
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const response = await api.get("/products");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setNotifications("Failed to load products");
        setTimeout(() => setNotifications(""), 5000);
      }
    };

    fetchData();
  }, [token]);

  // Fetch cart data
  const fetchCart = async () => {
    if (!token) return;

    try {
      const response = await api.get("/carts");
      if (response.data && response.data.items) {
        setCart(response.data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setNotifications("Failed to load cart");
      setTimeout(() => setNotifications(""), 5000);
    }
  };

  useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  const addToCart = async (product, quantity = 1, navigate) => {
    try {
      const response = await api.post("/carts/add_to_cart", {
        product_id: product.id,
        quantity: quantity,
      });

      if (response.data) {
        setNotifications(response.data.message);
        await fetchCart(); // Refresh cart after adding item
        if (navigate) navigate("/cart");
      }
    } catch (error) {
      console.log(error);
      setNotifications(
        error.response?.data?.error || "Failed to add item to cart"
      );
    } finally {
      setTimeout(() => setNotifications(""), 5000);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const response = await api.delete(
        `/carts/remove_from_cart/${cartItemId}`
      );
      if (response.data) {
        setNotifications(response.data.message);
        await fetchCart(); // Refresh cart after removing item
      }
    } catch (error) {
      console.log(error);
      setNotifications("Failed to remove item from cart");
    } finally {
      setTimeout(() => setNotifications(""), 5000);
    }
  };

  const clearCart = async () => {
    try {
      const response = await api.delete("/carts/clear_cart");
      if (response.data) {
        setNotifications(response.data.message);
        await fetchCart();
      }
    } catch (error) {
      console.log(error);
      setNotifications("Failed to clear cart");
    } finally {
      setTimeout(() => setNotifications(""), 5000);
    }
  };

  // Add fetchOrders function
  const fetchOrders = async () => {
    if (!token) return;

    try {
      const response = await api.get("/orders");
      if (response.data && response.data.orders) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setNotifications("Failed to load orders");
      setTimeout(() => setNotifications(""), 5000);
    }
  };

  // Add these functions before the value object
  const handleCheckout = async (navigate, total) => {
    try {
      const response = await api.post("/orders", {
        total_amount: total,
        cart_items: cart.items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price * 130,
        })),
      });

      if (response.data.message === "Order placed successfully!") {
        setNotifications("Order placed successfully!");
        setOrders((prev) => [response.data.order, ...prev]);
        await fetchCart();
        if (navigate) navigate("/orders");
      }
    } catch (error) {
      setNotifications(error.response?.data?.error || "Failed to place order");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await api.patch(`/orders/${orderId}/update_status`, {
        status,
      });
      if (response.data.message === "Order status updated successfully") {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: status } : order
          )
        );
        setNotifications(`Order #${orderId} marked as ${status}`);
      }
    } catch (error) {
      setNotifications(
        error.response?.data?.error || "Failed to update order status"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCart(null);
    setOrders([]);
    setNotifications("Logged out successfully");
    window.location.href = "/";
  };

  const deleteOrder = async (orderId) => {
    try {
      const response = await api.delete(`/orders/${orderId}`);
      if (response.data.message === "Order deleted successfully") {
        setOrders((prev) => prev.filter((order) => order.id !== orderId));
        setNotifications("Order deleted successfully");
      }
    } catch (error) {
      setNotifications(error.response?.data?.error || "Failed to delete order");
    } finally {
      setTimeout(() => setNotifications(""), 5000);
    }
  };

  // Value object
  const value = {
    data,
    cart,
    orders,
    notifications,
    addToCart,
    removeFromCart,
    clearCart,
    fetchCart,
    fetchOrders,
    handleCheckout,
    handleLogout,
    updateOrderStatus,
    deleteOrder,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
