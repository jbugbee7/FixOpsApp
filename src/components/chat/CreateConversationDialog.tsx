
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CreateConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationCreated: () => void;
}

const CreateConversationDialog = ({ open, onOpenChange, onConversationCreated }: CreateConversationDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !user) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('Creating conversation:', { name: name.trim(), description: description.trim() });
      
      // Create the conversation
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          name: name.trim(),
          is_group: true
        })
        .select()
        .single();

      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
        // Check if it's a permission error
        if (conversationError.code === '42501' || conversationError.message.includes('policy')) {
          throw new Error('Only administrators can create conversations. Please contact an admin if you need a new conversation.');
        }
        throw conversationError;
      }

      console.log('Conversation created:', conversation);

      // Add the creator as a member (admin can do this)
      const { error: memberError } = await supabase
        .from('conversation_members')
        .insert({
          conversation_id: conversation.id,
          user_id: user.id
        });

      if (memberError) {
        console.error('Error adding creator as member:', memberError);
        // Don't throw here, the conversation was created successfully
      }

      toast({
        title: "Conversation Created",
        description: `"${name}" has been created successfully.`,
      });

      // Reset form and close dialog
      setName('');
      setDescription('');
      onOpenChange(false);
      onConversationCreated();
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Failed to Create Conversation",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Conversation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter conversation name"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              disabled={isLoading}
              className="min-h-[80px]"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateConversationDialog;
