'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Divide, Equal, Minus, Percent, Plus, RotateCcw, X, Delete } from 'lucide-react';

type Operator = '+' | '-' | '*' | '/';

export function Calculator() {
  const [input, setInput] = useState('0');
  const [previousInput, setPreviousInput] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [history, setHistory] = useState('');
  const [memory, setMemory] = useState<number>(0);

  const handleNumberClick = (value: string) => {
    if (input === '0' || (previousInput && operator && previousInput === input)) {
      setInput(value);
    } else {
      setInput(input + value);
    }
  };

  const handleDecimalClick = () => {
    if (!input.includes('.')) {
      setInput(input + '.');
    }
  };

  const handleOperatorClick = (op: Operator) => {
    if (previousInput && operator && input !== previousInput) {
      handleEquals();
      setPreviousInput(input);
    } else {
      setPreviousInput(input);
    }
    setOperator(op);
    setHistory(`${input} ${op}`);
  };
  
  const handleEquals = () => {
    if (!operator || previousInput === null) return;

    const current = parseFloat(input);
    const previous = parseFloat(previousInput);
    let result: number;

    switch (operator) {
      case '+':
        result = previous + current;
        break;
      case '-':
        result = previous - current;
        break;
      case '*':
        result = previous * current;
        break;
      case '/':
        result = previous / current;
        break;
      default:
        return;
    }
    
    setHistory(`${previous} ${operator} ${current} =`);
    setInput(String(result));
    setPreviousInput(null);
    setOperator(null);
  };

  const handleClear = () => {
    setInput('0');
    setPreviousInput(null);
    setOperator(null);
    setHistory('');
  };
  
  const handleClearEntry = () => {
    setInput('0');
  }

  const handleBackspace = () => {
    if(input.length > 1) {
      setInput(input.slice(0, -1));
    } else {
      setInput('0');
    }
  }

  const handleToggleSign = () => {
    setInput(String(parseFloat(input) * -1));
  };
  
  const handlePercentage = () => {
    setInput(String(parseFloat(input) / 100));
  }

  const handleAdvancedOp = (op: string) => {
    const current = parseFloat(input);
    let result: number;
    switch(op) {
        case 'sqrt': result = Math.sqrt(current); break;
        case 'x2': result = Math.pow(current, 2); break;
        case '1/x': result = 1 / current; break;
        case 'sin': result = Math.sin(current * Math.PI / 180); break; // degrees to radians
        case 'cos': result = Math.cos(current * Math.PI / 180); break;
        case 'tan': result = Math.tan(current * Math.PI / 180); break;
        case 'log': result = Math.log10(current); break;
        case 'ln': result = Math.log(current); break;
        case 'pi': setInput(String(Math.PI)); return;
        case 'e': setInput(String(Math.E)); return;
        default: return;
    }
    setHistory(`${op}(${input})`);
    setInput(String(result));
  }
  
  const handleMemoryClear = () => setMemory(0);
  const handleMemoryRecall = () => setInput(String(memory));
  const handleMemoryStore = () => setMemory(parseFloat(input));
  const handleMemoryAdd = () => setMemory((prev) => prev + parseFloat(input));
  const handleMemorySubtract = () => setMemory((prev) => prev - parseFloat(input));


  const buttonStyle = "h-16 text-2xl";
  const operatorStyle = "bg-amber-500 hover:bg-amber-600 text-white";
  const functionStyle = "bg-muted hover:bg-muted/80";

  const renderButtons = (isAdvanced: boolean) => (
    <div className={cn("grid gap-2", isAdvanced ? "grid-cols-5" : "grid-cols-4")}>
      {isAdvanced && <div />}
      <Button className={cn(buttonStyle, functionStyle)} onClick={handleMemoryClear}>MC</Button>
      <Button className={cn(buttonStyle, functionStyle)} onClick={handleMemoryRecall}>MR</Button>
      <Button className={cn(buttonStyle, functionStyle)} onClick={handleMemoryStore}>MS</Button>
      <div className="grid grid-cols-2 gap-2">
        <Button className={cn(buttonStyle, functionStyle, 'h-auto')} onClick={handleMemoryAdd}>M+</Button>
        <Button className={cn(buttonStyle, functionStyle, 'h-auto')} onClick={handleMemorySubtract}>M-</Button>
      </div>

      {isAdvanced && <Button className={cn(buttonStyle, functionStyle)} onClick={() => handleAdvancedOp('sin')}>sin</Button>}
      <Button className={cn(buttonStyle, functionStyle)} onClick={handlePercentage}>%</Button>
      <Button className={cn(buttonStyle, functionStyle)} onClick={handleClearEntry}>CE</Button>
      <Button className={cn(buttonStyle, functionStyle)} onClick={handleClear}>C</Button>
      <Button className={cn(buttonStyle, functionStyle)} onClick={handleBackspace}><Delete /></Button>

      {isAdvanced && <Button className={cn(buttonStyle, functionStyle)} onClick={() => handleAdvancedOp('cos')}>cos</Button>}
      <Button className={cn(buttonStyle, functionStyle)} onClick={() => handleAdvancedOp('1/x')}>1/x</Button>
      <Button className={cn(buttonStyle, functionStyle)} onClick={() => handleAdvancedOp('x2')}>x²</Button>
      <Button className={cn(buttonStyle, functionStyle)} onClick={() => handleAdvancedOp('sqrt')}>√x</Button>
      <Button className={cn(buttonStyle, operatorStyle)} onClick={() => handleOperatorClick('/')}><Divide /></Button>

      {isAdvanced && <Button className={cn(buttonStyle, functionStyle)} onClick={() => handleAdvancedOp('tan')}>tan</Button>}
      <Button className={cn(buttonStyle)} onClick={() => handleNumberClick('7')}>7</Button>
      <Button className={cn(buttonStyle)} onClick={() => handleNumberClick('8')}>8</Button>
      <Button className={cn(buttonStyle)} onClick={() => handleNumberClick('9')}>9</Button>
      <Button className={cn(buttonStyle, operatorStyle)} onClick={() => handleOperatorClick('*')}><X /></Button>

      {isAdvanced && <Button className={cn(buttonStyle, functionStyle)} onClick={() => handleAdvancedOp('log')}>log</Button>}
      <Button className={cn(buttonStyle)} onClick={() => handleNumberClick('4')}>4</Button>
      <Button className={cn(buttonStyle)} onClick={() => handleNumberClick('5')}>5</Button>
      <Button className={cn(buttonStyle)} onClick={() => handleNumberClick('6')}>6</Button>
      <Button className={cn(buttonStyle, operatorStyle)} onClick={() => handleOperatorClick('-')}><Minus /></Button>

      {isAdvanced && <Button className={cn(buttonStyle, functionStyle)} onClick={() => handleAdvancedOp('ln')}>ln</Button>}
      <Button className={cn(buttonStyle)} onClick={() => handleNumberClick('1')}>1</Button>
      <Button className={cn(buttonStyle)} onClick={() => handleNumberClick('2')}>2</Button>
      <Button className={cn(buttonStyle)} onClick={() => handleNumberClick('3')}>3</Button>
      <Button className={cn(buttonStyle, operatorStyle)} onClick={() => handleOperatorClick('+')}><Plus /></Button>

      {isAdvanced && <Button className={cn(buttonStyle, functionStyle)} onClick={() => handleAdvancedOp('pi')}>π</Button>}
      <Button className={cn(buttonStyle)} onClick={handleToggleSign}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line><line x1="5" y1="12" x2="12" y2="12"></line><line x1="5" y1="16" x2="19" y2="16"></line></svg>
      </Button>
      <Button className={cn(buttonStyle)} onClick={() => handleNumberClick('0')}>0</Button>
      <Button className={cn(buttonStyle)} onClick={handleDecimalClick}>.</Button>
      <Button className={cn(buttonStyle, "bg-green-500 hover:bg-green-600 text-white")} onClick={handleEquals}><Equal /></Button>
    </div>
  );

  return (
    <div className="flex justify-center">
        <Card className="w-full max-w-sm lg:max-w-xl p-4">
            <CardContent className="p-0">
                <div className="mb-4 text-right pr-4">
                    <div className="text-muted-foreground h-6 flex items-center justify-end">
                      {memory !== 0 && <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded-sm">M</span>}
                      <span className="ml-2">{history}</span>
                    </div>
                    <div className="text-5xl font-bold break-all">{input}</div>
                </div>
                <Tabs defaultValue="simple" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="simple">Simple</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>
                    <TabsContent value="simple" className="mt-4">
                        {renderButtons(false)}
                    </TabsContent>
                    <TabsContent value="advanced" className="mt-4">
                        {renderButtons(true)}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
}
