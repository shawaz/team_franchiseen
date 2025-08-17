/**
 * CoinGecko API Service for SOL Price Data
 * 
 * This service fetches real-time SOL prices from CoinGecko API
 * and provides conversion utilities for local currencies.
 */

export interface SolPriceData {
  usd: number;
  eur: number;
  gbp: number;
  jpy: number;
  aud: number;
  cad: number;
  chf: number;
  cny: number;
  inr: number;
  aed: number;
  sar: number;
  sgd: number;
  hkd: number;
  krw: number;
  brl: number;
  mxn: number;
  rub: number;
  zar: number;
  try: number;
  nok: number;
  sek: number;
  dkk: number;
  pln: number;
  czk: number;
  huf: number;
}

export interface LocalCurrency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

// Supported local currencies for wallet display
export const SUPPORTED_CURRENCIES: LocalCurrency[] = [
  { code: 'usd', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'eur', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'gbp', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'aed', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪' },
  { code: 'sar', name: 'Saudi Riyal', symbol: 'SAR', flag: '🇸🇦' },
  { code: 'inr', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'jpy', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'aud', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'cad', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'sgd', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'chf', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'cny', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
];

class CoinGeckoService {
  private baseUrl = 'https://api.coingecko.com/api/v3';
  private cache: { data: SolPriceData | null; timestamp: number } = { data: null, timestamp: 0 };
  private cacheTimeout = 60000; // 1 minute cache

  /**
   * Fetch current SOL prices from CoinGecko API
   */
  async getSolPrices(): Promise<SolPriceData> {
    // Check cache first
    const now = Date.now();
    if (this.cache.data && (now - this.cache.timestamp) < this.cacheTimeout) {
      return this.cache.data;
    }

    try {
      const currencies = SUPPORTED_CURRENCIES.map(c => c.code).join(',');
      const response = await fetch(
        `${this.baseUrl}/simple/price?ids=solana&vs_currencies=${currencies}`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      const solPrices = data.solana as SolPriceData;

      // Update cache
      this.cache = {
        data: solPrices,
        timestamp: now,
      };

      return solPrices;
    } catch (error) {
      console.error('Failed to fetch SOL prices from CoinGecko:', error);
      
      // Return fallback prices if API fails
      return this.getFallbackPrices();
    }
  }

  /**
   * Get fallback prices when API is unavailable
   */
  private getFallbackPrices(): SolPriceData {
    return {
      usd: 20,
      eur: 18.5,
      gbp: 16,
      jpy: 3000,
      aud: 30,
      cad: 27,
      chf: 18,
      cny: 145,
      inr: 1650,
      aed: 73,
      sar: 75,
      sgd: 27,
      hkd: 156,
      krw: 26000,
      brl: 120,
      mxn: 400,
      rub: 1800,
      zar: 360,
      try: 600,
      nok: 220,
      sek: 220,
      dkk: 140,
      pln: 80,
      czk: 460,
      huf: 7500,
    };
  }

  /**
   * Convert SOL amount to local currency
   */
  async convertSolToLocal(solAmount: number, currencyCode: string): Promise<number> {
    const prices = await this.getSolPrices();
    const rate = prices[currencyCode as keyof SolPriceData];
    
    if (!rate) {
      throw new Error(`Unsupported currency: ${currencyCode}`);
    }

    return solAmount * rate;
  }

  /**
   * Convert local currency amount to SOL
   */
  async convertLocalToSol(localAmount: number, currencyCode: string): Promise<number> {
    const prices = await this.getSolPrices();
    const rate = prices[currencyCode as keyof SolPriceData];
    
    if (!rate) {
      throw new Error(`Unsupported currency: ${currencyCode}`);
    }

    return localAmount / rate;
  }

  /**
   * Format SOL amount with proper decimals
   */
  formatSol(amount: number): string {
    return `${amount.toFixed(4)} SOL`;
  }

  /**
   * Format local currency amount
   */
  formatLocalCurrency(amount: number, currencyCode: string): string {
    const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
    if (!currency) {
      return `${amount.toFixed(2)} ${currencyCode.toUpperCase()}`;
    }

    // Special formatting for currencies without decimals
    if (currencyCode === 'jpy' || currencyCode === 'krw') {
      return `${currency.symbol}${Math.round(amount).toLocaleString()}`;
    }

    return `${currency.symbol}${amount.toFixed(2)}`;
  }

  /**
   * Get user's local currency based on location
   */
  async detectLocalCurrency(): Promise<string> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      // Map country codes to currency codes
      const countryToCurrency: { [key: string]: string } = {
        'US': 'usd',
        'AE': 'aed',
        'SA': 'sar',
        'GB': 'gbp',
        'EU': 'eur',
        'DE': 'eur',
        'FR': 'eur',
        'IT': 'eur',
        'ES': 'eur',
        'NL': 'eur',
        'IN': 'inr',
        'JP': 'jpy',
        'AU': 'aud',
        'CA': 'cad',
        'SG': 'sgd',
        'CH': 'chf',
        'CN': 'cny',
      };

      const detectedCurrency = countryToCurrency[data.country_code];
      return detectedCurrency || 'usd'; // Default to USD
    } catch (error) {
      console.error('Failed to detect location:', error);
      return 'usd'; // Default to USD
    }
  }

  /**
   * Clear cache (useful for testing or manual refresh)
   */
  clearCache(): void {
    this.cache = { data: null, timestamp: 0 };
  }
}

// Export singleton instance
export const coinGeckoService = new CoinGeckoService();

// Export utility functions
export const formatSol = (amount: number): string => coinGeckoService.formatSol(amount);
export const formatLocalCurrency = (amount: number, currencyCode: string): string => 
  coinGeckoService.formatLocalCurrency(amount, currencyCode);
