import React, { useEffect, useState } from 'react';
import { RefreshCw, TrendingUp, DollarSign, Bell } from 'lucide-react';
import PortfolioSummary from '../components/PortfolioSummary';
import StockCard from '../components/StockCard';
import AlertCard from '../components/AlertCard';
import PaymentSummary from '../components/PaymentSummary';
import { getPortfolioSummary, getMonthlyPaymentSummary, stocks, alerts, members, payments } from '../data/initialData';
import { updateStockPrices } from '../services/stockApi';
import { isCurrentMonth } from '../services/utils';

const Dashboard: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState(getPortfolioSummary());
  const [stocksData, setStocksData] = useState(stocks);
  const [alertsData, setAlertsData] = useState(alerts);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Get current month and year
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  // Get payment data for current month
  const paymentSummary = getMonthlyPaymentSummary(currentMonth, currentYear);
  
  // Count number of members who have paid this month
  const paidMemberCount = paymentSummary.memberPayments.filter(p => p.status === 'paid').length;
  
  // Refresh stock data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      const updatedStocks = await updateStockPrices(stocksData);
      setStocksData(updatedStocks);
      
      // Also update portfolio summary
      const updatedSummary = getPortfolioSummary();
      setPortfolioData(updatedSummary);
    } catch (error) {
      console.error('Error refreshing stock data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Get top performing and worst performing stocks
  const getTopPerformingStock = () => {
    let bestStock = stocksData[0];
    let bestPerformance = -Infinity;
    
    stocksData.forEach(stock => {
      const performance = ((stock.currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
      if (performance > bestPerformance) {
        bestPerformance = performance;
        bestStock = stock;
      }
    });
    
    return bestStock;
  };
  
  const getWorstPerformingStock = () => {
    let worstStock = stocksData[0];
    let worstPerformance = Infinity;
    
    stocksData.forEach(stock => {
      const performance = ((stock.currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
      if (performance < worstPerformance) {
        worstPerformance = performance;
        worstStock = stock;
      }
    });
    
    return worstStock;
  };
  
  // Filter unread alerts
  const unreadAlerts = alertsData.filter(alert => !alert.read);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="btn-secondary flex items-center"
        >
          <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
        </button>
      </div>
      
      {/* Portfolio Summary */}
      <PortfolioSummary 
        totalInvestment={portfolioData.totalInvestment}
        currentValue={portfolioData.currentValue}
        totalProfit={portfolioData.totalProfit}
        profitPercentage={portfolioData.profitPercentage}
      />
      
      {/* Payment Summary */}
      <PaymentSummary 
        totalExpected={paymentSummary.totalExpected}
        totalReceived={paymentSummary.totalReceived}
        memberCount={members.length}
        paidMemberCount={paidMemberCount}
        month={paymentSummary.month}
      />
      
      {/* Portfolio Highlights and Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center mb-3">
            <TrendingUp size={18} className="text-primary mr-2" />
            <h2 className="text-lg font-semibold text-primary">Portfolio Highlights</h2>
          </div>
          
          <div className="space-y-4">
            <StockCard stock={getTopPerformingStock()} />
            <StockCard stock={getWorstPerformingStock()} />
          </div>
        </div>
        
        <div>
          <div className="flex items-center mb-3">
            <Bell size={18} className="text-primary mr-2" />
            <h2 className="text-lg font-semibold text-primary">Recent Alerts</h2>
          </div>
          
          {unreadAlerts.length > 0 ? (
            <div className="space-y-3">
              {unreadAlerts.slice(0, 3).map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          ) : (
            <div className="dashboard-card text-center py-8">
              <p className="text-gray-500">No unread alerts</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Monthly Payments Overview */}
      <div>
        <div className="flex items-center mb-3">
          <DollarSign size={18} className="text-primary mr-2" />
          <h2 className="text-lg font-semibold text-primary">Monthly Payments Overview</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments
                .filter(payment => isCurrentMonth(payment.date))
                .map(payment => {
                  const member = members.find(m => m.id === payment.memberId);
                  return (
                    <tr key={payment.id}>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{member?.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${payment.status === 'paid' ? 'bg-green-100 text-green-800' : 
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {payment.status === 'paid' ? 'Paid' : 
                            payment.status === 'pending' ? 'Pending' : 'Late'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">₺{payment.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {payment.date ? new Date(payment.date).toLocaleDateString('tr-TR') : '-'}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;