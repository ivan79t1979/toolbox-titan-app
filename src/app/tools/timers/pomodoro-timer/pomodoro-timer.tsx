
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
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  BookMarked,
  Coffee,
  BrainCircuit,
  Target,
  Volume2,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';
type AlarmSoundType = 'beep' | 'bell' | 'digital';

type FinishedTask = {
  id: string;
  name: string;
  description: string;
  duration: string;
};

// Web Audio API sound generation
let audioContext: AudioContext | null = null;
let stopLoop: (() => void) | null = null;

const playTone = (soundType: AlarmSoundType, isLoop: boolean) => {
  if (typeof window === 'undefined') return;

  if (!audioContext || audioContext.state === 'suspended') {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.error("Web Audio API is not supported in this browser");
      return;
    }
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();
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
  }
  
  if (isLoop) {
    let loopTimeout: NodeJS.Timeout | null = null;
    const loop = () => {
        play(audioContext!.currentTime);
        loopTimeout = setTimeout(loop, 1500);
    }
    loop();

    stopLoop = () => {
        if (loopTimeout) clearTimeout(loopTimeout);
        stopLoop = null;
    }
  } else {
      play(audioContext!.currentTime);
  }
};

const stopTone = () => {
  if (stopLoop) {
    stopLoop();
  }
};

export function PomodoroTimer() {
  // Settings
  const [workTime, setWorkTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [longBreakInterval, setLongBreakInterval] = useState(4);
  const [autoStart, setAutoStart] = useState(false);
  const [alarmSound, setAlarmSound] = useState<AlarmSoundType>('bell');

  // Timer State
  const [mode, setMode] = useState<TimerMode>('work');
  const [targetTime, setTargetTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [task, setTask] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  // Statistics
  const [sessions, setSessions] = useState(0);
  const [finishedTasks, setFinishedTasks] = useState<FinishedTask[]>([]);
  const [focusMinutes, setFocusMinutes] = useState(0);
  const [breakMinutes, setBreakMinutes] = useState(0);

  // Alarm state
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [finishedMode, setFinishedMode] = useState<TimerMode | null>(null);
  const [originalTitle, setOriginalTitle] = useState('');

  useEffect(() => {
    if(typeof window !== 'undefined') {
        setOriginalTitle(document.title);
    }
  }, []);


  const totalTime =
    (mode === 'work'
      ? workTime
      : mode === 'shortBreak'
      ? shortBreakTime
      : longBreakTime) * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const playAlarm = useCallback(() => {
    playTone(alarmSound, true);
  }, [alarmSound]);

  const stopAlarm = useCallback(() => {
    stopTone();
  }, []);
  
  const previewSound = () => {
    playTone(alarmSound, false);
  }

  const switchMode = useCallback(
    (nextMode: TimerMode, shouldAutoStart: boolean) => {
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
      setIsActive(shouldAutoStart);
      if(shouldAutoStart) {
        setTargetTime(Date.now() + newTime * 1000);
      } else {
        setTargetTime(null);
      }
    },
    [workTime, shortBreakTime, longBreakTime]
  );
  
  // Timer main loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && targetTime) {
      interval = setInterval(() => {
        const remaining = Math.max(0, targetTime - Date.now());
        const remainingSeconds = Math.ceil(remaining / 1000);

        setTimeLeft(remainingSeconds);

        if (mode === 'work') {
            setFocusMinutes(prev => prev + 1/60);
        } else {
            setBreakMinutes(prev => prev + 1/60);
        }

        if (remaining <= 0) {
          setIsActive(false);
          setTargetTime(null);
          setFinishedMode(mode);
          setIsTimeUp(true);
          playAlarm();
          document.title = "Time's Up!";

          if (mode === 'work') {
            setSessions((prev) => prev + 1);
            if(task.trim()){
                const newFinishedTask: FinishedTask = {
                    id: `task-${Date.now()}`,
                    name: task,
                    description: taskDescription,
                    duration: formatTime(totalTime),
                };
                setFinishedTasks(prev => [newFinishedTask, ...prev]);
            }
            const nextMode = (sessions + 1) % longBreakInterval === 0 ? 'longBreak' : 'shortBreak';
            switchMode(nextMode, autoStart);
          } else {
            switchMode('work', autoStart);
          }
        }
      }, 250);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, targetTime, mode, sessions, longBreakInterval, switchMode, playAlarm, task, taskDescription, totalTime, autoStart]);

  useEffect(() => {
    // Reset timer when settings change and it's not active
    if (!isActive) {
        setMode('work');
        setTimeLeft(workTime * 60);
    }
  }, [workTime, shortBreakTime, longBreakTime, isActive]);

  const handleStartPause = () => {
    if (timeLeft === 0) return;

    setIsActive(prev => {
        const newIsActive = !prev;
        if(newIsActive) { // Starting or resuming
            setTargetTime(Date.now() + timeLeft * 1000);
        } else { // Pausing
            setTargetTime(null);
        }
        return newIsActive;
    });
  };

  const handleReset = () => {
    setIsActive(false);
    setTargetTime(null);
    setMode('work');
    setTimeLeft(workTime * 60);
    document.title = originalTitle;
  };
  
  const handleTimeUpConfirm = () => {
      stopAlarm();
      setIsTimeUp(false);
      document.title = originalTitle;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateFinishedTask = (id: string, field: 'name' | 'description', value: string) => {
    setFinishedTasks(prev => prev.map(t => t.id === id ? {...t, [field]: value} : t));
  }

  const deleteFinishedTask = (id: string) => {
    setFinishedTasks(prev => prev.filter(t => t.id !== id));
  }

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
              onClick={() => { switchMode('work', false); }}
              className={cn(mode === 'work' && 'bg-red-500 hover:bg-red-600')}
            >
              Pomodoro
            </Button>
            <Button
              variant={mode === 'shortBreak' ? 'default' : 'ghost'}
              onClick={() => { switchMode('shortBreak', false); }}
               className={cn(mode === 'shortBreak' && 'bg-blue-500 hover:bg-blue-600')}
            >
              Short Break
            </Button>
            <Button
              variant={mode === 'longBreak' ? 'default' : 'ghost'}
              onClick={() => { switchMode('longBreak', false); }}
               className={cn(mode === 'longBreak' && 'bg-green-500 hover:bg-green-600')}
            >
              Long Break
            </Button>
          </div>
          <div className="text-8xl font-bold font-mono my-8">
            {formatTime(timeLeft)}
          </div>
          <div className="max-w-md mx-auto mb-4 space-y-2">
            <Input 
              placeholder="What are you working on?"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="text-center text-lg"
              disabled={isActive}
            />
            <Textarea
              placeholder="Add a description... (optional)"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="text-center"
              disabled={isActive}
              rows={2}
            />
          </div>
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
              <CardContent><p className="text-2xl font-bold">{finishedTasks.length}</p></CardContent>
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
          <CardTitle>Completed Tasks</CardTitle>
          <CardDescription>A log of your accomplished tasks.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Duration</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {finishedTasks.length > 0 ? (
                finishedTasks.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                        <Input
                            value={t.name}
                            onChange={(e) => updateFinishedTask(t.id, 'name', e.target.value)}
                            className="border-none p-0 h-auto"
                        />
                    </TableCell>
                    <TableCell>
                        <Textarea
                            value={t.description}
                            onChange={(e) => updateFinishedTask(t.id, 'description', e.target.value)}
                            className="border-none p-0 h-auto resize-none"
                            rows={1}
                        />
                    </TableCell>
                    <TableCell className="text-right font-mono">{t.duration}</TableCell>
                    <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => deleteFinishedTask(t.id)}>
                            <Trash2 className="h-4 w-4"/>
                        </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Completed tasks will appear here.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>


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
                {finishedMode === 'work' ? "Great job! Time for a break." : "Break's over. Time to get back to it!"}
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

    