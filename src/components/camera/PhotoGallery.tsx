
import { Button } from "@/components/ui/button";
import { Trash2, Download } from 'lucide-react';

interface PhotoGalleryProps {
  photos: string[];
  onRemovePhoto: (photoUrl: string, index: number) => void;
}

const PhotoGallery = ({ photos, onRemovePhoto }: PhotoGalleryProps) => {
  if (photos.length === 0) return null;

  const downloadPhoto = (photoUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = `case-photo-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
          Photos ({photos.length})
        </h4>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Tap to download or delete
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative group">
            <div className="relative overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 aspect-square">
              <img
                src={photo}
                alt={`Case photo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-gray-700"
                    onClick={() => downloadPhoto(photo, index)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-600"
                    onClick={() => onRemovePhoto(photo, index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Photo number badge */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                {index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;
