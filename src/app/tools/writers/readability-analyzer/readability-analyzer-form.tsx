'use client';

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// --- Readability Calculation Logic ---

function countSyllables(word: string): number {
  word = word.toLowerCase().trim();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 0;
}

function calculateReadability(text: string) {
  const cleanText = text.replace(/[^a-zA-Z0-9\s.!?]/g, ' ');
  const words = cleanText.split(/\s+/).filter(Boolean);
  const sentences = cleanText.split(/[.!?]+/).filter(Boolean);
  const characters = cleanText.replace(/\s/g, '').length;

  if (words.length === 0 || sentences.length === 0) {
    return {
      words: 0,
      sentences: 0,
      characters: 0,
      syllables: 0,
      complexWords: 0,
      fleschKincaid: 0,
      gunningFog: 0,
      colemanLiau: 0,
      smog: 0,
      ari: 0,
      readingTime: 0,
      speakingTime: 0,
    };
  }

  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const syllableCount = words.reduce((acc, word) => acc + countSyllables(word), 0);
  const complexWordsCount = words.filter(word => countSyllables(word) >= 3).length;

  // Flesch-Kincaid Grade Level
  const fleschKincaid = 0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59;

  // Gunning Fog Index
  const gunningFog = 0.4 * ((wordCount / sentenceCount) + 100 * (complexWordsCount / wordCount));

  // Coleman-Liau Index
  const L = (characters / wordCount) * 100; // Average number of letters per 100 words
  const S = (sentenceCount / wordCount) * 100; // Average number of sentences per 100 words
  const colemanLiau = 0.0588 * L - 0.296 * S - 15.8;

  // SMOG Index
  const smog = 1.043 * Math.sqrt(complexWordsCount * (30 / sentenceCount)) + 3.1291;

  // Automated Readability Index (ARI)
  const ari = 4.71 * (characters / wordCount) + 0.5 * (wordCount / sentenceCount) - 21.43;

  // Reading/Speaking Time (assuming 200 wpm reading, 150 wpm speaking)
  const readingTime = Math.ceil(wordCount / 200);
  const speakingTime = Math.ceil(wordCount / 150);

  return {
    words: wordCount,
    sentences: sentenceCount,
    characters,
    syllables: syllableCount,
    complexWords: complexWordsCount,
    fleschKincaid: fleschKincaid,
    gunningFog: gunningFog,
    colemanLiau: colemanLiau,
    smog: isNaN(smog) ? 0 : smog,
    ari: ari,
    readingTime,
    speakingTime
  };
}

function getGradeLevelDescription(score: number): { label: string, color: string } {
    if (score <= 5) return { label: 'Very Easy', color: 'bg-green-500/20 text-green-700 dark:text-green-400' };
    if (score <= 8) return { label: 'Easy', color: 'bg-blue-500/20 text-blue-700 dark:text-blue-400' };
    if (score <= 11) return { label: 'Standard', color: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' };
    if (score <= 14) return { label: 'Difficult', color: 'bg-orange-500/20 text-orange-700 dark:text-orange-400' };
    return { label: 'Very Difficult', color: 'bg-red-500/20 text-red-700 dark:text-red-400' };
}

function StatCard({ title, value, description }: { title: string, value: string | number, description?: string }) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardDescription>{title}</CardDescription>
                <CardTitle className="text-3xl">{value}</CardTitle>
            </CardHeader>
            {description && <CardContent><p className="text-xs text-muted-foreground">{description}</p></CardContent>}
        </Card>
    )
}

export function ReadabilityAnalyzerForm() {
  const [text, setText] = useState('');
  const stats = useMemo(() => calculateReadability(text), [text]);
  const gradeLevel = useMemo(() => getGradeLevelDescription(stats.fleschKincaid), [stats.fleschKincaid]);

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <Textarea
        placeholder="Paste your text here to analyze its readability..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="h-96 min-h-[400px] text-base"
      />
      <div className="space-y-6">
        <Card className="text-center">
            <CardHeader>
                <CardTitle>Average Grade Level</CardTitle>
                <CardDescription>Based on Flesch-Kincaid</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-5xl font-bold">{stats.fleschKincaid.toFixed(1)}</p>
                <Badge className={`mt-2 ${gradeLevel.color}`}>{gradeLevel.label}</Badge>
            </CardContent>
        </Card>
        
        <div className="grid grid-cols-2 gap-4">
            <StatCard title="Words" value={stats.words} />
            <StatCard title="Sentences" value={stats.sentences} />
            <StatCard title="Characters" value={stats.characters} />
            <StatCard title="Syllables" value={stats.syllables} />
            <StatCard title="Reading Time" value={`~${stats.readingTime} min`} />
            <StatCard title="Speaking Time" value={`~${stats.speakingTime} min`} />
        </div>

        <Card>
            <CardHeader><CardTitle>Detailed Scores</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                <div className="flex justify-between"><span>Gunning Fog Index:</span> <span className="font-bold">{stats.gunningFog.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Coleman-Liau Index:</span> <span className="font-bold">{stats.colemanLiau.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>SMOG Index:</span> <span className="font-bold">{stats.smog.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Automated Readability (ARI):</span> <span className="font-bold">{stats.ari.toFixed(2)}</span></div>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
