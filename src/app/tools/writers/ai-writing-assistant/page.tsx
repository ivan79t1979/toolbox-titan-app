import { PageHeader } from '@/components/page-header';
import { AiWritingAssistantForm } from './ai-writing-form';

export default function AiWritingAssistantPage() {
  return (
    <div>
      <PageHeader
        title="AI Writing Assistant"
        description="Generate high-quality text for your articles, emails, or social media posts with the power of AI."
      />
      <AiWritingAssistantForm />
    </div>
  );
}
