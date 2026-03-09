import { getCarts } from "@/actions/server/cart";
import React from "react";

const CartPage = async () => {
  const cartItems = await getCarts();

  return (
    <div>
      <h2>{cartItems.length}</h2>
    </div>
  );
};

export default CartPage;
