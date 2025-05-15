import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Search, Filter } from 'lucide-react';
import PortfolioSummary from '../components/PortfolioSummary';
import StockCard from '../components/StockCard';
import StockForm from '../components/StockForm';
import { stocks as initialStocks, getPortfolioSummary } from '../data/initialData';
import { Stock } from '../types';
import { updateStockPrices } from '../services/stockApi';

const Portfolio: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>(initialStocks);
  const [portfolioSummary, setPortfolioSummary] = useState(getPortfolioSummary());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortOption, setSortOption] = useState<string>('default');
  
  // Refresh stock prices
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      const updatedStocks = await updateStockPrices(stocks);
      setStocks(updatedStocks);
      
      // Recalculate portfolio summary
      const updatedSummary = {
        totalInvestment: updatedStocks.reduce((sum, stock) => sum + (stock.quantity * stock.purchasePrice), 0),
        currentValue: updatedStocks.reduce((sum, stock) => sum + (stock.quantity * stock.currentPrice), 0),
        totalProfit: 0,
        profitPercentage: 0
      };
      
      updatedSummary.totalProfit = updatedSummary.currentValue - updatedSummary.totalInvestment;
      updatedSummary.profitPercentage = (updatedSummary.totalProfit / updatedSummary.totalInvestment) * 100;
      
      setPortfolioSummary(updatedSummary);
    } catch (error) {
      console.error('Error refreshing stock data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Add new stock
  const handleAddStock = (stockData: Omit<Stock, 'id' | 'currentPrice' | 'lastUpdated'>) => {
    // Create a new stock with current price (for demo, we'll use purchase price as current)
    const newStock: Stock = {
      id: stocks.length > 0 ? Math.max(...stocks.map(s => s.id)) + 1 : 1,
      ...stockData,
      currentPrice: stockData.purchasePrice, // In a real app, we would fetch this
      lastUpdated: new Date().toISOString()
    };
    
    const updatedStocks = [...stocks, newStock];
    setStocks(updatedStocks);
    
    // Update portfolio summary
    updatePortfolioSummary(updatedStocks);
    
    // Close the form
    setShowAddForm(false);
  };
  
  // Edit stock
  const handleEditStock = (stock: Stock) => {
    setEditingStock(stock);
  };
  
  // Update stock
  const handleUpdateStock = (stockData: Omit<Stock, 'id' | 'currentPrice' | 'lastUpdated'>) => {
    if (!editingStock) return;
    
    const updatedStock: Stock = {
      ...editingStock,
      ...stockData,
      lastUpdated: new Date().toISOString()
    };
    
    const updatedStocks = stocks.map(s => s.id === editingStock.id ? updatedStock : s);
    setStocks(updatedStocks);
    
    // Update portfolio summary
    updatePortfolioSummary(updatedStocks);
    
    // Close the form
    setEditingStock(null);
  };
  
  // Delete stock
  const handleDeleteStock = (stockId: number) => {
    if (confirm('Are you sure you want to delete this stock?')) {
      const updatedStocks = stocks.filter(s => s.id !== stockId);
      setStocks(updatedStocks);
      
      // Update portfolio summary
      updatePortfolioSummary(updatedStocks);
    }
  };
  
  // Update portfolio summary based on stocks
  const updatePortfolioSummary = (updatedStocks: Stock[]) => {
    const totalInvestment = updatedStocks.reduce((sum, stock) => sum + (stock.quantity * stock.purchasePrice), 0);
    const currentValue = updatedStocks.reduce((sum, stock) => sum + (stock.quantity * stock.currentPrice), 0);
    const totalProfit = currentValue - totalInvestment;
    const profitPercentage = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;
    
    setPortfolioSummary({
      totalInvestment,
      currentValue,
      totalProfit,
      profitPercentage
    });
  };
  
  // Filter stocks based on search term
  const filteredStocks = stocks.filter(stock => 
    stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort stocks based on option
  const sortedStocks = [...filteredStocks].sort((a, b) => {
    switch (sortOption) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'ticker':
        return a.ticker.localeCompare(b.ticker);
      case 'value-high':
        return (b.quantity * b.currentPrice) - (a.quantity * a.currentPrice);
      case 'value-low':
        return (a.quantity * a.currentPrice) - (b.quantity * b.currentPrice);
      case 'profit-high': {
        const profitA = ((a.currentPrice - a.purchasePrice) / a.purchasePrice) * 100;
        const profitB = ((b.currentPrice - b.purchasePrice) / b.purchasePrice) * 100;
        return profitB - profitA;
      }
      case 'profit-low': {
        const profitA = ((a.currentPrice - a.purchasePrice) / a.purchasePrice) * 100;
        const profitB = ((b.currentPrice - b.purchasePrice) / b.purchasePrice) * 100;
        return profitA - profitB;
      }
      default:
        return 0;
    }
  });
  
  // Refresh stock data periodically (in a real app, this would be more sophisticated)
  useEffect(() => {
    handleRefresh();
    
    // Refresh every 6 hours
    const refreshInterval = setInterval(handleRefresh, 6 * 60 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Stock Portfolio</h1>
        
        <div className="flex space-x-2">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-secondary flex items-center"
          >
            <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Prices'}</span>
          </button>
          
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center"
          >
            <Plus size={16} className="mr-2" />
            <span>Add Stock</span>
          </button>
        </div>
      </div>
      
      {/* Portfolio Summary */}
      <PortfolioSummary 
        totalInvestment={portfolioSummary.totalInvestment}
        currentValue={portfolioSummary.currentValue}
        totalProfit={portfolioSummary.totalProfit}
        profitPercentage={portfolioSummary.profitPercentage}
      />
      
      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
        
        <div className="flex items-center">
          <Filter size={18} className="text-gray-400 mr-2" />
          <select 
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
            className="form-input min-w-[150px]"
          >
            <option value="default">Default</option>
            <option value="name">Company Name</option>
            <option value="ticker">Ticker</option>
            <option value="value-high">Value (High to Low)</option>
            <option value="value-low">Value (Low to High)</option>
            <option value="profit-high">Profit % (High to Low)</option>
            <option value="profit-low">Profit % (Low to High)</option>
          </select>
        </div>
      </div>
      
      {/* Stocks Grid */}
      {sortedStocks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedStocks.map(stock => (
            <div key={stock.id} className="relative">
              <StockCard stock={stock} onRefresh={handleRefresh} />
              
              <div className="absolute top-3 right-3 flex space-x-1">
                <button 
                  onClick={() => handleEditStock(stock)}
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  <span className="sr-only">Edit</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                
                <button 
                  onClick={() => handleDeleteStock(stock.id)}
                  className="text-gray-400 hover:text-error transition-colors"
                >
                  <span className="sr-only">Delete</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No stocks found. {searchTerm ? 'Try a different search term.' : 'Add some stocks to get started.'}</p>
        </div>
      )}
      
      {/* Add/Edit Stock Form Modal */}
      {(showAddForm || editingStock) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          {showAddForm ? (
            <StockForm 
              onSubmit={handleAddStock} 
              onCancel={() => setShowAddForm(false)} 
            />
          ) : (
            <StockForm 
              stock={editingStock || undefined} 
              onSubmit={handleUpdateStock} 
              onCancel={() => setEditingStock(null)} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Portfolio;