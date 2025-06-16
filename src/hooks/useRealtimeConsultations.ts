
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  preferred_date?: string;
  preferred_time?: string;
  consultation_type: string;
  message?: string;
  status: string;
  created_at: string;
}

export const useRealtimeConsultations = () => {
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [newRequestCount, setNewRequestCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch existing consultations
    const fetchConsultations = async () => {
      const { data, error } = await supabase
        .from('consultation_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching consultations:', error);
        return;
      }

      setConsultations(data || []);
    };

    fetchConsultations();

    // Set up real-time subscription
    const channel = supabase
      .channel('consultation-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'consultation_requests'
        },
        (payload) => {
          const newConsultation = payload.new as ConsultationRequest;
          
          // Add to consultations list
          setConsultations(prev => [newConsultation, ...prev]);
          
          // Increment new request count
          setNewRequestCount(prev => prev + 1);
          
          // Show toast notification
          toast({
            title: "🔔 New Consultation Request!",
            description: `${newConsultation.name} has requested a ${newConsultation.consultation_type} consultation.`,
          });

          // Browser notification (if permission granted)
          if (Notification.permission === 'granted') {
            new Notification('New Consultation Request', {
              body: `${newConsultation.name} has requested a consultation`,
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
          table: 'consultation_requests'
        },
        (payload) => {
          const updatedConsultation = payload.new as ConsultationRequest;
          
          // Update consultations list
          setConsultations(prev => 
            prev.map(c => c.id === updatedConsultation.id ? updatedConsultation : c)
          );
          
          toast({
            title: "Consultation Updated",
            description: `Consultation status updated to ${updatedConsultation.status}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const markAsRead = () => {
    setNewRequestCount(0);
  };

  return {
    consultations,
    newRequestCount,
    markAsRead
  };
};
