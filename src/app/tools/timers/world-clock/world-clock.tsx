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
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
    const localOffset = -new Date().getTimezoneOffset() / 60;
    const cityDate = new Date(time.toLocaleString('en-US', { timeZone: clock.timezone }));
    const cityOffset = -cityDate.getTimezoneOffset() / 60;
    const diff = cityOffset - localOffset;
    
    // This is a workaround because getTimezoneOffset is based on the system's locale settings, not the specified timezone string.
    // A more robust solution uses Intl.DateTimeFormat parts.
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: clock.timezone, timeZoneName: 'shortOffset' });
    const parts = formatter.formatToParts(new Date());
    const offsetPart = parts.find(part => part.type === 'timeZoneName');
    
    if (offsetPart) return offsetPart.value;

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

  const addClock = (timezoneIdentifier: string) => {
    const newClock = timezones.find((tz) => tz.timezone === timezoneIdentifier);
    if (newClock && !clocks.some(c => c.timezone === newClock.timezone)) {
      setClocks([...clocks, newClock]);
    }
    setOpen(false);
  };

  const removeClock = (timezone: string) => {
    setClocks(clocks.filter((c) => c.timezone !== timezone));
  };

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
            <CommandInput placeholder="Search for a city..." />
            <CommandList>
              <CommandEmpty>No city found.</CommandEmpty>
              <CommandGroup>
                {timezones.map((tz) => (
                  <CommandItem
                    key={tz.timezone}
                    value={`${tz.city}, ${tz.country}`}
                    onSelect={() => addClock(tz.timezone)}
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
