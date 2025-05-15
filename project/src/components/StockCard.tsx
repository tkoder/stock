import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, RefreshCw } from 'lucide-react';
import { Stock } from '../types';
import { formatCurrency, formatPercentage, formatDate } from '../services/utils';

interface StockCardProps {
  stock: Stock;
  onRefresh?: (stockId: number) => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, onRefresh }) => {
  // Calculate profit/loss
  const totalInvestment = stock.quantity * stock.purchasePrice;
  const currentValue = stock.quantity * stock.currentPrice;
  const profitLoss = currentValue - totalInvestment;
  const profitLossPercentage = (profitLoss / totalInvestment) * 100;
  
  const isProfitable = profitLoss >= 0;
  
  return (
    <div className="card fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-primary">{stock.ticker}</h3>
          <p className="text-gray-500 text-sm">{stock.name}</p>
        </div>
        {onRefresh && (
          <button 
            onClick={() => onRefresh(stock.id)} 
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            title="Refresh price"
          >
            <RefreshCw size={18} className="text-gray-500" />
          </button>
        )}
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-sm text-gray-500">Quantity</p>
          <p className="font-medium">{stock.quantity}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Purchase Price</p>
          <p className="font-medium">{formatCurrency(stock.purchasePrice)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Current Price</p>
          <p className="font-medium">{formatCurrency(stock.currentPrice)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Purchase Date</p>
          <p className="font-medium">{formatDate(stock.purchaseDate)}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Total Investment</p>
            <p className="font-medium">{formatCurrency(totalInvestment)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Value</p>
            <p className="font-medium">{formatCurrency(currentValue)}</p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center">
          {isProfitable ? (
            <ArrowUpCircle size={20} className="text-success mr-2" />
          ) : (
            <ArrowDownCircle size={20} className="text-error mr-2" />
          )}
          <p className={`font-semibold ${isProfitable ? 'text-success' : 'text-error'}`}>
            {formatCurrency(profitLoss)} ({formatPercentage(profitLossPercentage)})
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockCard;