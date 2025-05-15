import { Stock } from '../types';

// This would normally connect to Yahoo Finance API or similar
// For demo purposes, we'll simulate API calls

// Simulates an API fetch with realistic price fluctuations
export const fetchStockPrices = async (tickers: string[]): Promise<Record<string, number>> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock API response
  const priceData: Record<string, number> = {};
  
  tickers.forEach(ticker => {
    // Get the base price for this ticker (or use a default)
    const basePrice = mockPriceData[ticker] || 50;
    
    // Add a random fluctuation (±3%)
    const fluctuation = basePrice * (Math.random() * 0.06 - 0.03);
    priceData[ticker] = parseFloat((basePrice + fluctuation).toFixed(2));
  });
  
  return priceData;
};

// Update stock data with fresh prices
export const updateStockPrices = async (stocks: Stock[]): Promise<Stock[]> => {
  // Get tickers from stocks
  const tickers = stocks.map(stock => stock.ticker);
  
  // Fetch latest prices
  const priceData = await fetchStockPrices(tickers);
  
  // Update stock objects with new prices
  return stocks.map(stock => ({
    ...stock,
    currentPrice: priceData[stock.ticker],
    lastUpdated: new Date().toISOString()
  }));
};

// Check for significant price changes
export const checkPriceAlerts = (stocks: Stock[], previousPrices: Record<string, number>): Array<{ticker: string, percentChange: number}> => {
  const alerts = [];
  
  for (const stock of stocks) {
    const previousPrice = previousPrices[stock.ticker];
    if (!previousPrice) continue;
    
    const percentChange = ((stock.currentPrice - previousPrice) / previousPrice) * 100;
    
    // Alert if price change is ±5%
    if (Math.abs(percentChange) >= 5) {
      alerts.push({
        ticker: stock.ticker,
        percentChange
      });
    }
  }
  
  return alerts;
};

// Mock price data for simulation
const mockPriceData: Record<string, number> = {
  'TUPRS': 142.7,
  'THYAO': 57.85,
  'KCHOL': 80.15,
  'GARAN': 32.45,
  'SAHOL': 46.3,
  'AKBNK': 28.74,
  'ISCTR': 254.60,
  'SISE': 35.22,
  'PGSUS': 412.80,
  'ASELS': 51.35,
};

// Mock function to get stock suggestions
export const getStockSuggestions = async (): Promise<Array<{ticker: string, reason: string}>> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return a random suggestion from our predefined list
  const suggestions = [
    { ticker: 'AKBNK', reason: 'Strong technical breakout and positive sector outlook' },
    { ticker: 'SISE', reason: 'Trading at attractive valuation with solid dividend history' },
    { ticker: 'PGSUS', reason: 'Potential growth opportunity with increasing travel demand' },
    { ticker: 'ASELS', reason: 'Strategic sector position with new government contracts' },
  ];
  
  // Randomly select 1-2 suggestions
  const count = Math.floor(Math.random() * 2) + 1;
  const selectedSuggestions = [];
  
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * suggestions.length);
    selectedSuggestions.push(suggestions[index]);
    suggestions.splice(index, 1);
    
    if (suggestions.length === 0) break;
  }
  
  return selectedSuggestions;
};