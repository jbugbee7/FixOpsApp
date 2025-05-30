
export const calculateFinalPrice = (cost: number, markup: number = 75): number => {
  return cost * (1 + markup / 100);
};

export const getTotalPartsValue = (parts: Array<{ final_price: number; quantity: number }>): number => {
  return parts.reduce((total, part) => total + (part.final_price * part.quantity), 0);
};
