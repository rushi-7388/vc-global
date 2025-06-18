
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  message: string;
  sender_name: string;
  sender_email: string;
  is_admin: boolean;
  created_at: string;
}

interface ChatMessageProps {
  message: ChatMessage;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.message);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEdit = async () => {
    if (editText.trim() === message.message || !editText.trim()) {
      setIsEditing(false);
      setEditText(message.message);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ message: editText.trim() })
        .eq('id', message.id);

      if (error) throw error;

      setIsEditing(false);
      toast({
        title: "Message updated",
        description: "Your message has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating message:', error);
      toast({
        title: "Error",
        description: "Failed to update message. Please try again.",
        variant: "destructive",
      });
      setEditText(message.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', message.id);

      if (error) throw error;

      toast({
        title: "Message deleted",
        description: "Your message has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditText(message.message);
  };

  return (
    <div className={`flex ${message.is_admin ? 'justify-start' : 'justify-end'} group`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg text-sm relative ${
          message.is_admin
            ? 'bg-muted text-foreground rounded-bl-none'
            : 'bg-primary text-primary-foreground rounded-br-none'
        }`}
      >
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
              disabled={isLoading}
              className="text-sm"
            />
            <div className="flex gap-1 justify-end">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleEdit}
                disabled={isLoading}
                className="h-6 px-2"
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={cancelEdit}
                disabled={isLoading}
                className="h-6 px-2"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="break-words">{message.message}</p>
            <p className="text-xs opacity-70 mt-1">
              {message.is_admin ? 'AI Support' : 'You'} • 
              {new Date(message.created_at).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
            
            {/* Show edit/delete buttons only for user messages (not admin) */}
            {!message.is_admin && (
              <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                    disabled={isLoading}
                    className="h-6 w-6 p-0 bg-background border shadow-sm hover:bg-accent"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="h-6 w-6 p-0 bg-background border shadow-sm hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
