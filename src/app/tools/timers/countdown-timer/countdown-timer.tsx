'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Bell, Volume2, Settings } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

type AlarmSoundType = 'beep' | 'bell' | 'digital';
let audioContext: AudioContext | null = null;
let alarmOscillator: OscillatorNode | null = null;
let stopLoop: (() => void) | null = null;

const playTone = (soundType: AlarmSoundType, isLoop: boolean) => {
  if (typeof window === 'undefined') return;

  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.error("Web Audio API is not supported in this browser");
      return;
    }
  }

  stopTone();

  const play = (time: number) => {
    let osc: OscillatorNode | null = null;
    switch (soundType) {
      case 'bell':
        osc = audioContext!.createOscillator();
        const gain = audioContext!.createGain();
        osc.connect(gain);
        gain.connect(audioContext!.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(988, time);
        gain.gain.setValueAtTime(1, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 1);
        osc.start(time);
        osc.stop(time + 1);
        break;
      case 'digital':
        osc = audioContext!.createOscillator();
        osc.connect(audioContext!.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(1200, time);
        osc.start(time);
        osc.stop(time + 0.1);
        break;
      case 'beep':
      default:
        osc = audioContext!.createOscillator();
        osc.connect(audioContext!.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, time);
        osc.start(time);
        osc.stop(time + 0.2);
        break;
    }
    return osc;
  }
  
  if (isLoop) {
    let loopTimeout: NodeJS.Timeout | null = null;
    const loop = () => {
      play(audioContext!.currentTime);
      loopTimeout = setTimeout(loop, 1000); 
    };
    loop();

    stopLoop = () => {
      if (loopTimeout) {
        clearTimeout(loopTimeout);
        loopTimeout = null;
        stopLoop = null;
      }
    };
  } else {
    play(audioContext!.currentTime);
  }
};

const stopTone = () => {
  if (stopLoop) {
    stopLoop();
  }
};

export function CountdownTimer() {
  const [initialDuration, setInitialDuration] = useState({
    years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 5, seconds: 0
  });
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [alarmSound, setAlarmSound] = useState<AlarmSoundType>('bell');


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
  
  const playAlarm = useCallback(() => {
    playTone(alarmSound, true);
  }, [alarmSound]);


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
  }, [isActive, timeLeft, playAlarm]);

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
  
  const handleTimeUpClose = () => {
    stopTone();
    setIsTimeUp(false);
  }

  const previewSound = () => {
    playTone(alarmSound, false);
  }

  const displayedTime = useMemo(() => {
    const d = Math.floor(timeLeft / (3600 * 24));
    const h = Math.floor((timeLeft % (3600 * 24)) / 3600);
    const m = Math.floor((timeLeft % 3600) / 60);
    const s = Math.floor(timeLeft % 60);
    return { d, h, m, s };
  }, [timeLeft]);

  const progress = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

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
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Settings /> Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-xs">
            <Label>Alarm Sound</Label>
            <div className="flex items-center gap-2">
              <Select value={alarmSound} onValueChange={(v: AlarmSoundType) => setAlarmSound(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a sound" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bell">Bell</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                  <SelectItem value="beep">Beep</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={previewSound} aria-label="Preview sound">
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isTimeUp} onOpenChange={(open) => !open && handleTimeUpClose()}>
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
            <AlertDialogAction onClick={handleTimeUpClose}>Close</AlertDialogAction>
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
