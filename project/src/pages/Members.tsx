import React, { useState, useEffect } from 'react';
import { Plus, UserX, UserCog, Users } from 'lucide-react';
import { Member } from '../types';
import { memberService } from '../services/memberService';
import MemberForm from '../components/MemberForm';

const Members: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await memberService.getMembers();
      setMembers(data);
    } catch (err) {
      setError('Failed to load members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (name: string) => {
    try {
      const newMember = await memberService.addMember(name);
      setMembers([newMember, ...members]);
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add member');
      console.error(err);
    }
  };

  const handleUpdateMember = async (name: string) => {
    if (!editingMember) return;

    try {
      await memberService.updateMember(editingMember.id, name);
      setMembers(members.map(m => 
        m.id === editingMember.id ? { ...m, name } : m
      ));
      setEditingMember(null);
    } catch (err) {
      setError('Failed to update member');
      console.error(err);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member? This will also delete all associated payments.')) {
      return;
    }

    try {
      await memberService.deleteMember(id);
      setMembers(members.filter(m => m.id !== id));
    } catch (err) {
      setError('Failed to delete member');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Members</h1>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus size={16} className="mr-2" />
          <span>Add Member</span>
        </button>
      </div>

      {error && (
        <div className="bg-error bg-opacity-10 border border-error text-error px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map(member => (
            <div key={member.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <Users size={20} className="text-primary mr-3" />
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingMember(member)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    title="Edit member"
                  >
                    <UserCog size={18} className="text-gray-500 hover:text-primary" />
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    title="Delete member"
                  >
                    <UserX size={18} className="text-gray-500 hover:text-error" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Users size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">No members yet. Add your first member to get started.</p>
        </div>
      )}

      {/* Add/Edit Member Modal */}
      {(showAddForm || editingMember) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <MemberForm
            initialName={editingMember?.name}
            onSubmit={editingMember ? handleUpdateMember : handleAddMember}
            onCancel={() => {
              setShowAddForm(false);
              setEditingMember(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Members;