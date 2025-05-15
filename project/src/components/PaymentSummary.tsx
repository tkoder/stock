import React from 'react';
import { DollarSign, Users, Calendar } from 'lucide-react';
import { formatCurrency } from '../services/utils';

interface PaymentSummaryProps {
  totalExpected: number;
  totalReceived: number;
  memberCount: number;
  paidMemberCount: number;
  month: string;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  totalExpected,
  totalReceived,
  memberCount,
  paidMemberCount,
  month
}) => {
  // Format month string for display (YYYY-MM to Month Year)
  const displayMonth = () => {
    const [year, monthNum] = month.split('-');
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return `${monthNames[parseInt(monthNum) - 1]} ${year}`;
  };
  
  // Calculate completion percentage
  const completionPercentage = (totalReceived / totalExpected) * 100;
  
  return (
    <div className="dashboard-card fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-primary">Payment Summary</h2>
        <div className="flex items-center text-gray-500">
          <Calendar size={16} className="mr-1" />
          <span>{displayMonth()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center text-gray-500 mb-1">
            <DollarSign size={16} className="mr-1" />
            <p className="text-sm">Expected Total</p>
          </div>
          <p className="text-lg font-semibold">{formatCurrency(totalExpected)}</p>
        </div>
        
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center text-gray-500 mb-1">
            <DollarSign size={16} className="mr-1" />
            <p className="text-sm">Received Total</p>
          </div>
          <p className="text-lg font-semibold">{formatCurrency(totalReceived)}</p>
        </div>
        
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center text-gray-500 mb-1">
            <Users size={16} className="mr-1" />
            <p className="text-sm">Member Payments</p>
          </div>
          <p className="text-lg font-semibold">{paidMemberCount} of {memberCount} members paid</p>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Payment Progress</span>
          <span>{Math.round(completionPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;