// Format date to local format
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Format time ago from now
export const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + ' yıl önce';
  }
  
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' ay önce';
  }
  
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' gün önce';
  }
  
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' saat önce';
  }
  
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' dakika önce';
  }
  
  return Math.floor(seconds) + ' saniye önce';
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('tr-TR', { 
    style: 'currency', 
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  }).format(amount);
};

// Format percentage
export const formatPercentage = (percentage: number): string => {
  return new Intl.NumberFormat('tr-TR', { 
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(percentage / 100);
};

// Check if a date is in the current month
export const isCurrentMonth = (dateString: string): boolean => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const now = new Date();
  
  return date.getMonth() === now.getMonth() && 
         date.getFullYear() === now.getFullYear();
};

// Calculate the total investment pool ("Havuz") based on all payments
export const calculateInvestmentPool = (payments: { amount: number, status: string }[]): number => {
  return payments.reduce((sum, payment) => {
    return sum + (payment.status === 'paid' ? payment.amount : 0);
  }, 0);
};

// Generate month options for dropdown selectors
export const getMonthOptions = (): Array<{value: string, label: string}> => {
  const options = [];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Include current month and previous 11 months
  for (let i = 0; i < 12; i++) {
    const month = (currentMonth - i + 12) % 12;
    const year = currentYear - Math.floor((i - currentMonth) / 12);
    
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    
    options.push({
      value: `${year}-${String(month + 1).padStart(2, '0')}`,
      label: `${monthNames[month]} ${year}`
    });
  }
  
  return options;
};