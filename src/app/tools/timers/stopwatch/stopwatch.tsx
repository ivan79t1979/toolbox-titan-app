'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const formatTime = (time: number) => {
  const milliseconds = `00${time % 1000}`.slice(-3, -1);
  const seconds = `0${Math.floor(time / 1000) % 60}`.slice(-2);
  const minutes = `0${Math.floor(time / 60000) % 60}`.slice(-2);
  const hours = `0${Math.floor(time / 3600000)}`.slice(-2);
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};

export function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);

  const start = () => {
    setIsActive(true);
    startTimeRef.current = performance.now() - (pauseTimeRef.current || 0);
    requestRef.current = requestAnimationFrame(animate);
  };

  const pause = () => {
    setIsActive(false);
    pauseTimeRef.current = performance.now() - startTimeRef.current;
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  };

  const reset = () => {
    setIsActive(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    setTime(0);
    setLaps([]);
    pauseTimeRef.current = 0;
  };

  const lap = () => {
    setLaps((prevLaps) => [...prevLaps, time]);
  };

  const animate = (timestamp: number) => {
    setTime(timestamp - startTimeRef.current);
    requestRef.current = requestAnimationFrame(animate);
  };

  const handleStartStop = () => {
    if (isActive) {
      pause();
    } else {
      start();
    }
  };

  const handleLapReset = () => {
    if (isActive) {
      lap();
    } else {
      reset();
    }
  };
  
  const getLapTime = (lapTime: number, index: number) => {
    const previousLap = laps[index - 1] || 0;
    return lapTime - previousLap;
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-7xl font-bold font-mono my-8 tracking-wider">
            {formatTime(time)}
          </div>
          <div className="flex justify-center gap-4">
            <Button
              onClick={handleLapReset}
              variant="outline"
              size="lg"
              className="w-32 text-lg"
              disabled={!isActive && time === 0}
            >
              {isActive ? <Flag className="mr-2" /> : <RotateCcw className="mr-2" />}
              {isActive ? 'Lap' : 'Reset'}
            </Button>
            <Button
              onClick={handleStartStop}
              size="lg"
              className="w-32 text-lg"
            >
              {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
              {isActive ? 'Pause' : 'Start'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Laps</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lap</TableHead>
                  <TableHead>Lap Time</TableHead>
                  <TableHead className="text-right">Total Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {laps.length > 0 ? (
                  [...laps].reverse().map((lapTime, index) => (
                    <TableRow key={laps.length - index}>
                      <TableCell className="font-medium">
                        {laps.length - index}
                      </TableCell>
                      <TableCell>{formatTime(getLapTime(lapTime, laps.length - 1 - index))}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatTime(lapTime)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Press "Lap" to record times.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
