
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
  return (
    <div className={`flex ${message.is_admin ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg text-sm ${
          message.is_admin
            ? 'bg-muted text-foreground rounded-bl-none'
            : 'bg-primary text-primary-foreground rounded-br-none'
        }`}
      >
        <p className="break-words">{message.message}</p>
        <p className="text-xs opacity-70 mt-1">
          {message.is_admin ? 'AI Support' : 'You'} • 
          {new Date(message.created_at).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
};
