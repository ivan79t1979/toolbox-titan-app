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

export default function BackgroundRemoverPage() {
  return (
    <>
      <PageHeader
        title="Background Remover"
        description="Removes the background from an image using a custom model from Hugging Face."
      />
      <div className="mt-8">
        <gradio-app src="https://timemaster-removebg.hf.space"></gradio-app>
      </div>
    </>
  );
}
