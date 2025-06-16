
-- Create chat_messages table for live chat functionality
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read chat messages
CREATE POLICY "Anyone can view chat messages" 
  ON public.chat_messages 
  FOR SELECT 
  USING (true);

-- Create policy to allow anyone to insert chat messages
CREATE POLICY "Anyone can send chat messages" 
  ON public.chat_messages 
  FOR INSERT 
  WITH CHECK (true);

-- Enable real-time updates for chat messages
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
