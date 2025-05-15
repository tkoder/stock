import { Member, Payment, Stock, Alert, Note } from '../types';

export const members: Member[] = [
  { id: 1, name: 'Ahmet Yılmaz' },
  { id: 2, name: 'Mehmet Öz' },
  { id: 3, name: 'Ayşe Demir' },
  { id: 4, name: 'Fatma Çelik' },
  { id: 5, name: 'Ali Kaya' },
];

const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

export const payments: Payment[] = [
  { 
    id: 1, 
    memberId: 1, 
    date: `${currentYear}-${(currentMonth).toString().padStart(2, '0')}-05`, 
    amount: 7000, 
    status: 'paid' 
  },
  { 
    id: 2, 
    memberId: 2, 
    date: `${currentYear}-${(currentMonth).toString().padStart(2, '0')}-07`, 
    amount: 7000, 
    status: 'paid' 
  },
  { 
    id: 3, 
    memberId: 3, 
    date: `${currentYear}-${(currentMonth).toString().padStart(2, '0')}-06`, 
    amount: 7000, 
    status: 'paid' 
  },
  { 
    id: 4, 
    memberId: 4, 
    date: `${currentYear}-${(currentMonth).toString().padStart(2, '0')}-10`, 
    amount: 7000, 
    status: 'paid' 
  },
  { 
    id: 5, 
    memberId: 5, 
    date: '', 
    amount: 7000, 
    status: 'pending' 
  },
  // Previous month
  { 
    id: 6, 
    memberId: 1, 
    date: `${currentYear}-${(currentMonth-1).toString().padStart(2, '0')}-05`, 
    amount: 7000, 
    status: 'paid' 
  },
  { 
    id: 7, 
    memberId: 2, 
    date: `${currentYear}-${(currentMonth-1).toString().padStart(2, '0')}-07`, 
    amount: 7000, 
    status: 'paid' 
  },
  { 
    id: 8, 
    memberId: 3, 
    date: `${currentYear}-${(currentMonth-1).toString().padStart(2, '0')}-12`, 
    amount: 7000, 
    status: 'paid' 
  },
  { 
    id: 9, 
    memberId: 4, 
    date: `${currentYear}-${(currentMonth-1).toString().padStart(2, '0')}-08`, 
    amount: 7000, 
    status: 'paid' 
  },
  { 
    id: 10, 
    memberId: 5, 
    date: `${currentYear}-${(currentMonth-1).toString().padStart(2, '0')}-06`, 
    amount: 7000, 
    status: 'paid' 
  },
];

export const stocks: Stock[] = [
  {
    id: 1,
    ticker: 'TUPRS',
    name: 'Tüpraş',
    quantity: 1206,
    purchasePrice: 139.36,
    purchaseDate: '2023-06-15',
    currentPrice: 142.7,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 2,
    ticker: 'THYAO',
    name: 'Türk Hava Yolları',
    quantity: 2500,
    purchasePrice: 54.65,
    purchaseDate: '2023-07-20',
    currentPrice: 57.85,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 3,
    ticker: 'KCHOL',
    name: 'Koç Holding',
    quantity: 1850,
    purchasePrice: 82.4,
    purchaseDate: '2023-08-10',
    currentPrice: 80.15,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 4,
    ticker: 'GARAN',
    name: 'Garanti Bankası',
    quantity: 3200,
    purchasePrice: 29.68,
    purchaseDate: '2023-09-05',
    currentPrice: 32.45,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 5,
    ticker: 'SAHOL',
    name: 'Sabancı Holding',
    quantity: 2700,
    purchasePrice: 44.12,
    purchaseDate: '2023-10-12',
    currentPrice: 46.3,
    lastUpdated: new Date().toISOString(),
  },
];

export const alerts: Alert[] = [
  {
    id: 1,
    ticker: 'GARAN',
    type: 'price-change',
    message: 'GARAN price increased by 5.2% in the last 24 hours',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    priority: 'medium',
  },
  {
    id: 2,
    ticker: 'KCHOL',
    type: 'price-change',
    message: 'KCHOL price decreased by 3.8% in the last 24 hours',
    date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    read: true,
    priority: 'medium',
  },
  {
    id: 3,
    ticker: 'TUPRS',
    type: 'suggestion',
    message: 'Consider adding to TUPRS position - trading near support level',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    priority: 'low',
  },
  {
    id: 4,
    ticker: 'THYAO',
    type: 'suggestion',
    message: 'THYAO showing strong momentum - potential breakout candidate',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    priority: 'low',
  },
];

export const notes: Note[] = [
  {
    id: 1,
    title: 'Investment Strategy for Q4',
    content: 'We should consider increasing our banking sector exposure given the positive interest rate environment. Potential candidates: AKBNK, ISCTR, VAKBN.',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['strategy', 'banking']
  },
  {
    id: 2,
    title: 'End of Year Dividend Discussion',
    content: 'Group agreed to reinvest all dividends from 2023 rather than distributing to members. Will reassess in January 2024.',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['dividends', 'policy']
  },
];

// Calculate portfolio summary data
export const getPortfolioSummary = () => {
  let totalInvestment = 0;
  let currentValue = 0;
  
  stocks.forEach(stock => {
    totalInvestment += stock.quantity * stock.purchasePrice;
    currentValue += stock.quantity * stock.currentPrice;
  });
  
  const totalProfit = currentValue - totalInvestment;
  const profitPercentage = (totalProfit / totalInvestment) * 100;
  
  return {
    totalInvestment,
    currentValue,
    totalProfit,
    profitPercentage
  };
};

// Calculate monthly payment summary data
export const getMonthlyPaymentSummary = (month: number, year: number) => {
  const monthStr = month.toString().padStart(2, '0');
  const monthPayments = payments.filter(payment => {
    if (!payment.date) return false;
    return payment.date.startsWith(`${year}-${monthStr}`);
  });
  
  const monthlyPaymentSummary = {
    month: `${year}-${monthStr}`,
    totalExpected: 5 * 7000, // 5 members * 7000 TL
    totalReceived: monthPayments.reduce((sum, payment) => sum + (payment.status === 'paid' ? payment.amount : 0), 0),
    memberPayments: members.map(member => {
      const memberPayment = monthPayments.find(payment => payment.memberId === member.id);
      return {
        memberId: member.id,
        status: memberPayment?.status || 'pending',
        amount: memberPayment?.amount || 0
      };
    })
  };
  
  return monthlyPaymentSummary;
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

// Calculate profit/loss
export const calculateProfitLoss = (stock: Stock) => {
  const investment = stock.quantity * stock.purchasePrice;
  const currentValue = stock.quantity * stock.currentPrice;
  const profitLoss = currentValue - investment;
  const profitLossPercentage = (profitLoss / investment) * 100;
  
  return {
    investment,
    currentValue,
    profitLoss,
    profitLossPercentage
  };
};