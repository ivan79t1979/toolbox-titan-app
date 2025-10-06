import {
  Pencil,
  Palette,
  Wand2,
  Clock,
  Calculator,
  KanbanSquare,
  type LucideIcon,
  CaseSensitive,
  FileText,
  Braces,
  Text,
  SpellCheck,
  Scan,
  Paintbrush,
  Pipette,
  AppWindow,
  Scaling,
  Type,
  AudioLines,
  KeyRound,
  QrCode,
  Fingerprint,
  Hash,
  Binary,
  Timer,
  TimerOff,
  Globe,
  Globe2,
  Percent,
  Ruler,
  Columns,
  GanttChartSquare,
  ListTodo,
  Hourglass,
  Trophy,
  Users,
  Wallet,
} from 'lucide-react';

export type Tool = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export type ToolCategory = {
  name: string;
  icon: LucideIcon;
  tools: Tool[];
};

export const toolCategories: ToolCategory[] = [
  {
    name: 'Tools for Writers',
    icon: Pencil,
    tools: [
      {
        title: 'AI Writing Assistant',
        description: 'AI-powered text generation and improvement.',
        href: '/tools/writers/ai-writing-assistant',
        icon: Wand2,
      },
      {
        title: 'Word Counter',
        description: 'Count words, characters, sentences, and paragraphs.',
        href: '/tools/writers/word-counter',
        icon: FileText,
      },
      {
        title: 'Case Converter',
        description: 'Convert text to different cases.',
        href: '/tools/writers/case-converter',
        icon: CaseSensitive,
      },
      {
        title: 'Lorem Ipsum Generator',
        description: 'Generate placeholder text.',
        href: '/tools/writers/lorem-ipsum-generator',
        icon: Braces,
      },
      {
        title: 'Text Diff',
        description: 'Compare two texts and highlight differences.',
        href: '/tools/writers/text-diff',
        icon: Text,
      },
      {
        title: 'Spell Checker',
        description: 'Check spelling and get suggestions.',
        href: '/tools/writers/spell-checker',
        icon: SpellCheck,
      },
    ],
  },
  {
    name: 'Tools for Designers',
    icon: Palette,
    tools: [
      {
        title: 'Background Remover',
        description: 'Removes the background from an image.',
        href: '/tools/designers/background-remover',
        icon: Scan,
      },
      {
        title: 'Color Picker & Converter',
        description: 'Pick and convert colors.',
        href: '/tools/designers/color-picker-converter',
        icon: Pipette,
      },
      {
        title: 'Gradient Maker',
        description: 'Create CSS gradients.',
        href: '/tools/designers/gradient-maker',
        icon: Paintbrush,
      },
      {
        title: 'Color Palette Extractor',
        description: 'Extract colors from an image.',
        href: '/tools/designers/color-palette-extractor',
        icon: AppWindow,
      },
      {
        title: 'Image Resizer',
        description: 'Resize images to your needs.',
        href: '/tools/designers/image-resizer',
        icon: Scaling,
      },
      {
        title: 'Font Pairing',
        description: 'Find the perfect font pairing.',
        href: '/tools/designers/font-pairing',
        icon: Type,
      },
    ],
  },
  {
    name: 'Generators',
    icon: Wand2,
    tools: [
      {
        title: 'Text to Speech',
        description: 'Convert text to spoken audio.',
        href: '/tools/generators/text-to-speech',
        icon: AudioLines,
      },
      {
        title: 'Password Generator',
        description: 'Generate secure passwords.',
        href: '/tools/generators/password-generator',
        icon: KeyRound,
      },
      {
        title: 'QR Code Generator',
        description: 'Generate QR codes from text or URLs.',
        href: '/tools/generators/qr-code-generator',
        icon: QrCode,
      },
      {
        title: 'UUID Generator',
        description: 'Generate unique UUIDs.',
        href: '/tools/generators/uuid-generator',
        icon: Fingerprint,
      },
      {
        title: 'Hash Generator',
        description: 'Generate hashes from text.',
        href: '/tools/generators/hash-generator',
        icon: Hash,
      },
      {
        title: 'Base64 Converter',
        description: 'Encode and decode Base64.',
        href: '/tools/generators/base64-converter',
        icon: Binary,
      },
    ],
  },
  {
    name: 'Timers',
    icon: Clock,
    tools: [
      {
        title: 'Pomodoro Timer',
        description: 'A timer for the Pomodoro Technique.',
        href: '/tools/timers/pomodoro-timer',
        icon: Timer,
      },
      {
        title: 'Countdown Timer',
        description: 'Count down from a specified time.',
        href: '/tools/timers/countdown-timer',
        icon: TimerOff,
      },
      {
        title: 'Stopwatch',
        description: 'Measure elapsed time.',
        href: '/tools/timers/stopwatch',
        icon: Hourglass,
      },
      {
        title: 'World Clock',
        description: 'Current time in different time zones.',
        href: '/tools/timers/world-clock',
        icon: Globe,
      },
      {
        title: 'Time Zone Converter',
        description: 'Convert time between time zones.',
        href: '/tools/timers/time-zone-converter',
        icon: Globe2,
      },
    ],
  },
  {
    name: 'Math Tools',
    icon: Calculator,
    tools: [
      {
        title: 'Simple & Advanced Calculator',
        description: 'From basic to scientific calculations.',
        href: '/tools/math/calculator',
        icon: Calculator,
      },
      {
        title: 'Percentage Calculator',
        description: 'All your percentage calculation needs.',
        href: '/tools/math/percentage-calculator',
        icon: Percent,
      },
      {
        title: 'Unit Converter',
        description: 'Convert between various units.',
        href: '/tools/math/unit-converter',
        icon: Ruler,
      },
    ],
  },
  {
    name: 'Project Management',
    icon: KanbanSquare,
    tools: [
      {
        title: 'Kanban Board',
        description: 'Visual project management tool.',
        href: '/tools/project-management/kanban-board',
        icon: Columns,
      },
      {
        title: 'Gantt Chart',
        description: 'Visualize project schedules.',
        href: '/tools/project-management/gantt-chart',
        icon: GanttChartSquare,
      },
      {
        title: 'To-Do List',
        description: 'Simple task tracking.',
        href: '/tools/project-management/todo-list',
        icon: ListTodo,
      },
      {
        title: 'Time Tracker',
        description: 'Track time spent on tasks.',
        href: '/tools/project-management/time-tracker',
        icon: Hourglass,
      },
      {
        title: 'Milestone Tracker',
        description: 'Track project milestones and deadlines.',
        href: '/tools/project-management/milestone-tracker',
        icon: Trophy,
      },
      {
        title: 'Meeting Planner',
        description: 'Plan and schedule meetings.',
        href: '/tools/project-management/meeting-planner',
        icon: Users,
      },
      {
        title: 'Budget Planner',
        description: 'Track income, expenses, and budgets.',
        href: '/tools/project-management/budget-planner',
        icon: Wallet,
      },
    ],
  },
];

export const allTools: Tool[] = toolCategories.flatMap(
  (category) => category.tools
);
