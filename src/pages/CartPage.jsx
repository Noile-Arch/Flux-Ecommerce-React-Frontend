import { useContext, useEffect, useState } from "react";
import CartCard from "../components/CartCard";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { DataContext } from "../context/dataContext";

const CartPage = () => {
  const { cart, notifications, handleCheckout } = useContext(DataContext);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (notifications && notifications !== "") {
      console.log(notifications);

      toast(notifications);
    }
  }, [notifications]);

  useEffect(() => {
    if (cart?.items?.length > 0) {
      const usd = cart.items.reduce((acc, item) => {
        return acc + item.price * item.quantity; // Use quantity to calculate
      }, 0);
      const ksh = Math.floor(usd * 130);

      setTotal(ksh.toLocaleString("en-US"));
    } else {
      setTotal(0); // Reset total if cart is empty
    }
  }, [cart]);

  const renderEmptyCart = () => (
    <div className="flex lg:w-[1300px] flex-col items-center  justify-center py-12 ">
      <div className="max-w-lg w-full text-center">
        <img
          src="/empty-cart.png"
          alt="empty cart"
          className="mx-auto h-48 w-48 object-cover"
        />
        <h2 className="mt-6 text-2xl font-bold text-gray-900">
          Your cart is empty
        </h2>
        <p className="mt-2 text-gray-600">
          Browse our categories and discover our best deals!
        </p>
        <Link
          to="/home"
          className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
        >
          Start Shopping
        </Link>
      </div>
    </div>
  );

  const renderCartSummary = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
      <h2 className="text-lg font-semibold text-gray-900 pb-4 border-b">
        Cart Summary
      </h2>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">Subtotal</p>
          <p className="text-xl font-semibold text-gray-900">Ksh {total}</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-700">
            Delivery fee not included yet
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800">
            Free Delivery Available
          </h3>
          <p className="mt-1 text-sm text-yellow-700">
            Flux Express items are eligible for free delivery
          </p>
        </div>

        <button
          onClick={() => handleCheckout(navigate, total)}
          className={`w-full py-4 px-4 rounded-lg text-white font-medium transition-all duration-200 
            ${total === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
            }`}
          disabled={total === 0}
        >
          Checkout (Ksh {total})
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            {cart?.items?.length > 0 ? (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <CartCard key={item.id} data={item} />
                ))}
              </div>
            ) : (
              renderEmptyCart()
            )}
          </div>

          {cart?.items?.length > 0 && (
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              {renderCartSummary()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
