
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Users } from 'lucide-react';

interface ConversationMember {
  user_id: string;
  full_name: string;
  email: string;
  joined_at: string;
}

interface ConversationMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string | null;
  conversationName: string;
}

const ConversationMembersDialog = ({ 
  open, 
  onOpenChange, 
  conversationId, 
  conversationName 
}: ConversationMembersDialogProps) => {
  const [members, setMembers] = useState<ConversationMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchMembers = async () => {
    if (!conversationId) return;

    setIsLoading(true);
    try {
      // Get conversation members with their profile info
      const { data: memberData, error: membersError } = await supabase
        .from('conversation_members')
        .select('user_id, joined_at')
        .eq('conversation_id', conversationId);

      if (membersError) throw membersError;

      // Get profile info for each member
      if (memberData && memberData.length > 0) {
        const userIds = memberData.map(m => m.user_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        // Combine the data
        const membersWithProfiles = memberData.map(member => {
          const profile = profiles?.find(p => p.id === member.user_id);
          return {
            user_id: member.user_id,
            full_name: profile?.full_name || '',
            email: profile?.email || '',
            joined_at: member.joined_at
          };
        });

        setMembers(membersWithProfiles);
      } else {
        setMembers([]);
      }
    } catch (error: any) {
      console.error('Error fetching members:', error);
      toast({
        title: "Failed to Load Members",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open && conversationId) {
      fetchMembers();
    }
  }, [open, conversationId]);

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>{conversationName} Members</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {members.length} {members.length === 1 ? 'member' : 'members'}
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              <span className="ml-2 text-slate-500">Loading members...</span>
            </div>
          ) : (
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.user_id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-500 text-white">
                        {member.full_name ? member.full_name.charAt(0).toUpperCase() : member.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {member.full_name || member.email}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                        Joined {formatJoinDate(member.joined_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConversationMembersDialog;
