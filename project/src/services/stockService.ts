import { supabase } from '../lib/supabase';
import { Stock } from '../types';

export const stockService = {
  async fetchLatestPrices(tickers: string[]): Promise<Record<string, number>> {
    const { data, error } = await supabase.functions.invoke('fetch-stock-prices', {
      body: { tickers },
    });

    if (error) throw error;
    return data;
  },

  async updateStockPrices(stocks: Stock[]): Promise<void> {
    const tickers = stocks.map(stock => stock.ticker);
    const prices = await this.fetchLatestPrices(tickers);

    // Update each stock with new price
    await Promise.all(
      stocks.map(async (stock) => {
        const newPrice = prices[stock.ticker];
        if (newPrice) {
          await supabase
            .from('stocks')
            .update({ 
              current_price: newPrice,
              last_updated: new Date().toISOString()
            })
            .eq('id', stock.id);
        }
      })
    );
  },

  async getStocks(): Promise<Stock[]> {
    const { data, error } = await supabase
      .from('stocks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async addStock(stock: Omit<Stock, 'id' | 'currentPrice' | 'lastUpdated'>): Promise<Stock> {
    // First get the current price
    const prices = await this.fetchLatestPrices([stock.ticker]);
    const currentPrice = prices[stock.ticker] || stock.purchasePrice;

    const { data, error } = await supabase
      .from('stocks')
      .insert([{
        ticker: stock.ticker,
        name: stock.name,
        quantity: stock.quantity,
        purchase_price: stock.purchasePrice,
        purchase_date: stock.purchaseDate,
        current_price: currentPrice,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateStock(id: string, stock: Partial<Stock>): Promise<void> {
    const { error } = await supabase
      .from('stocks')
      .update(stock)
      .eq('id', id);

    if (error) throw error;
  },

  async deleteStock(id: string): Promise<void> {
    const { error } = await supabase
      .from('stocks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};