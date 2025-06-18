
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
}

export const ChatInput = ({ newMessage, setNewMessage, onSendMessage, isLoading }: ChatInputProps) => {
  return (
    <div className="p-4 border-t bg-muted/30">
      <div className="flex gap-2">
        <Input
          placeholder="Ask about our products and services..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && onSendMessage()}
          disabled={isLoading}
        />
        <Button 
          onClick={onSendMessage} 
          size="sm" 
          disabled={isLoading || !newMessage.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {isLoading ? 'AI is thinking...' : 'Press Enter to send'}
      </p>
    </div>
  );
};
