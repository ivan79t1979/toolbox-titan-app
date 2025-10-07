import { PageHeader } from '@/components/page-header';
import { ImageResizerForm } from './image-resizer-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BatchImageResizerForm } from './batch-image-resizer-form';

export default function ImageResizerPage() {
  return (
    <>
      <PageHeader
        title="Image Resizer"
        description="Easily resize images to your desired dimensions while maintaining aspect ratio."
      />
      <Tabs defaultValue="single">
        <TabsList className="grid w-full grid-cols-2 max-w-sm">
          <TabsTrigger value="single">Single Image</TabsTrigger>
          <TabsTrigger value="batch">Batch Resize</TabsTrigger>
        </TabsList>
        <TabsContent value="single" className="mt-6">
          <ImageResizerForm />
        </TabsContent>
        <TabsContent value="batch" className="mt-6">
          <BatchImageResizerForm />
        </TabsContent>
      </Tabs>
    </>
  );
}
