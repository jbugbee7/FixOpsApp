
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, Search } from 'lucide-react';

interface User {
  id: string;
  full_name: string;
  email: string;
  is_member: boolean;
}

interface AddUsersToConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string | null;
  conversationName: string;
  onUsersAdded: () => void;
}

const AddUsersToConversationDialog = ({ 
  open, 
  onOpenChange, 
  conversationId, 
  conversationName,
  onUsersAdded
}: AddUsersToConversationDialogProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingUsers, setIsAddingUsers] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    if (!conversationId) return;

    setIsLoading(true);
    try {
      // Get all users
      const { data: allUsers, error: usersError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .order('full_name');

      if (usersError) throw usersError;

      // Get current conversation members
      const { data: members, error: membersError } = await supabase
        .from('conversation_members')
        .select('user_id')
        .eq('conversation_id', conversationId);

      if (membersError) throw membersError;

      const memberIds = new Set(members?.map(m => m.user_id) || []);

      const usersWithMembership = (allUsers || []).map(user => ({
        ...user,
        is_member: memberIds.has(user.id)
      }));

      setUsers(usersWithMembership);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Failed to Load Users",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addUsersToConversation = async () => {
    if (!conversationId || selectedUsers.length === 0) return;

    setIsAddingUsers(true);
    try {
      const insertData = selectedUsers.map(userId => ({
        conversation_id: conversationId,
        user_id: userId
      }));

      const { error } = await supabase
        .from('conversation_members')
        .insert(insertData);

      if (error) throw error;

      toast({
        title: "Users Added Successfully",
        description: `Added ${selectedUsers.length} user(s) to ${conversationName}`,
      });

      setSelectedUsers([]);
      onUsersAdded();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error adding users:', error);
      toast({
        title: "Failed to Add Users",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingUsers(false);
    }
  };

  useEffect(() => {
    if (open && conversationId) {
      fetchUsers();
    }
  }, [open, conversationId]);

  const filteredUsers = users.filter(user => 
    !user.is_member && (
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-purple-500" />
            <span>Add Users to {conversationName}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              <span className="ml-2 text-slate-500">Loading users...</span>
            </div>
          ) : (
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-2">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-4 text-slate-500">
                    {searchTerm ? 'No users found matching your search' : 'All users are already members'}
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleUserToggle(user.id)}
                        className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-purple-500 text-white text-sm">
                          {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                          {user.full_name || user.email}
                        </p>
                        {user.full_name && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          )}
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={addUsersToConversation}
              disabled={selectedUsers.length === 0 || isAddingUsers}
              className="bg-purple-500 hover:bg-purple-600"
            >
              {isAddingUsers ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              Add {selectedUsers.length > 0 && `(${selectedUsers.length})`} Users
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUsersToConversationDialog;
