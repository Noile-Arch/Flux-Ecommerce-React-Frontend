import PropTypes from "prop-types";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating }) => {
  const totalStars = 5;

  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span key={index}>
            {rating >= starValue ? (
              <FaStar className="text-yellow-500 text-xl" />
            ) : rating >= starValue - 0.5 ? (
              <FaStarHalfAlt className="text-yellow-500 text-xl" />
            ) : (
              <FaRegStar className="text-yellow-500 text-xl" />
            )}
          </span>
        );
      })}
    </div>
  );
};
StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

export default StarRating;
