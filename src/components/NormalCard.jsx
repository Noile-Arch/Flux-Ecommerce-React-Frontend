import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const NormalCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="w-[240px] h-[320px] rounded-[16px] relative bg-[#ffffff] mt-4 hover:scale-105 ease-in-out transition-transform delay-100 duration-300 hover:animate-pulse"
    >
      <img
        src={product.image}
        alt="product"
        className="w-fll h-full object-contain rounded-[12px]"
      />
      <div className="w-full rounded-[16px] px-2 h-full flex flex-col justify-end items-center absolute inset-0 hover:bg-black/20  bg-gradient-to-b from-transparent to-black/80 from-10% to-70% ">
        <h1 className="line-clamp-3 text-sm">{product.title}</h1>

        <button className="px-4 my-2 w-[150px] py-2 rounded-3xl bg-[#ff8800] font-bold">
          Add to cart
        </button>
      </div>
    </Link>
  );
};

NormalCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    ratingRate: PropTypes.number.isRequired,
    ratingCount: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
  }).isRequired,
};
export default NormalCard;
