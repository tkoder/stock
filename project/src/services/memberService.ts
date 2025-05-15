import { supabase } from '../lib/supabase';
import { Member } from '../types';

export const memberService = {
  async getMembers(): Promise<Member[]> {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async addMember(name: string): Promise<Member> {
    const { data, error } = await supabase
      .from('members')
      .insert([{ name }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateMember(id: string, name: string): Promise<void> {
    const { error } = await supabase
      .from('members')
      .update({ name })
      .eq('id', id);

    if (error) throw error;
  },

  async deleteMember(id: string): Promise<void> {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};