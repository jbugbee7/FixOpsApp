
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';

interface PhotoGalleryProps {
  photos: string[];
  onRemovePhoto: (photoUrl: string, index: number) => void;
}

const PhotoGallery = ({ photos, onRemovePhoto }: PhotoGalleryProps) => {
  if (photos.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-slate-900 dark:text-slate-100">
        Captured Photos ({photos.length})
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative group">
            <img
              src={photo}
              alt={`Case photo ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemovePhoto(photo, index)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;
