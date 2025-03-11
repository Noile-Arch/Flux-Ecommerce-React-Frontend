// import api from "../config/axios_api";

// const useCart = () => {
//   const navigate = useNavigate();
//   const [cart, setCart] = useState(null);
//   const [notifications, setNotifications] = useState("");

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const fetchCart = async () => {
//     try {
//       const response = await api.get("/carts");
//       setCart(response.data);
//     } catch (error) {
//       console.error("Error fetching cart:", error);
//       setNotifications("Failed to load cart data.");
//     }
//   };

//   const addToCart = async (product, quantity = 1) => {
//     try {
//       const response = await api.post("/carts/add_to_cart", {
//         product_id: product.id,
//         quantity: quantity,
//       });

//       if (response.data) {
//         setNotifications(`Item "${product.title}" added to cart!`);
//         fetchCart();
//         navigate("/cart");
//       } else {
//         setNotifications("Failed to add item to cart.");
//       }
//     } catch (error) {
//       console.error("Error adding item to cart:", error);
//       setNotifications("Failed to add item to cart.");
//     }
//   };
// };
