'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Trash2, Globe } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { timezones } from './timezones';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Clock {
  city: string;
  timezone: string;
  country: string;
}

const defaultClocks: Clock[] = [
  { city: 'London', timezone: 'Europe/London', country: 'UK' },
  { city: 'Tokyo', timezone: 'Asia/Tokyo', country: 'Japan' },
  { city: 'New York', timezone: 'America/New_York', country: 'USA' },
];

function ClockCard({ clock, onRemove }: { clock: Clock; onRemove: () => void }) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return (
       <Card>
        <CardHeader>
            <div className="flex justify-between items-start">
            <div>
                <CardTitle>{clock.city}</CardTitle>
                <CardDescription>{clock.country}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onRemove}>
                <Trash2 className="h-4 w-4" />
            </Button>
            </div>
        </CardHeader>
        <CardContent>
            <p className="text-4xl font-bold font-mono">--:--:--</p>
            <p className="text-muted-foreground">Loading...</p>
            <p className="text-sm text-muted-foreground mt-2">&nbsp;</p>
        </CardContent>
      </Card>
    )
  }

  const localTime = time.toLocaleTimeString('en-US', {
    timeZone: clock.timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const localDate = time.toLocaleDateString('en-US', {
    timeZone: clock.timezone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getOffset = () => {
    try {
        const formatter = new Intl.DateTimeFormat('en-US', { timeZone: clock.timezone, timeZoneName: 'shortOffset' });
        const parts = formatter.formatToParts(new Date());
        const offsetPart = parts.find(part => part.type === 'timeZoneName');
        
        if (offsetPart) return offsetPart.value;
    } catch(e) {
        return "Invalid Timezone"
    }

    const localOffset = -new Date().getTimezoneOffset() / 60;
    const cityDate = new Date(time.toLocaleString('en-US', { timeZone: clock.timezone }));
    const cityOffset = isNaN(cityDate.getTime()) ? localOffset : -cityDate.getTimezoneOffset() / 60;
    const diff = cityOffset - localOffset;

    return `UTC${diff >= 0 ? '+' : ''}${diff}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{clock.city}</CardTitle>
            <CardDescription>{clock.country}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold font-mono">{localTime}</p>
        <p className="text-muted-foreground">{localDate}</p>
        <p className="text-sm text-muted-foreground mt-2">{getOffset()}</p>
      </CardContent>
    </Card>
  );
}

export function WorldClock() {
  const [clocks, setClocks] = useState<Clock[]>(defaultClocks);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { toast } = useToast();
  
  const getOffsetString = (timezone: string): string => {
    try {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        timeZoneName: "shortOffset",
      });
      const parts = formatter.formatToParts(new Date());
      const offsetPart = parts.find((part) => part.type === "timeZoneName");
      return offsetPart?.value || "";
    } catch (e) {
      return "";
    }
  };


  const addClock = (timezoneIdentifier: string) => {
    // Check if the user is selecting from the dropdown (using the full timezone)
    // or trying a custom value.
    const selectedTz = timezones.find(
      (tz) => tz.timezone.toLowerCase() === timezoneIdentifier.toLowerCase() ||
               tz.city.toLowerCase() === timezoneIdentifier.toLowerCase()
    );

    let clockToAdd: Clock | null = selectedTz || null;
    
    if (!clockToAdd) {
        // Handle custom input
        try {
            // Validate timezone
            new Intl.DateTimeFormat('en-US', { timeZone: timezoneIdentifier }).format();
            
            const city = timezoneIdentifier.split('/').pop()?.replace(/_/g, ' ') || 'Custom';
            const country = timezoneIdentifier.split('/')[0].replace(/_/g, ' ');
            clockToAdd = {
                city: city,
                timezone: timezoneIdentifier,
                country: country,
            };
        } catch (e) {
            toast({
            variant: 'destructive',
            title: 'Invalid Timezone',
            description: `Could not find a valid timezone for "${timezoneIdentifier}".`,
            });
            return;
        }
    }


    if (clockToAdd) {
        if (!clocks.some(c => c.timezone === clockToAdd!.timezone)) {
            setClocks([...clocks, clockToAdd]);
        } else {
            toast({
                title: 'Timezone Already Added',
                description: `${clockToAdd.city} is already in your list.`,
            })
        }
    }
    
    setSearchValue('');
    setOpen(false);
  };

  const removeClock = (timezone: string) => {
    setClocks(clocks.filter((c) => c.timezone !== timezone));
  };
  
  const filteredTimezones = searchValue
    ? timezones.filter(tz => 
        tz.city.toLowerCase().includes(searchValue.toLowerCase()) || 
        tz.country.toLowerCase().includes(searchValue.toLowerCase()) ||
        tz.timezone.toLowerCase().includes(searchValue.toLowerCase())
      )
    : timezones;
    
  const showCustomOption = searchValue && !filteredTimezones.some(f => f.timezone.toLowerCase() === searchValue.toLowerCase());

  return (
    <div className="space-y-6">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Time Zone
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] p-0">
          <Command>
            <CommandInput 
                placeholder="Search by city or timezone..."
                value={searchValue}
                onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>No timezone found.</CommandEmpty>
                {showCustomOption && (
                    <CommandItem onSelect={() => addClock(searchValue)}>
                        Use: "{searchValue}"
                    </CommandItem>
                )}
              <CommandGroup>
                {filteredTimezones.map((tz) => (
                  <CommandItem
                    key={tz.timezone}
                    value={tz.timezone}
                    onSelect={(currentValue) => {
                      addClock(currentValue);
                    }}
                  >
                    <div className="flex flex-col">
                      <span>{tz.city}, {tz.country} <span className="text-muted-foreground">({getOffsetString(tz.timezone)})</span></span>
                      <span className="text-xs text-muted-foreground">{tz.timezone}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {clocks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clocks.map((clock) => (
            <ClockCard
              key={clock.timezone}
              clock={clock}
              onRemove={() => removeClock(clock.timezone)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <Globe className="w-12 h-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Your world clocks will appear here.</p>
          <p className="text-sm text-muted-foreground">
            Click "Add Time Zone" to get started.
          </p>
        </div>
      )}
    </div>
  );
}
