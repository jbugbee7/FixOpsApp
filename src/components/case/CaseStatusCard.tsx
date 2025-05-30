
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CaseStatusCardProps {
  status: string;
  onStatusChange: (newStatus: string) => void;
}

const CaseStatusCard = ({ status, onStatusChange }: CaseStatusCardProps) => {
  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between dark:text-slate-100">
          <span>Case Status</span>
          <Badge variant={status === 'Completed' ? 'default' : status === 'In Progress' ? 'secondary' : 'outline'}>
            {status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium dark:text-slate-300">Update Status:</span>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseStatusCard;
