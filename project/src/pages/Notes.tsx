import React, { useState } from 'react';
import { Plus, FileText, Search, Tag, Trash2, Edit2 } from 'lucide-react';
import NoteCard from '../components/NoteCard';
import NoteForm from '../components/NoteForm';
import { notes as initialNotes } from '../data/initialData';
import { Note } from '../types';
import { formatDate } from '../services/utils';

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState<string>('all');
  
  // Get all unique tags from notes
  const getAllTags = (): string[] => {
    const allTags: string[] = [];
    
    notes.forEach(note => {
      if (note.tags) {
        note.tags.forEach(tag => {
          if (!allTags.includes(tag)) {
            allTags.push(tag);
          }
        });
      }
    });
    
    return allTags.sort();
  };
  
  const allTags = getAllTags();
  
  // Filter notes based on search term and tag filter
  const filteredNotes = notes.filter(note => {
    // Filter by search term
    const matchesSearch = 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tag
    const matchesTag = tagFilter === 'all' || 
      (note.tags && note.tags.includes(tagFilter));
    
    return matchesSearch && matchesTag;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Add new note
  const handleAddNote = (noteData: Omit<Note, 'id' | 'date'>) => {
    const newNote: Note = {
      id: notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1,
      ...noteData,
      date: new Date().toISOString()
    };
    
    setNotes([newNote, ...notes]);
    setShowAddForm(false);
  };
  
  // Edit note
  const handleEditNote = (noteId: number) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setEditingNote(note);
    }
  };
  
  // Update note
  const handleUpdateNote = (noteData: Omit<Note, 'id' | 'date'>) => {
    if (!editingNote) return;
    
    const updatedNote: Note = {
      ...editingNote,
      ...noteData,
      date: new Date().toISOString()
    };
    
    const updatedNotes = notes.map(n => n.id === editingNote.id ? updatedNote : n);
    setNotes(updatedNotes);
    setEditingNote(null);
  };
  
  // Delete note
  const handleDeleteNote = (noteId: number) => {
    if (confirm('Are you sure you want to delete this note?')) {
      const updatedNotes = notes.filter(n => n.id !== noteId);
      setNotes(updatedNotes);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Admin Notes</h1>
        
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus size={16} className="mr-2" />
          <span>Add Note</span>
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
        
        {allTags.length > 0 && (
          <div className="flex items-center">
            <Tag size={18} className="text-gray-400 mr-2" />
            <select 
              value={tagFilter}
              onChange={e => setTagFilter(e.target.value)}
              className="form-input min-w-[150px]"
            >
              <option value="all">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {/* Notes List */}
      {filteredNotes.length > 0 ? (
        <div className="space-y-4">
          {filteredNotes.map(note => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <FileText size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">
            {searchTerm || tagFilter !== 'all' 
              ? 'No notes found matching your filters.' 
              : 'No notes yet. Add your first note to get started.'}
          </p>
        </div>
      )}
      
      {/* Add/Edit Note Form Modal */}
      {(showAddForm || editingNote) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          {showAddForm ? (
            <NoteForm 
              onSubmit={handleAddNote} 
              onCancel={() => setShowAddForm(false)} 
            />
          ) : (
            <NoteForm 
              note={editingNote || undefined} 
              onSubmit={handleUpdateNote} 
              onCancel={() => setEditingNote(null)} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Notes;