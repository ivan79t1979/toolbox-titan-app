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
    // Set initial time on mount and then update every second
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
        // Invalid timezone will throw an error
        return "Invalid Timezone"
    }

    // Fallback for environments that might not support `shortOffset` fully.
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

  const addClock = (value: string) => {
    const searchTerm = value.toLowerCase();
    
    // First, try to find a match in the predefined list (city, country, or timezone)
    const existing = timezones.find(
      (tz) =>
        tz.city.toLowerCase() === searchTerm ||
        tz.timezone.toLowerCase() === searchTerm
    );
    
    let clockToAdd: Clock | null = null;
    
    if (existing) {
      clockToAdd = existing;
    } else {
      // If no exact match, try to use the value as a timezone identifier
      try {
        new Intl.DateTimeFormat('en-US', { timeZone: value }).format();
        const city = value.split('/').pop()?.replace(/_/g, ' ') || 'Custom';
        const country = value.split('/')[0].replace(/_/g, ' ');
        clockToAdd = {
            city: city,
            timezone: value,
            country: country,
        };
      } catch (e) {
        // Invalid timezone, show error
        toast({
          variant: 'destructive',
          title: 'Invalid Timezone',
          description: `Could not find a valid timezone for "${value}".`,
        });
      }
    }

    if (clockToAdd) {
        if (!clocks.some(c => c.timezone === clockToAdd!.timezone)) {
            setClocks([...clocks, clockToAdd]);
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
    
  const showCustomOption = searchValue && !filteredTimezones.some(f => f.city.toLowerCase() === searchValue.toLowerCase());

  return (
    <div className="space-y-6">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add City
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput 
                placeholder="Search city or timezone..."
                value={searchValue}
                onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>No city or timezone found.</CommandEmpty>
                {showCustomOption && (
                    <CommandItem onSelect={() => addClock(searchValue)}>
                        Use: "{searchValue}"
                    </CommandItem>
                )}
              <CommandGroup>
                {filteredTimezones.map((tz) => (
                  <CommandItem
                    key={tz.timezone}
                    value={tz.city}
                    onSelect={(currentValue) => {
                      // The `currentValue` from cmdk is the lowercase city name,
                      // so we use the original tz object to add the clock.
                      addClock(tz.timezone);
                    }}
                  >
                    {tz.city}, {tz.country}
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
            Click "Add City" to get started.
          </p>
        </div>
      )}
    </div>
  );
}
