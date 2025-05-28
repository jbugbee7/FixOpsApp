
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Shield } from 'lucide-react';

interface AgreementItemProps {
  type: 'policy' | 'terms';
  agreed: boolean;
  viewed: boolean;
  onAgreedChange: (checked: boolean) => void;
  onViewDocument: () => void;
}

const AgreementItem = ({
  type,
  agreed,
  viewed,
  onAgreedChange,
  onViewDocument
}: AgreementItemProps) => {
  const isPolicy = type === 'policy';
  const Icon = isPolicy ? Shield : FileText;
  const title = isPolicy ? 'Privacy Policy' : 'Terms of Service';
  const label = `I have read and agree to the ${title}`;

  return (
    <div className="flex items-start space-x-3 p-4 border rounded-lg dark:border-slate-600">
      <Checkbox
        id={type}
        checked={agreed}
        onCheckedChange={onAgreedChange}
        disabled={!viewed}
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <label
            htmlFor={type}
            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-200 ${!viewed ? 'text-muted-foreground' : ''}`}
          >
            {label}
          </label>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-2">
          {viewed ? 'Document reviewed ✓' : 'You must read this document first'}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onViewDocument}
          className={`text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700 ${viewed ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
        >
          <FileText className="h-3 w-3 mr-1" />
          {viewed ? `${title} (Reviewed)` : `Read ${title} *Required`}
        </Button>
      </div>
    </div>
  );
};

export default AgreementItem;
