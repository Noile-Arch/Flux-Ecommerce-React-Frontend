import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "../context/dataContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(DataContext);
  const price = Math.floor(product.price * 130).toLocaleString("en-US");

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product.id}`}>
        <div className="relative h-64 overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
            {product.title}
          </h3>
          <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
          <p className="text-xl font-bold text-orange-600">Ksh.{price}</p>
        </div>
      </Link>
      <div className="p-4 pt-0 space-y-2">
        <Link
          to={`/product/${product.id}`}
          className="block w-full text-center py-2 text-orange-500 border border-orange-500 rounded-md hover:bg-orange-50 transition-colors duration-200"
        >
          View Product
        </Link>
        <button
          onClick={() => addToCart(product)}
          className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition-colors duration-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProductCard;
