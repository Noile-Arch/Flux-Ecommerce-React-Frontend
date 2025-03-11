import { useContext } from "react";
import { DataContext } from "../context/dataContext";
import ProductCard from "./ProductCard";

const NewProducts = () => {
  const { data } = useContext(DataContext);

  console.log("NewProducts component data:", data); // Add debug log

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <h2 className="text-2xl font-bold mb-8">New Arrivals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default NewProducts;
