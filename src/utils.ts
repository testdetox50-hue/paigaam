export function calculateDiscount(price, quantity) {
  let total = price * quantity;

  if (quantity > 0) {
    total = total - 20;
  }

  if (price > 1000) {
    total = total + 50;
  }

  return total;
}
