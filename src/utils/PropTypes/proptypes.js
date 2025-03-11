import PropTypes from "prop-types";

export const myproductPropTypes = PropTypes.shape({
  title: PropTypes.string.isRequired, // Title must be a string and is required
  description: PropTypes.string.isRequired, // Description must be a string and is required
  price: PropTypes.number.isRequired, // Price must be a number and is required
  category: PropTypes.string.isRequired, // Category must be a string and is required
  image: PropTypes.string.isRequired, // Image URL must be a string and is required
  stock: PropTypes.number.isRequired, // Stock must be a number and is required
  ratingRate: PropTypes.number.isRequired, // Rating rate must be a number and is required
  ratingCount: PropTypes.number.isRequired, // Rating count must be a number and is required
});

export default {
  myproductPropTypes,
};
