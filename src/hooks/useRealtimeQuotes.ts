
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QuoteSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  message?: string;
  submission_type: string;
  status: string;
  created_at: string;
}

export const useRealtimeQuotes = () => {
  const [quotes, setQuotes] = useState<QuoteSubmission[]>([]);
  const [newQuoteCount, setNewQuoteCount] = useState(0);
  const { toast } = useToast();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    console.log('Setting up realtime quote subscription...');
    
    // Fetch existing quote submissions
    const fetchQuotes = async () => {
      console.log('Fetching existing quote submissions...');
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .eq('submission_type', 'quote')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quotes:', error);
        return;
      }

      console.log('Fetched quotes:', data?.length || 0);
      setQuotes(data || []);
    };

    fetchQuotes();

    // Clean up any existing channel first
    if (channelRef.current) {
      console.log('Cleaning up existing channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Set up real-time subscription with unique channel name
    const channelName = `quote-changes-${Math.random().toString(36).substr(2, 9)}`;
    channelRef.current = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contact_submissions',
          filter: 'submission_type=eq.quote'
        },
        (payload) => {
          console.log('New quote request received:', payload);
          const newQuote = payload.new as QuoteSubmission;
          
          // Add to quotes list
          setQuotes(prev => [newQuote, ...prev]);
          
          // Increment new quote count
          setNewQuoteCount(prev => prev + 1);
          
          // Show toast notification
          toast({
            title: "💰 New Quote Request!",
            description: `${newQuote.name} has requested a quote for ${newQuote.projectType || 'their project'}.`,
          });

          // Browser notification (if permission granted)
          if (Notification.permission === 'granted') {
            new Notification('New Quote Request', {
              body: `${newQuote.name} has requested a quote`,
              icon: '/favicon.ico'
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'contact_submissions',
          filter: 'submission_type=eq.quote'
        },
        (payload) => {
          console.log('Quote updated:', payload);
          const updatedQuote = payload.new as QuoteSubmission;
          
          // Update quotes list
          setQuotes(prev => 
            prev.map(q => q.id === updatedQuote.id ? updatedQuote : q)
          );
          
          toast({
            title: "Quote Updated",
            description: `Quote status updated to ${updatedQuote.status}`,
          });
        }
      )
      .subscribe();

    console.log('Realtime quote subscription established');

    return () => {
      console.log('Cleaning up realtime quote subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [toast]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      console.log('Requesting notification permission...');
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }, []);

  const markAsRead = () => {
    console.log('Marking quote notifications as read');
    setNewQuoteCount(0);
  };

  return {
    quotes,
    newQuoteCount,
    markAsRead
  };
};
