'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-writing-assistant.ts';
import '@/ai/flows/spell-checker.ts';
import '@/ai/flows/color-palette-extractor.ts';
import '@/ai/flows/font-pairing.ts';
import '@/ai/flows/font-pairing-types.ts';
