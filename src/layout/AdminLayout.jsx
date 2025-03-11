import { useState } from "react";
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import {
  FiUsers,
  FiPackage,
  FiBarChart2,
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
  FiShoppingBag,
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useContext } from "react";
import { DataContext } from "../context/dataContext";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { handleLogout } = useContext(DataContext);

  if (!user?.is_admin) {
    return <Navigate to="/home" replace />;
  }

  const menuItems = [
    {
      path: "/admin/dashboard",
      name: "Dashboard",
      icon: <FiBarChart2 className="text-xl" />,
    },
    {
      path: "/admin/products",
      name: "Products",
      icon: <FiPackage className="text-xl" />,
    },
    {
      path: "/admin/orders",
      name: "Orders",
      icon: <FiShoppingBag className="text-xl" />,
    },
    {
      path: "/admin/users",
      name: "Users",
      icon: <FiUsers className="text-xl" />,
    },
    {
      path: "/admin/settings",
      name: "Settings",
      icon: <FiSettings className="text-xl" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-white min-h-screen fixed transition-all duration-300 ease-in-out shadow-lg flex flex-col justify-between`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b bg-gradient-to-r from-orange-500 to-orange-600">
          {!collapsed && (
            <span className="text-xl font-semibold text-white">
              Admin Panel
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-orange-600 text-white"
          >
            {collapsed ? <FiMenu size={20} /> : <FiX size={20} />}
          </button>
        </div>

        <nav className="mt-6 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors duration-200 ${
                location.pathname === item.path
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-600 hover:bg-gray-50"
              } ${collapsed ? "justify-center" : "gap-4"}`}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 ${
              collapsed ? "justify-center" : "gap-4"
            }`}
          >
            <FiLogOut className="text-xl" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 ${
          collapsed ? "ml-20" : "ml-64"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
