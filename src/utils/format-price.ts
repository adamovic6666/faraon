export const formatPrice = (number?: number) => {
  const formatted = number ? number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) : "0.00";
  return formatted;
};
