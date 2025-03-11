import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import axios from "axios"; // Make sure to install axios if not already
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [show, setShow] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // Function to convert price from USD to KSH
  const convertToKsh = (usd) => {
    const ksh = Math.floor(usd * 130); // Conversion rate, adjust as necessary
    return ksh.toLocaleString("en-US");
  };

  const handleSearch = async () => {
    if (searchInput.trim()) {
      try {
        const response = await axios.get(
          `http://localhost:3000/products/search?query=${encodeURIComponent(
            searchInput
          )}`
        );

        // Convert prices to KSH for all the fetched products
        const convertedProducts = response.data.map((product) => ({
          ...product,
          priceInKsh: convertToKsh(product.price), // Adding the converted price
        }));

        setResults(convertedProducts); // Update the results with converted prices
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
  };

  const handleClose = (e) => {
    e.preventDefault();
    setShow(false);
  };

  const handleNavigate = (id) => {
    navigate(`/product/${id}`);
    setShow(false);
  };

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  return (
    <div className="relative">
      <button
        onClick={() => setShow(!show)}
        className="text-3xl font-bold text-[#ff6200] flex justify-center items-center"
      >
        <CiSearch />
      </button>

      {show && (
        <div className="w-full h-screen bg-black/60 fixed inset-0 z-50 p-20 flex flex-col items-center">
          <div className="bg-[#ff6200] w-full max-w-lg rounded-lg shadow-lg p-4">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search for products..."
              className="w-full px-4 py-2 bg-[#252525] text-white rounded"
            />
            <div className="w-full flex justify-around gap-4 items-center">
              <button
                onClick={handleSearch}
                className="mt-2 w-full bg-blue-500 py-2 rounded hover:opacity-80"
              >
                Search
              </button>
              <button
                onClick={handleClose}
                className="mt-2 w-[200px] bg-black text-[gold] py-2 rounded hover:opacity-80"
              >
                Close
              </button>
            </div>
          </div>

          {/* Display Search Results */}
          {results.length > 0 && (
            <div
              className="mt-4 w-full max-w-xl bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-lg rounded-lg overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-[#0d1137]"
              style={{
                maxHeight: "80vh",
                border: "2px solid #ff6200", // Orange border effect
              }}
            >
              {results.map((product) => (
                <button
                  key={product.search_key || `search-${product.id}-${Date.now()}`}
                  onClick={() => {
                    handleNavigate(product.id);
                  }}
                  className="w-full"
                >
                  <div
                    className="p-4 border-b border-gray-700 hover:bg-black/70 transition-all duration-300 flex items-center gap-4"
                    style={{
                      backdropFilter: "blur(6px)",
                      boxShadow: "0px 0px 10px #ff6200",
                    }}
                  >
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150'; // Fallback image
                        }}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <h2 className="text-xl text-yellow-400 font-semibold line-clamp-1">
                        {product.title}
                      </h2>
                      <p className="text-[#ff6200] text-lg">
                        Ksh {product.priceInKsh}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
