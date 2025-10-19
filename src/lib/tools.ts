
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
  Hourglass,
  Percent,
  Ruler,
  Columns,
  ListTodo,
  Trophy,
  Users,
  Wallet,
  ClipboardList,
  ListChecks,
  Receipt,
  Music,
  Shapes,
  PanelBottom,
  Minimize,
  Database,
  Code,
  ImageIcon,
} from 'lucide-react';

export type Tool = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export type ToolCategory = {
  name: string;
  description: string;
  icon: LucideIcon;
  tools: Tool[];
};

export const toolCategories: ToolCategory[] = [
  {
    name: 'Online writing tools',
    icon: Pencil,
    description: 'Whether you\'re drafting an article, checking for errors, or need placeholder text, our free writing tools are here to help. Improve clarity, count words, and analyze readability in seconds.',
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
      {
        title: 'Readability Analyzer',
        description: 'Analyze text for readability scores.',
        href: '/tools/writers/readability-analyzer',
        icon: Scan,
      },
      {
        title: 'Text Summarizer',
        description: 'Summarize long text into key points.',
        href: '/tools/writers/text-summarizer',
        icon: Text,
      },
      {
        title: 'Rhyme Finder',
        description: 'Find words that rhyme.',
        href: '/tools/writers/rhyme-finder',
        icon: Music,
      },
    ],
  },
  {
    name: 'Graphic design tools',
    icon: Palette,
    description: 'A perfect suite of free online design tools for professionals and hobbyists. From removing backgrounds to generating color palettes and resizing images, everything you need is right here.',
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
        title: 'Image Compressor',
        description: 'Compress images to reduce file size.',
        href: '/tools/designers/image-compressor',
        icon: Minimize,
      },
      {
        title: 'Font Pairing',
        description: 'Find the perfect font pairing.',
        href: '/tools/designers/font-pairing',
        icon: Type,
      },
      {
        title: 'SVG Shape Generator',
        description: 'Create and customize basic SVG shapes.',
        href: '/tools/designers/svg-shape-generator',
        icon: Shapes,
      },
      {
        title: 'CSS Shadow Generator',
        description: 'Create and customize box-shadow effects.',
        href: '/tools/designers/css-shadow-generator',
        icon: PanelBottom,
      },
    ],
  },
  {
    name: 'Generators',
    icon: Wand2,
    description: 'Our generator tools provide instant solutions for common needs. Create secure passwords, generate unique UUIDs, get QR codes for your links, and much more in just a few clicks.',
    tools: [
       {
        title: 'Favicon Generator',
        description: 'Generate favicons for your website.',
        href: '/tools/developers/favicon-generator',
        icon: ImageIcon,
      },
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
      {
        title: 'Invoice Generator',
        description: 'Create and download professional invoices.',
        href: '/tools/generators/invoice-generator',
        icon: Receipt,
      },
      {
        title: 'Dataset Generator',
        description: 'Generate structured data with AI.',
        href: '/tools/generators/dataset-generator',
        icon: Database,
      },
    ],
  },
  {
    name: 'Time tracking tools',
    icon: Clock,
    description: 'Boost your productivity with our simple and effective time management tools. Use the Pomodoro Timer to stay focused, or track your work with our Stopwatch and Time Tracker.',
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
    ],
  },
  {
    name: 'Math Tools',
    icon: Calculator,
    description: 'From simple sums to complex conversions, our math tools make calculations easy. Use the advanced calculator, figure out percentages, or convert units without leaving your browser.',
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
    description: 'Organize your projects and streamline your workflow with our free project management tools. Whether you need a Kanban board, a to-do list, or a budget planner, we have you covered.',
    tools: [
      {
        title: 'Kanban Board',
        description: 'Visual project management tool.',
        href: '/tools/project-management/kanban-board',
        icon: Columns,
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
      {
        title: 'Daily Standup Helper',
        description: 'Prepare and format daily standup updates.',
        href: '/tools/project-management/daily-standup-helper',
        icon: ClipboardList,
      },
      {
        title: 'Decision Matrix',
        description: 'Evaluate options based on weighted criteria.',
        href: '/tools/project-management/decision-matrix',
        icon: ListChecks,
      },
    ],
  },
];

export const allTools: Tool[] = toolCategories.flatMap(
  (category) => category.tools
);
