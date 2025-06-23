import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { useLiveChat } from '@/hooks/useLiveChat';

interface ChatWindowProps {
  onClose: () => void;
}

export const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const {
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    handleSendMessage
  } = useLiveChat(true);

  return (
    <Card className="fixed bottom-20 right-4 w-80 h-96 z-50 shadow-2xl border-2">
      <CardHeader className="flex flex-row items-center justify-between p-4 bg-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="text-lg">AI Support Chat</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-primary-foreground hover:bg-primary-foreground/20">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-80">
        <ChatMessageList messages={messages} />
        <ChatInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};
