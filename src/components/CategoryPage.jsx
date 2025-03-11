import { useEffect, useState } from "react";
import NormalCard from "./NormalCard";
import api from "../config/axios_api";
import PropTypes from 'prop-types';

const CategoryPage = ({ category, title, subtitle }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get(
          `http://localhost:3000/products/category/${category}`
        );
        setItems(response.data);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [category]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="relative h-[300px] bg-gray-900">
        <div className="absolute inset-0 bg-cover bg-center opacity-30"
             style={{ backgroundImage: `url(/images/${category}-banner.jpg)` }} />
        <div className="relative h-full flex flex-col justify-center items-center text-white px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-lg md:text-xl max-w-2xl">{subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product) => (
              <NormalCard product={product} key={product.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

CategoryPage.propTypes = {
  category: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired
};

export default CategoryPage;
