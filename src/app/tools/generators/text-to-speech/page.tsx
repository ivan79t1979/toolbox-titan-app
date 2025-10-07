import { PageHeader } from '@/components/page-header';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gradio-app': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
      };
    }
  }
}

export default function TextToSpeechPage() {
  return (
    <>
      <PageHeader
        title="Text to Speech"
        description="Convert text to spoken audio using a custom model from Hugging Face."
      />
      <div className="mt-8">
        <gradio-app src="https://timemaster-multilingual-tts.hf.space"></gradio-app>
      </div>
    </>
  );
}
