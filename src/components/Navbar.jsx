import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Search from "./Search";
import Cart from "./Cart";
import { IoMenu } from "react-icons/io5";
import { DataContext } from "../context/dataContext";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { handleLogout } = useContext(DataContext);
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full h-[80px] bg-[#edecec] z-50 absolute inset-0 backdrop-blur-sm text-black">
      <div className="w-full h-full flex xl:justify-around justify-between items-center px-4">
        {/* Logo Section */}
        <Link
          to={"/home"}
          className="flex justify-center items-center gap-4 text-white"
        >
          <img
            src="/flux.jpg"
            alt="logo"
            className="w-[60px] h-[60px] rounded-full"
          />
          <h1 className="text-3xl font-bold italic text-[#ff912a]">Flux</h1>
        </Link>

        {/* Desktop Menu */}
        <div className="md:flex hidden font-semibold justify-center items-center gap-10">
          <Link to="/category/men">Men</Link>
          <Link to="/category/women">Women</Link>
          <Link to="/category/electronics">Electronics</Link>
          <Link to="/category/jewelery">Jewelery</Link>
          <Link
            to="/orders"
            className="text-gray-600 hover:text-orange-500 transition-colors"
          >
            Order History
          </Link>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <motion.div
            className="absolute top-[80px] left-0 w-full bg-[#edecec] flex flex-col items-center gap-6 py-4 shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Link to={"/home"} onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/category/men" onClick={toggleMenu}>
              Men
            </Link>
            <Link to="/category/women" onClick={toggleMenu}>
              Women
            </Link>
            <Link to="/category/electronics" onClick={toggleMenu}>
              Electronics
            </Link>
            <Link to="/category/jewelery" onClick={toggleMenu}>
              Jewelery
            </Link>
          </motion.div>
        )}

        {/* Cart & Search Icons */}
        <div className="w-auto flex justify-end items-center gap-10">
          <Search />
          <Cart />
          {user?.is_admin && (
            <Link
              to="/admin"
              className="text-black hover:text-orange-500 transition-colors"
            >
              Admin
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="text-black hover:text-orange-500 transition-colors"
          >
            Logout
          </button>

          {/* Mobile Hamburger Icon */}
          <button
            onClick={toggleMenu}
            className="md:hidden block text-3xl font-bold text-black"
            style={{ zIndex: 999 }}
          >
            <IoMenu />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
