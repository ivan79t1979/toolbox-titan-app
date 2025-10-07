'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

export function CountdownTimer() {
  const [initialDuration, setInitialDuration] = useState({
    years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 5, seconds: 0
  });
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const calculateTotalSeconds = (duration: typeof initialDuration) => {
    return (
      (duration.years || 0) * 31536000 +
      (duration.months || 0) * 2628000 +
      (duration.weeks || 0) * 604800 +
      (duration.days || 0) * 86400 +
      (duration.hours || 0) * 3600 +
      (duration.minutes || 0) * 60 +
      (duration.seconds || 0)
    );
  };
  
  useEffect(() => {
    const seconds = calculateTotalSeconds(initialDuration);
    setTotalSeconds(seconds);
    setTimeLeft(seconds);
  }, [initialDuration]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsTimeUp(true);
      playAlarm();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleStartPause = () => {
    if (totalSeconds > 0) {
      setIsActive(!isActive);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    const seconds = calculateTotalSeconds(initialDuration);
    setTimeLeft(seconds);
  };

  const handleInputChange = (unit: keyof typeof initialDuration, value: string) => {
    if (!isActive) {
        setInitialDuration(prev => ({
            ...prev,
            [unit]: parseInt(value, 10) || 0
        }));
    }
  };

  const displayedTime = useMemo(() => {
    const d = Math.floor(timeLeft / (3600 * 24));
    const h = Math.floor((timeLeft % (3600 * 24)) / 3600);
    const m = Math.floor((timeLeft % 3600) / 60);
    const s = Math.floor(timeLeft % 60);
    return { d, h, m, s };
  }, [timeLeft]);

  const progress = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;
  
  const playAlarm = () => {
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.error("Could not play alarm sound.", e);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Set Countdown Duration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {(Object.keys(initialDuration) as (keyof typeof initialDuration)[]).map(unit => (
                 <div key={unit} className="space-y-2">
                    <Label htmlFor={unit} className="capitalize">{unit}</Label>
                    <Input
                        id={unit}
                        type="number"
                        min="0"
                        value={initialDuration[unit]}
                        onChange={(e) => handleInputChange(unit, e.target.value)}
                        disabled={isActive}
                    />
                </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-4 my-8">
                {displayedTime.d > 0 && <TimeUnit value={displayedTime.d} label="Days" />}
                <TimeUnit value={displayedTime.h} label="Hours" />
                <TimeUnit value={displayedTime.m} label="Minutes" />
                <TimeUnit value={displayedTime.s} label="Seconds" />
            </div>
          
            <Progress value={progress} className="max-w-md mx-auto mb-8" />
            
            <div className="flex justify-center gap-4">
                <Button onClick={handleStartPause} size="lg" className="w-40 text-xl" disabled={totalSeconds <= 0}>
                  {isActive ? <Pause className="mr-2"/> : <Play className="mr-2"/>}
                  {isActive ? 'Pause' : 'Start'}
                </Button>
                <Button onClick={handleReset} variant="outline" size="lg" className="text-xl">
                  <RotateCcw className="mr-2" /> Reset
                </Button>
            </div>
        </CardContent>
      </Card>

      <AlertDialog open={isTimeUp} onOpenChange={setIsTimeUp}>
        <AlertDialogContent>
          <AlertDialogHeader className="items-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-primary"/>
            </div>
            <AlertDialogTitle>Time's Up!</AlertDialogTitle>
            <AlertDialogDescription>
              Your countdown has finished.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsTimeUp(false)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number, label: string }) {
    return (
        <div className="flex flex-col items-center">
            <div className="text-6xl font-bold font-mono">{value.toString().padStart(2, '0')}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
        </div>
    )
}
