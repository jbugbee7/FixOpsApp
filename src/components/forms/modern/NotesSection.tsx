
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface NotesSectionProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
  expanded: boolean;
  onToggle: () => void;
  icon: LucideIcon;
}

const NotesSection = ({ formData, onInputChange, expanded, onToggle, icon: Icon }: NotesSectionProps) => {
  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader 
        className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        onClick={onToggle}
      >
        <CardTitle className="flex items-center justify-between dark:text-slate-100">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Additional Notes</span>
          </div>
          <Icon className="h-5 w-5" />
        </CardTitle>
      </CardHeader>
      {expanded && (
        <CardContent className="animate-fade-in">
          <div>
            <Label htmlFor="technicianNotes">Technician Notes</Label>
            <Textarea
              id="technicianNotes"
              value={formData.technicianNotes}
              onChange={(e) => onInputChange('technicianNotes', e.target.value)}
              placeholder="Internal notes, observations, follow-up items"
              className="min-h-[80px] mt-1"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default NotesSection;
