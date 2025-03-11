import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import { MdAddShoppingCart } from "react-icons/md";
import api from "../config/axios_api";
import { DataContext } from "../context/dataContext";

import "react-toastify/dist/ReactToastify.css"; // Import the toastify CSS

const ProductPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(DataContext);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async (productId) => {
      try {
        setError(null);
        const response = await api.get(`/products/${productId}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error.response?.data?.error || "Product not found");
        setData(null);
      }
    };

    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  useEffect(() => {
    if (data) {
      const usd = data.price;
      const ksh = Math.floor(usd * 130);
      setPrice(ksh.toLocaleString("en-US"));
    }
  }, [data]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
          <button
            onClick={() => navigate('/home')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <>
      {data && (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
              {/* Product Image */}
              <div className="aspect-square bg-white rounded-2xl p-8 shadow-sm">
                <div className="h-full w-full flex items-center justify-center">
                  <img
                    src={data.image}
                    alt={data.title}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>

              {/* Product Details */}
              <div className="mt-8 lg:mt-0">
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  {data.title}
                </h1>

                {/* Preview of description */}
                <p className="mt-4 text-gray-600 line-clamp-2 text-sm">
                  {data.description}
                </p>

                <div className="mt-6">
                  <div className="flex items-center space-x-4">
                    <StarRating rating={data.ratingRate} />
                    <span className="text-sm text-gray-500">
                      ({data.ratingCount} reviews)
                    </span>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-4xl font-bold text-gray-900">
                      Ksh {price}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                      + delivery from KSh 69
                      <span className="text-green-600 font-medium">
                        (free delivery if order above KSh 1,999)
                      </span>
                    </p>
                  </div>

                  {/* Stock Status */}
                  <div className="mt-6">
                    {data.stock > 0 ? (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                        In stock - {data.stock} units
                      </div>
                    ) : (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                        Out of stock
                      </div>
                    )}
                  </div>

                  {/* Quantity Selector */}
                  <div className="mt-8 flex items-center">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mr-4">
                      Quantity
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                        disabled={quantity <= 1}
                        className="p-2 text-gray-600 hover:text-orange-500 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      <span className="px-4 py-2 text-gray-900 text-center w-12">
                        {quantity}
                      </span>
                      
                      <button
                        onClick={() => quantity < data.stock && setQuantity(quantity + 1)}
                        disabled={quantity >= data.stock}
                        className="p-2 text-gray-600 hover:text-orange-500 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <span className="ml-4 text-sm text-gray-500">
                      {data.stock} available
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="mt-8">
                    <button
                      onClick={() => addToCart(data, quantity, navigate)}
                      disabled={data.stock === 0}
                      className={`w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white 
                        ${data.stock === 0 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'} 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200`}
                    >
                      <MdAddShoppingCart className="text-2xl mr-2" />
                      {data.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Product Description */}
            <div className="mt-6">
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Product Description
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {data.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPage;
