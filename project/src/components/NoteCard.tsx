import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Note } from '../types';
import { formatDate } from '../services/utils';

interface NoteCardProps {
  note: Note;
  onEdit?: (noteId: number) => void;
  onDelete?: (noteId: number) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if content is long enough to need expansion
  const isLongContent = note.content.length > 150;
  
  // Truncate content if not expanded and it's long
  const displayContent = !isExpanded && isLongContent 
    ? `${note.content.substring(0, 150)}...` 
    : note.content;
  
  return (
    <div className="card fade-in">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-primary">{note.title}</h3>
        
        <div className="flex space-x-2">
          {onEdit && (
            <button 
              onClick={() => onEdit(note.id)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              title="Edit note"
            >
              <Edit2 size={16} className="text-gray-500 hover:text-primary" />
            </button>
          )}
          
          {onDelete && (
            <button 
              onClick={() => onDelete(note.id)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              title="Delete note"
            >
              <Trash2 size={16} className="text-gray-500 hover:text-error" />
            </button>
          )}
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mt-1">{formatDate(note.date)}</p>
      
      <div className="mt-3">
        <p className="text-gray-700 whitespace-pre-line">{displayContent}</p>
        
        {isLongContent && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm text-primary hover:text-primary-dark"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
      
      {note.tags && note.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {note.tags.map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteCard;