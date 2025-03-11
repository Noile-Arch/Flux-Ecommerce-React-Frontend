import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { DataContext } from "../context/dataContext";

const CartCard = ({ data }) => {
  const { removeFromCart } = useContext(DataContext);
  const [price, setPrice] = useState(null);

  useEffect(() => {
    if (data) {
      const usd = data.price;
      const ksh = Math.floor(usd * 130);
      setPrice(ksh.toLocaleString("en-US"));
    }
  }, [data]);

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4 hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex items-start space-x-4">
          <div className="relative group">
            <img
              src={data.image}
              alt={data.title}
              className="w-24 h-24 object-contain rounded-lg bg-gray-50 p-2 transition-transform duration-200 group-hover:scale-105"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 font-medium line-clamp-2 text-sm">
              {data.title}
            </h3>
            
            <div className="mt-1 flex items-center">
              {data.quantity > 0 ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Qty: {data.quantity}
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Out of stock
                </span>
              )}
            </div>
            
            <div className="mt-2 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">
                Ksh {price}
              </h4>
              
              <button
                onClick={() => removeFromCart(data.id)}
                className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200"
              >
                <MdOutlineDeleteOutline className="w-5 h-5 mr-1" />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CartCard.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    ratingRate: PropTypes.number.isRequired,
    ratingCount: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
};

export default CartCard;
