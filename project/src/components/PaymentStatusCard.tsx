import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Member, Payment } from '../types';
import { formatCurrency, formatDate } from '../services/utils';

interface PaymentStatusCardProps {
  payment: Payment;
  member: Member;
  onUpdateStatus?: (paymentId: number, status: 'paid' | 'pending' | 'late') => void;
}

const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({ 
  payment, 
  member,
  onUpdateStatus
}) => {
  const getStatusIcon = () => {
    switch (payment.status) {
      case 'paid':
        return <CheckCircle size={20} className="text-success" />;
      case 'pending':
        return <Clock size={20} className="text-warning" />;
      case 'late':
        return <AlertCircle size={20} className="text-error" />;
      default:
        return null;
    }
  };
  
  const getStatusText = () => {
    switch (payment.status) {
      case 'paid':
        return 'Ödendi';
      case 'pending':
        return 'Beklemede';
      case 'late':
        return 'Gecikmiş';
      default:
        return '';
    }
  };
  
  const getStatusColor = () => {
    switch (payment.status) {
      case 'paid':
        return 'bg-green-100 text-success';
      case 'pending':
        return 'bg-yellow-100 text-warning';
      case 'late':
        return 'bg-red-100 text-error';
      default:
        return '';
    }
  };
  
  return (
    <div className="card fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-primary">{member.name}</h3>
          <div className="flex items-center mt-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="ml-1">{getStatusText()}</span>
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold">{formatCurrency(payment.amount)}</p>
          {payment.date && <p className="text-sm text-gray-500">{formatDate(payment.date)}</p>}
        </div>
      </div>
      
      {onUpdateStatus && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <button 
              onClick={() => onUpdateStatus(payment.id, 'paid')}
              className={`flex-1 py-1 px-3 text-sm rounded-md ${payment.status === 'paid' ? 'bg-success text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Ödendi
            </button>
            <button 
              onClick={() => onUpdateStatus(payment.id, 'pending')}
              className={`flex-1 py-1 px-3 text-sm rounded-md ${payment.status === 'pending' ? 'bg-warning text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Beklemede
            </button>
            <button 
              onClick={() => onUpdateStatus(payment.id, 'late')}
              className={`flex-1 py-1 px-3 text-sm rounded-md ${payment.status === 'late' ? 'bg-error text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Gecikmiş
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStatusCard;