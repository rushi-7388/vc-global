
import { useState, useEffect, useRef } from 'react';
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

export const useLiveChat = (isOpen: boolean) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const channelRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) return;

    // Fetch existing messages when chat opens
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
          return;
        }

        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Clean up any existing channel first
    if (channelRef.current) {
      console.log('Cleaning up existing chat channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Set up real-time subscription for chat messages with unique channel name
    const channelName = `chat-messages-${Math.random().toString(36).substr(2, 9)}`;
    channelRef.current = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          console.log('New chat message received:', payload);
          const newChatMessage = payload.new as ChatMessage;
          setMessages(prev => [...prev, newChatMessage]);
          
          // Show toast for admin messages
          if (newChatMessage.is_admin) {
            toast({
              title: "New message from support",
              description: newChatMessage.message,
            });
          }
        }
      )
      .subscribe();

    console.log('Chat realtime subscription established');

    return () => {
      console.log('Cleaning up chat realtime subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [isOpen, toast]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    try {
      // Store user message
      const { error: userMessageError } = await supabase
        .from('chat_messages')
        .insert([{
          message: newMessage,
          sender_name: 'You',
          sender_email: 'user@example.com',
          is_admin: false
        }]);

      if (userMessageError) throw userMessageError;

      const userMessageText = newMessage;
      setNewMessage('');

      // Call AI response function
      console.log('Calling AI response function with message:', userMessageText);
      
      const { data: aiResponseData, error: aiError } = await supabase.functions.invoke('chat-ai-response', {
        body: { userMessage: userMessageText }
      });

      if (aiError) {
        console.error('AI response error:', aiError);
        throw new Error('Failed to get AI response');
      }

      console.log('AI response received:', aiResponseData);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    handleSendMessage
  };
};
