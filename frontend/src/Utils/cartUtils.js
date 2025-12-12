export const addDecimals = (num) => {
  return Number((Math.round(num * 100) / 100).toFixed(2));
};

export const updateCart = (state) => {
  // Convert all calculations to numbers (not strings)
  const itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  state.itemsPrice = addDecimals(itemsPrice);

  // Shipping: free after 100
  state.shippingPrice = state.itemsPrice > 100 ? 0 : 10;

  // Tax: 15%
  state.taxPrice = addDecimals(0.15 * state.itemsPrice);

  // Total price
  state.totalPrice =
    state.itemsPrice + state.shippingPrice + state.taxPrice;

  // Store ONLY the serializable state fields
  const serializedCart = {
    cartItems: state.cartItems,
    itemsPrice: state.itemsPrice,
    shippingPrice: state.shippingPrice,
    taxPrice: state.taxPrice,
    totalPrice: state.totalPrice,
    shippingAddress: state.shippingAddress,
    paymentMethod: state.paymentMethod,
  };

  localStorage.setItem("cart", JSON.stringify(serializedCart));

  return state;
};
