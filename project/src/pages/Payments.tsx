import React, { useState } from 'react';
import { Calendar, Filter, DollarSign, User, Clock } from 'lucide-react';
import PaymentStatusCard from '../components/PaymentStatusCard';
import PaymentSummary from '../components/PaymentSummary';
import { members, payments as initialPayments } from '../data/initialData';
import { Payment, Member } from '../types';
import { getMonthOptions, formatCurrency } from '../services/utils';

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [memberFilter, setMemberFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'late'>('all');
  
  // Get month options for dropdown
  const monthOptions = getMonthOptions();
  
  // Filter payments by selected month
  const filterPaymentsByMonth = (payments: Payment[], month: string) => {
    return payments.filter(payment => {
      if (!payment.date) {
        // For pending payments with no date, include them in the current month
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        return month === currentMonth;
      }
      return payment.date.startsWith(month);
    });
  };
  
  // Apply all filters
  const filteredPayments = filterPaymentsByMonth(payments, selectedMonth)
    .filter(payment => memberFilter === 'all' || payment.memberId === memberFilter)
    .filter(payment => statusFilter === 'all' || payment.status === statusFilter);
  
  // Calculate summary data for the selected month
  const calculateSummaryData = () => {
    const monthPayments = filterPaymentsByMonth(payments, selectedMonth);
    
    const totalExpected = members.length * 7000; // 5 members * 7000 TL
    const totalReceived = monthPayments.reduce((sum, payment) => {
      return sum + (payment.status === 'paid' ? payment.amount : 0);
    }, 0);
    
    const paidCount = monthPayments.filter(payment => payment.status === 'paid').length;
    
    return {
      totalExpected,
      totalReceived,
      memberCount: members.length,
      paidMemberCount: paidCount,
      month: selectedMonth
    };
  };
  
  // Update payment status
  const handleUpdateStatus = (paymentId: number, status: 'paid' | 'pending' | 'late') => {
    const updatedPayments = payments.map(payment => {
      if (payment.id === paymentId) {
        return {
          ...payment,
          status,
          // Update date if marked as paid and previously had no date
          date: status === 'paid' && !payment.date ? new Date().toISOString().split('T')[0] : payment.date
        };
      }
      return payment;
    });
    
    setPayments(updatedPayments);
  };
  
  // Get total payments pool amount (all time)
  const totalPaymentsPool = payments
    .filter(payment => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  // Find a member by ID
  const findMember = (memberId: number): Member | undefined => {
    return members.find(member => member.id === memberId);
  };
  
  // Get status counts for stats
  const getStatusCounts = () => {
    const monthPayments = filterPaymentsByMonth(payments, selectedMonth);
    
    const paidCount = monthPayments.filter(p => p.status === 'paid').length;
    const pendingCount = monthPayments.filter(p => p.status === 'pending').length;
    const lateCount = monthPayments.filter(p => p.status === 'late').length;
    
    return { paidCount, pendingCount, lateCount };
  };
  
  const statusCounts = getStatusCounts();
  const summaryData = calculateSummaryData();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Monthly Payments</h1>
        
        <div className="bg-primary text-white px-4 py-2 rounded-md shadow-sm">
          <div className="text-sm opacity-90">Total Investment Pool</div>
          <div className="text-xl font-semibold">{formatCurrency(totalPaymentsPool)}</div>
        </div>
      </div>
      
      {/* Payment Summary */}
      <PaymentSummary 
        totalExpected={summaryData.totalExpected}
        totalReceived={summaryData.totalReceived}
        memberCount={summaryData.memberCount}
        paidMemberCount={summaryData.paidMemberCount}
        month={summaryData.month}
      />
      
      {/* Payment Status Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="dashboard-card flex items-center">
          <div className="rounded-full p-3 bg-success bg-opacity-10 mr-3">
            <User size={20} className="text-success" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Paid</p>
            <p className="text-lg font-semibold">{statusCounts.paidCount} members</p>
          </div>
        </div>
        
        <div className="dashboard-card flex items-center">
          <div className="rounded-full p-3 bg-warning bg-opacity-10 mr-3">
            <Clock size={20} className="text-warning" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-lg font-semibold">{statusCounts.pendingCount} members</p>
          </div>
        </div>
        
        <div className="dashboard-card flex items-center">
          <div className="rounded-full p-3 bg-error bg-opacity-10 mr-3">
            <Clock size={20} className="text-error" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Late</p>
            <p className="text-lg font-semibold">{statusCounts.lateCount} members</p>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center">
          <Calendar size={18} className="text-gray-400 mr-2" />
          <select 
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="form-input min-w-[180px]"
          >
            {monthOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center">
          <User size={18} className="text-gray-400 mr-2" />
          <select 
            value={memberFilter}
            onChange={e => setMemberFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="form-input min-w-[150px]"
          >
            <option value="all">All Members</option>
            {members.map(member => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center">
          <Filter size={18} className="text-gray-400 mr-2" />
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="form-input min-w-[150px]"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="late">Late</option>
          </select>
        </div>
      </div>
      
      {/* Payments Grid */}
      {filteredPayments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPayments.map(payment => {
            const member = findMember(payment.memberId);
            if (!member) return null;
            
            return (
              <PaymentStatusCard 
                key={payment.id}
                payment={payment}
                member={member}
                onUpdateStatus={handleUpdateStatus}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No payments found for the selected filters.</p>
        </div>
      )}
      
      {/* Payment History */}
      <div>
        <h2 className="text-xl font-semibold text-primary mb-4">Payment History</h2>
        
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments
                .filter(p => p.status === 'paid')
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map(payment => {
                  const member = findMember(payment.memberId);
                  return (
                    <tr key={payment.id}>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {payment.date ? new Date(payment.date).toLocaleDateString('tr-TR') : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{member?.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{formatCurrency(payment.amount)}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
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

export default Payments;