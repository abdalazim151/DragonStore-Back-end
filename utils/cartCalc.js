export const calculateCartTotal = (cartItems) => {
  return cartItems.reduce((total, item) => {
    return total + item.price * item.quantity * item.product.price;
  }, 0);
};
