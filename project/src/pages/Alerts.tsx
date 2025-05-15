import React, { useState, useEffect } from 'react';
import { BellRing, Bell, CheckCircle, Filter, Trash2 } from 'lucide-react';
import AlertCard from '../components/AlertCard';
import { alerts as initialAlerts } from '../data/initialData';
import { Alert } from '../types';
import { checkPriceAlerts, updateStockPrices, getStockSuggestions } from '../services/stockApi';
import { stocks } from '../data/initialData';

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [typeFilter, setTypeFilter] = useState<'all' | 'price-change' | 'suggestion'>('all');
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [isCheckingPrices, setIsCheckingPrices] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  
  // Filter alerts based on selected filters
  const filteredAlerts = alerts
    .filter(alert => typeFilter === 'all' || alert.type === typeFilter)
    .filter(alert => {
      if (readFilter === 'all') return true;
      return readFilter === 'unread' ? !alert.read : alert.read;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Mark alert as read
  const handleMarkAsRead = (alertId: number) => {
    const updatedAlerts = alerts.map(alert => {
      if (alert.id === alertId) {
        return { ...alert, read: true };
      }
      return alert;
    });
    
    setAlerts(updatedAlerts);
  };
  
  // Mark all alerts as read
  const handleMarkAllAsRead = () => {
    const updatedAlerts = alerts.map(alert => ({ ...alert, read: true }));
    setAlerts(updatedAlerts);
  };
  
  // Delete alert
  const handleDeleteAlert = (alertId: number) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
    setAlerts(updatedAlerts);
  };
  
  // Clear all read alerts
  const handleClearReadAlerts = () => {
    if (confirm('Are you sure you want to clear all read alerts?')) {
      const updatedAlerts = alerts.filter(alert => !alert.read);
      setAlerts(updatedAlerts);
    }
  };
  
  // Toggle email alerts
  const handleToggleEmailAlerts = () => {
    setEmailAlerts(!emailAlerts);
  };
  
  // Check for price alerts
  const handleCheckPriceAlerts = async () => {
    setIsCheckingPrices(true);
    
    try {
      // Store current prices
      const previousPrices: Record<string, number> = {};
      stocks.forEach(stock => {
        previousPrices[stock.ticker] = stock.currentPrice;
      });
      
      // Update prices
      const updatedStocks = await updateStockPrices(stocks);
      
      // Check for significant price changes
      const priceAlerts = checkPriceAlerts(updatedStocks, previousPrices);
      
      // Get stock suggestions
      const suggestions = await getStockSuggestions();
      
      // Create new alerts
      const newAlerts: Alert[] = [
        ...priceAlerts.map(alert => ({
          id: Date.now() + Math.random(),
          ticker: alert.ticker,
          type: 'price-change' as const,
          message: `${alert.ticker} price ${alert.percentChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(alert.percentChange).toFixed(2)}% in the last check`,
          date: new Date().toISOString(),
          read: false,
          priority: Math.abs(alert.percentChange) > 8 ? 'high' : 'medium'
        })),
        ...suggestions.map(suggestion => ({
          id: Date.now() + Math.random() + 1,
          ticker: suggestion.ticker,
          type: 'suggestion' as const,
          message: suggestion.reason,
          date: new Date().toISOString(),
          read: false,
          priority: 'low'
        }))
      ];
      
      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev]);
      }
    } catch (error) {
      console.error('Error checking price alerts:', error);
    } finally {
      setIsCheckingPrices(false);
    }
  };
  
  // Count unread alerts
  const unreadCount = alerts.filter(alert => !alert.read).length;
  
  // Check for price alerts periodically
  useEffect(() => {
    // Check on component mount
    handleCheckPriceAlerts();
    
    // Check every 6 hours
    const interval = setInterval(handleCheckPriceAlerts, 6 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">Alerts</h1>
          {unreadCount > 0 && (
            <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-error text-white">
              {unreadCount}
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={handleCheckPriceAlerts}
            disabled={isCheckingPrices}
            className="btn-secondary flex items-center"
          >
            <BellRing size={16} className={`mr-2 ${isCheckingPrices ? 'animate-spin' : ''}`} />
            <span>{isCheckingPrices ? 'Checking...' : 'Check Now'}</span>
          </button>
          
          <button 
            onClick={handleMarkAllAsRead}
            className="btn-primary flex items-center"
          >
            <CheckCircle size={16} className="mr-2" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>
      
      {/* Alert Settings */}
      <div className="dashboard-card">
        <h2 className="text-lg font-semibold text-primary mb-4">Alert Settings</h2>
        
        <div className="flex flex-wrap gap-6">
          <div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="emailAlerts"
                checked={emailAlerts}
                onChange={handleToggleEmailAlerts}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="emailAlerts" className="ml-2 text-sm text-gray-700">
                Receive email alerts for significant price changes
              </label>
            </div>
            
            <p className="text-xs text-gray-500">
              You'll receive email notifications for price changes of ±5% or more
            </p>
          </div>
          
          <div className="flex space-x-3 items-center">
            <button 
              onClick={handleClearReadAlerts}
              className="flex items-center text-sm text-gray-700 hover:text-error transition-colors"
            >
              <Trash2 size={14} className="mr-1" />
              <span>Clear Read Alerts</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center">
          <Bell size={18} className="text-gray-400 mr-2" />
          <select 
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as any)}
            className="form-input min-w-[180px]"
          >
            <option value="all">All Alert Types</option>
            <option value="price-change">Price Changes</option>
            <option value="suggestion">Suggestions</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <Filter size={18} className="text-gray-400 mr-2" />
          <select 
            value={readFilter}
            onChange={e => setReadFilter(e.target.value as any)}
            className="form-input min-w-[150px]"
          >
            <option value="all">All Alerts</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>
      
      {/* Alerts List */}
      {filteredAlerts.length > 0 ? (
        <div className="space-y-4">
          {filteredAlerts.map(alert => (
            <div key={alert.id} className="relative">
              <AlertCard 
                alert={alert} 
                onMarkAsRead={handleMarkAsRead} 
              />
              
              <button 
                onClick={() => handleDeleteAlert(alert.id)}
                className="absolute top-3 right-3 text-gray-400 hover:text-error transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <BellRing size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">No alerts found. Check back later for updates.</p>
        </div>
      )}
    </div>
  );
};

export default Alerts;