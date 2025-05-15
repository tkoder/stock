import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../services/utils';

interface PortfolioSummaryProps {
  totalInvestment: number;
  currentValue: number;
  totalProfit: number;
  profitPercentage: number;
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  totalInvestment,
  currentValue,
  totalProfit,
  profitPercentage
}) => {
  const isProfitable = totalProfit >= 0;
  
  return (
    <div className="dashboard-card fade-in">
      <h2 className="text-xl font-semibold text-primary mb-4">Portfolio Summary</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center text-gray-500 mb-1">
            <DollarSign size={16} className="mr-1" />
            <p className="text-sm">Total Investment</p>
          </div>
          <p className="text-lg font-semibold">{formatCurrency(totalInvestment)}</p>
        </div>
        
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center text-gray-500 mb-1">
            <DollarSign size={16} className="mr-1" />
            <p className="text-sm">Current Value</p>
          </div>
          <p className="text-lg font-semibold">{formatCurrency(currentValue)}</p>
        </div>
        
        <div className={`p-3 rounded-lg ${isProfitable ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-center text-gray-500 mb-1">
            {isProfitable ? (
              <TrendingUp size={16} className="mr-1 text-success" />
            ) : (
              <TrendingDown size={16} className="mr-1 text-error" />
            )}
            <p className="text-sm">Total Profit/Loss</p>
          </div>
          <p className={`text-lg font-semibold ${isProfitable ? 'text-success' : 'text-error'}`}>
            {formatCurrency(totalProfit)}
          </p>
        </div>
        
        <div className={`p-3 rounded-lg ${isProfitable ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-center text-gray-500 mb-1">
            <Percent size={16} className="mr-1" />
            <p className="text-sm">Return</p>
          </div>
          <p className={`text-lg font-semibold ${isProfitable ? 'text-success' : 'text-error'}`}>
            {formatPercentage(profitPercentage)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;