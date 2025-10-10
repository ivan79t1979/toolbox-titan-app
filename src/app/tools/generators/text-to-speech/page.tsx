import { PageHeader } from '@/components/page-header';
import { TextToSpeechForm } from './text-to-speech-form';

export default function TextToSpeechPage() {
  return (
    <>
      <PageHeader
        title="Text to Speech"
        description="Convert text to spoken audio with a variety of voices."
      />
      <TextToSpeechForm />
    </>
  );
}
