import { PageHeader } from '@/components/page-header';

export default function AboutPage() {
  return (
    <div className="container mx-auto">
      <PageHeader title="About Us" />
      <div className="prose dark:prose-invert max-w-none">
        <p>
          Welcome to modernonlinetools.com, a place where creativity meets
          simplicity. We believe that powerful tools should be accessible to
          everyone, without complicated software, expensive subscriptions, or
          technical barriers. That’s why we built this platform: a collection of
          free online tools designed to help content creators, entrepreneurs,
          students, and everyday users work smarter and faster.
        </p>
        <h3>What We Offer</h3>
        <p>
          From productivity boosters like Pomodoro Timer, Countdown Tools, and
          Password Generator, creative helpers like Color Picker & Converter, QR
          Code Generator, and Word Counter, to advanced tools like AI Writing
          Assistant, Image Background Remover or Text to Speech Converter our
          mission is to provide an ever-growing set of resources—all available
          instantly in your browser. No downloads, no installations, no hidden
          costs.
        </p>
        <h3>Why We Built This</h3>
        <p>
          We noticed that creators often have to jump between multiple apps or
          expensive platforms just to get simple things done. Our goal is to
          bring these essentials together in one clean, modern space that you
          can rely on daily.
        </p>
        <h3>Our Vision</h3>
        <p>
          We’re constantly expanding, exploring new ideas, and experimenting
          with the latest technology (including AI-powered tools) so that your
          workflow stays efficient and inspiring.
        </p>
        <h3>Our promise is to keep everything:</h3>
        <ul>
          <li>Free to use</li>
          <li>Easy to understand</li>
          <li>Available anywhere</li>
        </ul>
        <h3>Join Us</h3>
        <p>
          This website is more than a toolbox—it’s a growing hub for makers,
          writers, designers, students, and anyone who values productivity and
          creativity without limits. Bookmark us, share us, and come back
          often as we continue to grow our toolbox with new useful tools.
        </p>
      </div>
    </div>
  );
}
