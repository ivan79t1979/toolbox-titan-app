import { PageHeader } from '@/components/page-header';
import { ImageCompressorForm } from './image-compressor-form';

export default function ImageCompressorPage() {
  return (
    <>
      <PageHeader
        title="Image Compressor"
        description="Optimize your images by reducing their file size without significant quality loss."
      />
      <ImageCompressorForm />
    </>
  );
}
