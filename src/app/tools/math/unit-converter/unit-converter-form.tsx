'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft } from 'lucide-react';

type Unit = {
  name: string;
  symbol: string;
};

type ConversionCategory = {
  name: string;
  units: Unit[];
  conversions: { [key: string]: (value: number) => number };
};

const conversionData: ConversionCategory[] = [
  {
    name: 'Length',
    units: [
      { name: 'Meters', symbol: 'm' },
      { name: 'Kilometers', symbol: 'km' },
      { name: 'Centimeters', symbol: 'cm' },
      { name: 'Millimeters', symbol: 'mm' },
      { name: 'Miles', symbol: 'mi' },
      { name: 'Yards', symbol: 'yd' },
      { name: 'Feet', symbol: 'ft' },
      { name: 'Inches', symbol: 'in' },
    ],
    conversions: {
      m: (v) => v, km: (v) => v * 1000, cm: (v) => v / 100, mm: (v) => v / 1000, mi: (v) => v * 1609.34, yd: (v) => v * 0.9144, ft: (v) => v * 0.3048, in: (v) => v * 0.0254,
    },
  },
  {
    name: 'Weight',
    units: [
      { name: 'Grams', symbol: 'g' },
      { name: 'Kilograms', symbol: 'kg' },
      { name: 'Milligrams', symbol: 'mg' },
      { name: 'Pounds', symbol: 'lb' },
      { name: 'Ounces', symbol: 'oz' },
    ],
    conversions: {
      g: (v) => v, kg: (v) => v * 1000, mg: (v) => v / 1000, lb: (v) => v * 453.592, oz: (v) => v * 28.3495,
    },
  },
  {
    name: 'Temperature',
    units: [
      { name: 'Celsius', symbol: 'C' },
      { name: 'Fahrenheit', symbol: 'F' },
      { name: 'Kelvin', symbol: 'K' },
    ],
    conversions: {
      C: (v) => v,
      F: (v) => (v * 9/5) + 32,
      K: (v) => v + 273.15,
    },
  },
  {
    name: 'Volume',
    units: [
      { name: 'Liters', symbol: 'L' },
      { name: 'Milliliters', symbol: 'mL' },
      { name: 'Gallons (US)', symbol: 'gal' },
      { name: 'Quarts (US)', symbol: 'qt' },
      { name: 'Pints (US)', symbol: 'pt' },
      { name: 'Cups (US)', symbol: 'cup' },
    ],
    conversions: {
      L: (v) => v, mL: (v) => v / 1000, gal: (v) => v * 3.78541, qt: (v) => v * 0.946353, pt: (v) => v * 0.473176, cup: (v) => v * 0.236588,
    },
  },
   {
    name: 'Time',
    units: [
      { name: 'Seconds', symbol: 's' },
      { name: 'Minutes', symbol: 'min' },
      { name: 'Hours', symbol: 'h' },
      { name: 'Days', symbol: 'd' },
      { name: 'Weeks', symbol: 'w' },
    ],
    conversions: {
      s: (v) => v, min: (v) => v * 60, h: (v) => v * 3600, d: (v) => v * 86400, w: (v) => v * 604800,
    },
  },
  {
    name: 'Speed',
    units: [
      { name: 'm/s', symbol: 'm/s' },
      { name: 'km/h', symbol: 'km/h' },
      { name: 'mph', symbol: 'mph' },
      { name: 'knots', symbol: 'knots' },
    ],
    conversions: {
      'm/s': (v) => v, 'km/h': (v) => v / 3.6, mph: (v) => v * 0.44704, knots: (v) => v * 0.514444,
    },
  },
  {
    name: 'Area',
    units: [
        { name: 'Square Meters', symbol: 'sqm' },
        { name: 'Square Kilometers', symbol: 'sqkm' },
        { name: 'Square Miles', symbol: 'sqmi' },
        { name: 'Acres', symbol: 'ac' },
        { name: 'Hectares', symbol: 'ha' },
    ],
    conversions: {
        sqm: (v) => v, sqkm: (v) => v * 1e6, sqmi: (v) => v * 2.59e6, ac: (v) => v * 4046.86, ha: (v) => v * 10000,
    }
  },
  {
      name: 'Data Storage',
      units: [
          { name: 'Bytes', symbol: 'B' },
          { name: 'Kilobytes', symbol: 'KB' },
          { name: 'Megabytes', symbol: 'MB' },
          { name: 'Gigabytes', symbol: 'GB' },
          { name: 'Terabytes', symbol: 'TB' },
      ],
      conversions: {
          B: (v) => v, KB: (v) => v * 1024, MB: (v) => v * Math.pow(1024, 2), GB: (v) => v * Math.pow(1024, 3), TB: (v) => v * Math.pow(1024, 4),
      }
  },
  {
    name: 'Energy',
    units: [
        { name: 'Joules', symbol: 'J' },
        { name: 'Kilojoules', symbol: 'kJ' },
        { name: 'Calories', symbol: 'cal' },
        { name: 'Kilocalories', symbol: 'kcal' },
        { name: 'Watt-hours', symbol: 'Wh' },
    ],
    conversions: {
        J: (v) => v, kJ: (v) => v * 1000, cal: (v) => v * 4.184, kcal: (v) => v * 4184, Wh: (v) => v * 3600,
    }
  },
  {
    name: 'Pressure',
    units: [
        { name: 'Pascals', symbol: 'Pa' },
        { name: 'Kilopascals', symbol: 'kPa' },
        { name: 'Bars', symbol: 'bar' },
        { name: 'PSI', symbol: 'psi' },
        { name: 'Atmospheres', symbol: 'atm' },
    ],
    conversions: {
        Pa: (v) => v, kPa: (v) => v * 1000, bar: (v) => v * 100000, psi: (v) => v * 6894.76, atm: (v) => v * 101325,
    }
  },
  {
    name: 'Power',
    units: [
        { name: 'Watts', symbol: 'W' },
        { name: 'Kilowatts', symbol: 'kW' },
        { name: 'Megawatts', symbol: 'MW' },
        { name: 'Horsepower', symbol: 'hp' },
    ],
    conversions: {
        W: (v) => v,
        kW: (v) => v * 1000,
        MW: (v) => v * 1e6,
        hp: (v) => v * 745.7,
    }
  },
  {
    name: 'Angle',
    units: [
        { name: 'Degrees', symbol: 'deg' },
        { name: 'Radians', symbol: 'rad' },
        { name: 'Gradians', symbol: 'grad' },
    ],
    conversions: {
        deg: (v) => v, rad: (v) => v * (180 / Math.PI), grad: (v) => v * 0.9,
    }
  }
];

export function UnitConverterForm() {
  const [category, setCategory] = useState(conversionData[0].name);
  const [fromUnit, setFromUnit] = useState(conversionData[0].units[0].symbol);
  const [toUnit, setToUnit] = useState(conversionData[0].units[1].symbol);
  const [fromValue, setFromValue] = useState('1');
  const [toValue, setToValue] = useState('');

  const currentCategory = useMemo(() => conversionData.find(c => c.name === category)!, [category]);

  const convert = (value: number, from: string, to: string, cat: ConversionCategory) => {
    if (from === to) return value;
    
    // Special handling for temperature
    if (cat.name === 'Temperature') {
        let celsius: number;
        if(from === 'F') celsius = (value - 32) * 5/9;
        else if (from === 'K') celsius = value - 273.15;
        else celsius = value;

        if (to === 'F') return (celsius * 9/5) + 32;
        if (to === 'K') return celsius + 273.15;
        return celsius;
    }
     // Special handling for Angle
    if (cat.name === 'Angle') {
      let degrees: number;
      if (from === 'rad') degrees = value * (180 / Math.PI);
      else if (from === 'grad') degrees = value * 0.9;
      else degrees = value;

      if (to === 'rad') return degrees * (Math.PI / 180);
      if (to === 'grad') return degrees / 0.9;
      return degrees;
    }
    
    const fromToBase = cat.conversions[from](value);
    const toFromBase = (v: number) => {
      const baseKeys = Object.keys(cat.conversions);
      for(const key of baseKeys) {
        if(cat.conversions[key](1) === 1/cat.conversions[to](1) * cat.conversions[to](1)) {
           // Not a perfect inversion, but works for multiplicative factors
           return v / cat.conversions[to](1);
        }
      }
      // Fallback for simple factors
      const toFactor = cat.conversions[to](1);
      return v / toFactor;
    };

    return toFromBase(fromToBase);
  };

  const calculateConversion = (valStr: string, fromU: string, toU: string, setOtherValue: (val: string) => void) => {
    const val = parseFloat(valStr);
    if (!isNaN(val)) {
      const result = convert(val, fromU, toU, currentCategory);
      setOtherValue(result.toLocaleString('en-US', { maximumFractionDigits: 5 }));
    } else {
      setOtherValue('');
    }
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromValue(e.target.value);
    calculateConversion(e.target.value, fromUnit, toUnit, setToValue);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToValue(e.target.value);
    calculateConversion(e.target.value, toUnit, fromUnit, setFromValue);
  };

  const handleCategoryChange = (newCategory: string) => {
    const cat = conversionData.find(c => c.name === newCategory)!;
    setCategory(newCategory);
    setFromUnit(cat.units[0].symbol);
    setToUnit(cat.units[1].symbol);
    setFromValue('1');
    calculateConversion('1', cat.units[0].symbol, cat.units[1].symbol, setToValue);
  };
  
  const handleUnitChange = (type: 'from' | 'to', newUnit: string) => {
      if (type === 'from') {
          setFromUnit(newUnit);
          calculateConversion(fromValue, newUnit, toUnit, setToValue);
      } else {
          setToUnit(newUnit);
          calculateConversion(fromValue, fromUnit, newUnit, setToValue);
      }
  };

  const swapUnits = () => {
      const currentFrom = fromValue;
      setFromUnit(toUnit);
      setToUnit(fromUnit);
      setFromValue(toValue);
      setToValue(currentFrom);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="category">Conversion Type</Label>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {conversionData.map((cat) => (
                <SelectItem key={cat.name} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="space-y-2">
            <Label>From</Label>
             <Select value={fromUnit} onValueChange={(v) => handleUnitChange('from', v)}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                    {currentCategory.units.map(u => <SelectItem key={u.symbol} value={u.symbol}>{u.name}</SelectItem>)}
                </SelectContent>
            </Select>
            <Input type="number" value={fromValue} onChange={handleFromChange} className="text-lg h-12" />
          </div>

          <Button onClick={swapUnits} variant="ghost" size="icon" className="self-end hidden md:inline-flex">
              <ArrowRightLeft className="h-5 w-5" />
          </Button>

          <div className="space-y-2">
            <Label>To</Label>
             <Select value={toUnit} onValueChange={(v) => handleUnitChange('to', v)}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                    {currentCategory.units.map(u => <SelectItem key={u.symbol} value={u.symbol}>{u.name}</SelectItem>)}
                </SelectContent>
            </Select>
            <Input type="number" value={toValue} onChange={handleToChange} className="text-lg h-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
