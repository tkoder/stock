export interface Member {
  id: number;
  name: string;
}

export interface Payment {
  id: number;
  memberId: number;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'late';
  note?: string;
}

export interface Stock {
  id: number;
  ticker: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  currentPrice: number;
  lastUpdated: string;
}

export interface Alert {
  id: number;
  ticker: string;
  type: 'price-change' | 'suggestion';
  message: string;
  date: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  tags?: string[];
}

export interface MonthlyPaymentSummary {
  month: string;
  totalExpected: number;
  totalReceived: number;
  memberPayments: {
    memberId: number;
    status: 'paid' | 'pending' | 'late';
    amount: number;
  }[];
}

export interface PortfolioSummary {
  totalInvestment: number;
  currentValue: number;
  totalProfit: number;
  profitPercentage: number;
}