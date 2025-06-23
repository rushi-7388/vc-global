import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRealtimeConsultations } from '@/hooks/useRealtimeConsultations';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

export const RealtimeNotifications = () => {
  const { consultations, newRequestCount, markAsRead } = useRealtimeConsultations();

  const handleOpenChange = (open: boolean) => {
    if (open) {
      markAsRead();
    }
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {newRequestCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {newRequestCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Consultation Requests</h4>
            <Badge variant="secondary">{consultations.length} total</Badge>
          </div>
          
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {consultations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No consultation requests yet
                </p>
              ) : (
                consultations.map((consultation) => (
                  <div 
                    key={consultation.id} 
                    className="p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{consultation.name}</p>
                        <p className="text-xs text-muted-foreground">{consultation.email}</p>
                        <p className="text-xs">
                          Type: <span className="capitalize">{consultation.consultation_type}</span>
                        </p>
                        {consultation.preferred_date && (
                          <p className="text-xs">
                            Date: {consultation.preferred_date}
                            {consultation.preferred_time && ` at ${consultation.preferred_time}`}
                          </p>
                        )}
                      </div>
                      <Badge 
                        variant={consultation.status === 'pending' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {consultation.status}
                      </Badge>
                    </div>
                    {consultation.message && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {consultation.message}
                      </p>
                    )}
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
