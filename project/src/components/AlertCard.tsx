import React from 'react';
import { Bell, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import { Alert } from '../types';
import { timeAgo } from '../services/utils';

interface AlertCardProps {
  alert: Alert;
  onMarkAsRead?: (alertId: number) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onMarkAsRead }) => {
  const getAlertIcon = () => {
    switch (alert.type) {
      case 'price-change':
        return <AlertTriangle size={18} className="text-warning" />;
      case 'suggestion':
        return <TrendingUp size={18} className="text-primary" />;
      default:
        return <Bell size={18} className="text-gray-500" />;
    }
  };
  
  const getPriorityColor = () => {
    switch (alert.priority) {
      case 'high':
        return 'border-l-4 border-error';
      case 'medium':
        return 'border-l-4 border-warning';
      case 'low':
        return 'border-l-4 border-primary';
      default:
        return '';
    }
  };
  
  return (
    <div className={`card relative ${getPriorityColor()} ${!alert.read ? 'bg-blue-50' : ''} fade-in`}>
      {!alert.read && (
        <span className="absolute top-2 right-2 h-2 w-2 bg-blue-500 rounded-full"></span>
      )}
      
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getAlertIcon()}
        </div>
        <div className="flex-1">
          <p className="font-medium mb-1">
            <span className="font-semibold text-primary">{alert.ticker}:</span> {alert.message}
          </p>
          <p className="text-sm text-gray-500">{timeAgo(alert.date)}</p>
        </div>
      </div>
      
      {onMarkAsRead && !alert.read && (
        <div className="mt-3 text-right">
          <button 
            onClick={() => onMarkAsRead(alert.id)}
            className="inline-flex items-center text-sm text-gray-700 hover:text-primary"
          >
            <CheckCircle size={16} className="mr-1" />
            <span>Mark as read</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertCard;