
-- Enable realtime for contact_submissions table
ALTER TABLE contact_submissions REPLICA IDENTITY FULL;

-- Add the table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE contact_submissions;
