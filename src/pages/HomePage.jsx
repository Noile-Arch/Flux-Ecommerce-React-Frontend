import ProductCarousel from "../components/carousel";
import NewProducts from "../components/NewProducts";
import { useContext } from "react";
import { DataContext } from "../context/dataContext";

const HomePage = () => {
  const { data } = useContext(DataContext);

  console.log("HomePage data:", data);

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24">
      <div className="container mx-auto px-4">
        <ProductCarousel />
        <NewProducts />
      </div>
    </div>
  );
};

export default HomePage;
