/**
 * Franchise calculation utilities
 * Ensures consistent calculations across the application
 */

// Fixed share price in AED
export const FIXED_AED_PER_SHARE = 10;

/**
 * Calculate total shares based on total investment
 * @param totalInvestment - Total investment amount in AED
 * @returns Number of total shares (rounded down to whole number)
 */
export function calculateTotalShares(totalInvestment: number): number {
  if (!totalInvestment || totalInvestment <= 0) {
    return 1; // Minimum 1 share
  }
  return Math.max(1, Math.floor(totalInvestment / FIXED_AED_PER_SHARE));
}

/**
 * Calculate available shares for investment
 * @param totalInvestment - Total investment amount in AED
 * @param soldShares - Number of shares already sold
 * @returns Number of available shares
 */
export function calculateAvailableShares(totalInvestment: number, soldShares: number = 0): number {
  const totalShares = calculateTotalShares(totalInvestment);
  return Math.max(0, totalShares - soldShares);
}

/**
 * Calculate share price (should always be FIXED_AED_PER_SHARE, but included for consistency)
 * @param totalInvestment - Total investment amount in AED
 * @param totalShares - Total number of shares (optional, will be calculated if not provided)
 * @returns Price per share in AED
 */
export function calculateSharePrice(totalInvestment: number, totalShares?: number): number {
  // Always return fixed price, but validate the calculation
  const calculatedShares = totalShares || calculateTotalShares(totalInvestment);
  const calculatedPrice = totalInvestment / calculatedShares;

  // If the calculated price is significantly different from fixed price, log a warning
  if (Math.abs(calculatedPrice - FIXED_AED_PER_SHARE) > 0.01) {
    console.warn(`Share price mismatch: calculated ${calculatedPrice.toFixed(2)}, expected ${FIXED_AED_PER_SHARE}`);
  }

  return FIXED_AED_PER_SHARE;
}

/**
 * Validate and fix franchise data to ensure consistent calculations
 * @param franchiseData - Raw franchise data
 * @returns Fixed franchise data with correct calculations
 */
export function validateFranchiseData(franchiseData: {
  totalInvestment?: number;
  totalShares?: number;
  soldShares?: number;
  costPerShare?: number;
}) {
  const totalInvestment = franchiseData.totalInvestment || 0;
  const soldShares = franchiseData.soldShares || 0;
  
  return {
    ...franchiseData,
    totalInvestment,
    totalShares: calculateTotalShares(totalInvestment),
    availableShares: calculateAvailableShares(totalInvestment, soldShares),
    sharePrice: FIXED_AED_PER_SHARE,
    soldShares,
  };
}
