import React, { useState } from 'react';
import { X } from 'lucide-react';

interface MemberFormProps {
  initialName?: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ initialName = '', onSubmit, onCancel }) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    onSubmit(name.trim());
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary">
          {initialName ? 'Edit Member' : 'Add New Member'}
        </h2>
        <button 
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <X size={24} className="text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            className={`form-input ${error ? 'border-error' : ''}`}
            placeholder="Enter member name"
          />
          {error && <p className="mt-1 text-sm text-error">{error}</p>}
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
            {initialName ? 'Update Member' : 'Add Member'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;