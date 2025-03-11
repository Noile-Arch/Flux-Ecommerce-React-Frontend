import { useParams } from "react-router-dom";
import CategoryPage from "./CategoryPage";

const CategoryPageWrapper = () => {
  const { category } = useParams();
  
  const categoryMap = {
    'men': "men's clothing",
    'mens': "men's clothing",
    'women': "women's clothing",
    'womens': "women's clothing",
    'electronics': "electronics",
    'jewelery': "jewelery"
  };

  const actualCategory = categoryMap[category] || category;
  
  const titles = {
    "men's clothing": {
      title: "Men's Fashion",
      subtitle: "Elevate your wardrobe with our curated collection of men's essentials"
    },
    "women's clothing": {
      title: "Women's Fashion",
      subtitle: "Discover the latest trends in women's fashion and express your unique style"
    },
    "electronics": {
      title: "Electronics",
      subtitle: "Explore our range of cutting-edge electronics"
    },
    "jewelery": {
      title: "Jewelry",
      subtitle: "Find the perfect piece to complement your style"
    }
  };

  const { title, subtitle } = titles[actualCategory] || {
    title: category?.charAt(0).toUpperCase() + category?.slice(1),
    subtitle: "Explore our collection"
  };

  return (
    <CategoryPage 
      category={actualCategory}
      title={title}
      subtitle={subtitle}
    />
  );
};

export default CategoryPageWrapper; 