import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { ChatWindow } from './ChatWindow';

export const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={toggleChat}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:scale-105 transition-transform"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && <ChatWindow onClose={toggleChat} />}
    </>
  );
};
