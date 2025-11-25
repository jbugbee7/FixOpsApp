
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, X, Upload } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';

interface PhotosSectionProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  expanded: boolean;
  onToggle: () => void;
  icon: LucideIcon;
}

const PhotosSection = ({ photos, onPhotosChange, expanded, onToggle, icon: Icon }: PhotosSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('work-order-photos')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('work-order-photos')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      onPhotosChange([...photos, ...uploadedUrls]);
      toast({
        title: "Photos uploaded",
        description: `${uploadedUrls.length} photo${uploadedUrls.length !== 1 ? 's' : ''} uploaded successfully.`,
      });
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload photos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = async (photoUrl: string) => {
    try {
      const fileName = photoUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('work-order-photos')
          .remove([fileName]);
      }

      onPhotosChange(photos.filter(p => p !== photoUrl));
      toast({
        title: "Photo removed",
        description: "Photo has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing photo:', error);
      toast({
        title: "Removal failed",
        description: "Failed to remove photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader 
        className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        onClick={onToggle}
      >
        <CardTitle className="flex items-center justify-between dark:text-slate-100">
          <div className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Photos</span>
          </div>
          <div className="flex items-center space-x-4">
            {photos.length > 0 && (
              <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
                {photos.length} photo{photos.length !== 1 ? 's' : ''}
              </span>
            )}
            <Icon className="h-5 w-5" />
          </div>
        </CardTitle>
      </CardHeader>
      {expanded && (
        <CardContent className="animate-fade-in space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex-1"
            >
              <Camera className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Take Photo'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.removeAttribute('capture');
                  fileInputRef.current.click();
                }
              }}
              disabled={uploading}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>

          {photos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photoUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photoUrl}
                    alt={`Work order photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(photoUrl)}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No photos added yet.</p>
              <p className="text-sm mt-2">Take or upload photos to get started.</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default PhotosSection;
