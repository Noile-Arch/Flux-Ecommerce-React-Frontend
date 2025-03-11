import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";

import { useContext, useEffect, useState } from "react";
import { DataContext } from "../context/dataContext";

const Cart = () => {
  const { cart } = useContext(DataContext);
  const [cartLength, setCartLength] = useState(0);

  useEffect(() => {
    // Use optional chaining to handle cases where cart or cart.items is undefined
    setCartLength(cart?.items?.length || 0);
  }, [cart]);

  return (
    <div className="h-full text-[#ff6200]">
      <Link to={"/cart"} className="h-full text-4xl relative">
        <AiOutlineShoppingCart />
        <div className="w-full h-full absolute inset-0 flex justify-end">
          <p className="w-[15px] h-[15px] bg-[#59d22d] text-[#000000] text-[12px] font-bold flex justify-center items-center rounded-full">
            {cartLength}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default Cart;
