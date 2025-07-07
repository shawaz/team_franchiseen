/**
 * Formats a number consistently across server and client
 * Uses Indian number format (e.g., 1,00,000)
 */
export function formatIndianNumber(num: number): string {
  // Convert to string and remove any existing commas
  const numStr = num.toString().replace(/,/g, '');
  
  // Split into integer and decimal parts
  const [intPart, decPart] = numStr.split('.');
  
  // Format the integer part with Indian grouping
  let formattedInt = '';
  let remaining = intPart;
  
  // Handle the last 3 digits
  if (remaining.length > 3) {
    formattedInt = ',' + remaining.slice(-3);
    remaining = remaining.slice(0, -3);
  } else {
    formattedInt = remaining;
    remaining = '';
  }
  
  // Handle the rest of the digits in groups of 2
  while (remaining.length > 0) {
    const group = remaining.slice(-2);
    formattedInt = (group.length === 2 ? ',' : '') + group + formattedInt;
    remaining = remaining.slice(0, -2);
  }
  
  // Add back decimal part if it exists
  return decPart ? `${formattedInt}.${decPart}` : formattedInt;
}

/**
 * Formats currency in Indian Rupees
 */
export function formatIndianCurrency(amount: number): string {
  return `₹${formatIndianNumber(amount)}`;
} 