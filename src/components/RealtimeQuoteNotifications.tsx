
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRealtimeQuotes } from '@/hooks/useRealtimeQuotes';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

export const RealtimeQuoteNotifications = () => {
  const { quotes, newQuoteCount, markAsRead } = useRealtimeQuotes();

  const handleOpenChange = (open: boolean) => {
    if (open) {
      markAsRead();
    }
  };

  const formatBudget = (budget: string | undefined) => {
    if (!budget) return 'Not specified';
    return budget;
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <DollarSign className="h-4 w-4" />
          {newQuoteCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {newQuoteCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Quote Requests</h4>
            <Badge variant="secondary">{quotes.length} total</Badge>
          </div>
          
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {quotes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No quote requests yet
                </p>
              ) : (
                quotes.map((quote) => (
                  <div 
                    key={quote.id} 
                    className="p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{quote.name}</p>
                        <p className="text-xs text-muted-foreground">{quote.email}</p>
                        {quote.phone && (
                          <p className="text-xs">Phone: {quote.phone}</p>
                        )}
                        {quote.projectType && (
                          <p className="text-xs">
                            Project: <span className="capitalize">{quote.projectType}</span>
                          </p>
                        )}
                        <p className="text-xs">
                          Budget: {formatBudget(quote.budget)}
                        </p>
                      </div>
                      <Badge 
                        variant={quote.status === 'new' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {quote.status}
                      </Badge>
                    </div>
                    {quote.message && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {quote.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(quote.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};
