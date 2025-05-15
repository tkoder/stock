import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Note } from '../types';

interface NoteFormProps {
  note?: Note;
  onSubmit: (noteData: Omit<Note, 'id' | 'date'>) => void;
  onCancel: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ note, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: note?.title || '',
    content: note?.content || '',
    tags: note?.tags ? note.tags.join(', ') : ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      // Process tags
      let tags: string[] = [];
      if (formData.tags.trim()) {
        tags = formData.tags.split(',').map(tag => tag.trim());
      }
      
      onSubmit({
        title: formData.title,
        content: formData.content,
        tags
      });
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary">
          {note ? 'Edit Note' : 'Add New Note'}
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
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-input ${errors.title ? 'border-error' : ''}`}
              placeholder="Note title"
            />
            {errors.title && <p className="mt-1 text-sm text-error">{errors.title}</p>}
          </div>
          
          <div>
            <label htmlFor="content" className="form-label">Content</label>
            <textarea
              id="content"
              name="content"
              rows={5}
              value={formData.content}
              onChange={handleChange}
              className={`form-input ${errors.content ? 'border-error' : ''}`}
              placeholder="Write your note here..."
            ></textarea>
            {errors.content && <p className="mt-1 text-sm text-error">{errors.content}</p>}
          </div>
          
          <div>
            <label htmlFor="tags" className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. strategy, important, follow-up"
            />
            <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
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
            {note ? 'Update Note' : 'Add Note'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;