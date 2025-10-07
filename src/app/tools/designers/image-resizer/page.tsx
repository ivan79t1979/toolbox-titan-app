import { PageHeader } from '@/components/page-header';
import { ImageResizerForm } from './image-resizer-form';

export default function ImageResizerPage() {
  return (
    <>
      <PageHeader
        title="Image Resizer"
        description="Easily resize images to your desired dimensions while maintaining aspect ratio."
      />
      <ImageResizerForm />
    </>
  );
}
