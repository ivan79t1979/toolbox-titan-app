'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  BookMarked,
  Coffee,
  BrainCircuit,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export function PomodoroTimer() {
  // Settings
  const [workTime, setWorkTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [longBreakInterval, setLongBreakInterval] = useState(4);
  const [autoStart, setAutoStart] = useState(false);
  const [alarmSound, setAlarmSound] = useState('/sounds/alarm-bell.mp3');

  // Timer State
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [task, setTask] = useState('');

  // Statistics
  const [sessions, setSessions] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [focusMinutes, setFocusMinutes] = useState(0);
  const [breakMinutes, setBreakMinutes] = useState(0);

  // Alarm state
  const [isTimeUp, setIsTimeUp] = useState(false);
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const totalTime =
    (mode === 'work'
      ? workTime
      : mode === 'shortBreak'
      ? shortBreakTime
      : longBreakTime) * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const playAlarm = useCallback(() => {
    if (alarmRef.current) {
      alarmRef.current.loop = true;
      alarmRef.current.play().catch(error => console.error("Audio play failed", error));
    }
  }, []);

  const stopAlarm = useCallback(() => {
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
    }
  }, []);

  const switchMode = useCallback(
    (nextMode: TimerMode) => {
      setMode(nextMode);
      let newTime;
      if (nextMode === 'work') {
        newTime = workTime * 60;
      } else if (nextMode === 'shortBreak') {
        newTime = shortBreakTime * 60;
      } else {
        newTime = longBreakTime * 60;
      }
      setTimeLeft(newTime);
      setIsActive(autoStart);
    },
    [workTime, shortBreakTime, longBreakTime, autoStart]
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        if (mode === 'work') {
            setFocusMinutes(prev => prev + 1/60);
        } else {
            setBreakMinutes(prev => prev + 1/60);
        }
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsTimeUp(true);
      playAlarm();

      if (mode === 'work') {
        setSessions((prev) => prev + 1);
        if(task.trim()){
            setCompletedTasks(prev => prev + 1)
        }
        if ((sessions + 1) % longBreakInterval === 0) {
          switchMode('longBreak');
        } else {
          switchMode('shortBreak');
        }
      } else {
        switchMode('work');
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, sessions, longBreakInterval, switchMode, playAlarm, task]);

  useEffect(() => {
    // Reset timer when settings change
    setIsActive(false);
    setMode('work');
    setTimeLeft(workTime * 60);
  }, [workTime, shortBreakTime, longBreakTime]);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      alarmRef.current = new Audio(alarmSound);
    }
  }, [alarmSound]);


  const handleStartPause = () => {
    if (timeLeft === 0) return;
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setMode('work');
    setTimeLeft(workTime * 60);
  };
  
  const handleTimeUpConfirm = () => {
      stopAlarm();
      setIsTimeUp(false);
      if (autoStart) {
          setIsActive(true);
      }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Card
        className={cn(
          'transition-colors',
          mode === 'work' && 'bg-red-500/10 border-red-500/30',
          mode === 'shortBreak' && 'bg-blue-500/10 border-blue-500/30',
          mode === 'longBreak' && 'bg-green-500/10 border-green-500/30'
        )}
      >
        <CardContent className="p-6 text-center">
          <div className="flex justify-center gap-2 mb-4">
            <Button
              variant={mode === 'work' ? 'default' : 'ghost'}
              onClick={() => { setMode('work'); setTimeLeft(workTime * 60); setIsActive(false); }}
              className={cn(mode === 'work' && 'bg-red-500 hover:bg-red-600')}
            >
              Pomodoro
            </Button>
            <Button
              variant={mode === 'shortBreak' ? 'default' : 'ghost'}
              onClick={() => { setMode('shortBreak'); setTimeLeft(shortBreakTime * 60); setIsActive(false); }}
               className={cn(mode === 'shortBreak' && 'bg-blue-500 hover:bg-blue-600')}
            >
              Short Break
            </Button>
            <Button
              variant={mode === 'longBreak' ? 'default' : 'ghost'}
              onClick={() => { setMode('longBreak'); setTimeLeft(longBreakTime * 60); setIsActive(false); }}
               className={cn(mode === 'longBreak' && 'bg-green-500 hover:bg-green-600')}
            >
              Long Break
            </Button>
          </div>
          <div className="text-8xl font-bold font-mono my-8">
            {formatTime(timeLeft)}
          </div>
          <Input 
            placeholder="What are you working on?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="max-w-md mx-auto mb-8 text-center"
            disabled={isActive}
          />
          <div className="flex justify-center gap-4">
            <Button onClick={handleStartPause} size="lg" className="w-40 text-xl">
              {isActive ? <Pause className="mr-2"/> : <Play className="mr-2"/>}
              {isActive ? 'Pause' : 'Start'}
            </Button>
            <Button onClick={handleReset} variant="outline" size="icon" aria-label="Reset Timer">
              <RotateCcw />
            </Button>
          </div>
           <Progress value={progress} className="mt-8 max-w-md mx-auto" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <Card>
              <CardHeader><CardTitle className="flex items-center justify-center gap-2 text-base"><Target/>Sessions</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold">{sessions}</p></CardContent>
          </Card>
          <Card>
              <CardHeader><CardTitle className="flex items-center justify-center gap-2 text-base"><BookMarked/>Tasks</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold">{completedTasks}</p></CardContent>
          </Card>
          <Card>
              <CardHeader><CardTitle className="flex items-center justify-center gap-2 text-base"><BrainCircuit/>Focus Mins</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold">{Math.floor(focusMinutes)}</p></CardContent>
          </Card>
          <Card>
              <CardHeader><CardTitle className="flex items-center justify-center gap-2 text-base"><Coffee/>Break Mins</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold">{Math.floor(breakMinutes)}</p></CardContent>
          </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workTime">Work (minutes)</Label>
              <Input
                id="workTime"
                type="number"
                value={workTime}
                onChange={(e) => setWorkTime(Number(e.target.value))}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortBreakTime">Short Break (minutes)</Label>
              <Input
                id="shortBreakTime"
                type="number"
                value={shortBreakTime}
                onChange={(e) => setShortBreakTime(Number(e.target.value))}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longBreakTime">Long Break (minutes)</Label>
              <Input
                id="longBreakTime"
                type="number"
                value={longBreakTime}
                onChange={(e) => setLongBreakTime(Number(e.target.value))}
                min={1}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="longBreakInterval">Long Break Interval</Label>
                <Input
                    id="longBreakInterval"
                    type="number"
                    value={longBreakInterval}
                    onChange={(e) => setLongBreakInterval(Number(e.target.value))}
                    min={1}
                    />
            </div>
            <div className="space-y-2">
                <Label>Alarm Sound</Label>
                <Select value={alarmSound} onValueChange={setAlarmSound}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a sound" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="/sounds/alarm-bell.mp3">Alarm Bell</SelectItem>
                        <SelectItem value="/sounds/digital-alarm.mp3">Digital Alarm</SelectItem>
                        <SelectItem value="/sounds/kitchen-timer.mp3">Kitchen Timer</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="autoStart"
              checked={autoStart}
              onCheckedChange={(checked) => setAutoStart(!!checked)}
            />
            <Label htmlFor="autoStart">
              Auto-start next timer
            </Label>
          </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={isTimeUp}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time's Up!</AlertDialogTitle>
            <AlertDialogDescription>
                {mode === 'work' ? "Great job! Time for a break." : "Break's over. Time to get back to it!"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleTimeUpConfirm}>
                Stop Alarm & Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
