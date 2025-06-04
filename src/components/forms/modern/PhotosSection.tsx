
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface PhotosSectionProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  expanded: boolean;
  onToggle: () => void;
  icon: LucideIcon;
}

const PhotosSection = ({ photos, onPhotosChange, expanded, onToggle, icon: Icon }: PhotosSectionProps) => {
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
        <CardContent className="animate-fade-in">
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Camera functionality has been temporarily disabled.</p>
            <p className="text-sm mt-2">Photos can be added in a future update.</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default PhotosSection;
