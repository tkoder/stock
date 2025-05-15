import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Stock } from '../types';

interface StockFormProps {
  stock?: Stock;
  onSubmit: (stockData: Omit<Stock, 'id' | 'currentPrice' | 'lastUpdated'>) => void;
  onCancel: () => void;
}

const StockForm: React.FC<StockFormProps> = ({ stock, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    ticker: stock?.ticker || '',
    name: stock?.name || '',
    quantity: stock?.quantity || 0,
    purchasePrice: stock?.purchasePrice || 0,
    purchaseDate: stock?.purchaseDate ? stock.purchaseDate.split('T')[0] : new Date().toISOString().split('T')[0]
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.ticker) {
      newErrors.ticker = 'Ticker is required';
    }
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    if (formData.purchasePrice <= 0) {
      newErrors.purchasePrice = 'Purchase price must be greater than 0';
    }
    
    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Purchase date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        ticker: formData.ticker.toUpperCase(),
        name: formData.name,
        quantity: Number(formData.quantity),
        purchasePrice: Number(formData.purchasePrice),
        purchaseDate: formData.purchaseDate
      });
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary">
          {stock ? 'Edit Stock' : 'Add New Stock'}
        </h2>
        <button 
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <X size={24} className="text-gray-500" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="ticker" className="form-label">Ticker Symbol</label>
            <input
              type="text"
              id="ticker"
              name="ticker"
              value={formData.ticker}
              onChange={handleChange}
              className={`form-input ${errors.ticker ? 'border-error' : ''}`}
              placeholder="e.g. THYAO"
            />
            {errors.ticker && <p className="mt-1 text-sm text-error">{errors.ticker}</p>}
          </div>
          
          <div>
            <label htmlFor="name" className="form-label">Company Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'border-error' : ''}`}
              placeholder="e.g. Türk Hava Yolları"
            />
            {errors.name && <p className="mt-1 text-sm text-error">{errors.name}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="form-label">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className={`form-input ${errors.quantity ? 'border-error' : ''}`}
                min="1"
                step="1"
              />
              {errors.quantity && <p className="mt-1 text-sm text-error">{errors.quantity}</p>}
            </div>
            
            <div>
              <label htmlFor="purchasePrice" className="form-label">Purchase Price (TL)</label>
              <input
                type="number"
                id="purchasePrice"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                className={`form-input ${errors.purchasePrice ? 'border-error' : ''}`}
                min="0.01"
                step="0.01"
              />
              {errors.purchasePrice && <p className="mt-1 text-sm text-error">{errors.purchasePrice}</p>}
            </div>
          </div>
          
          <div>
            <label htmlFor="purchaseDate" className="form-label">Purchase Date</label>
            <input
              type="date"
              id="purchaseDate"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              className={`form-input ${errors.purchaseDate ? 'border-error' : ''}`}
            />
            {errors.purchaseDate && <p className="mt-1 text-sm text-error">{errors.purchaseDate}</p>}
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            {stock ? 'Update Stock' : 'Add Stock'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockForm;