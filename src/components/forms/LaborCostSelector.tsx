
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LaborCostSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const LaborCostSelector = ({ value, onChange }: LaborCostSelectorProps) => {
  const laborLevels = [
    { level: 0, label: "Complimentary", cost: 0 },
    { level: 1, label: "Level 1", cost: 110 },
    { level: 2, label: "Level 2", cost: 150 },
    { level: 3, label: "Level 3", cost: 190 },
    { level: 4, label: "Level 4", cost: 230 },
    { level: 5, label: "Level 5", cost: 270 },
    { level: 6, label: "Level 6", cost: 310 },
    { level: 7, label: "Level 7", cost: 350 },
    { level: 8, label: "Level 8", cost: 390 },
    { level: 9, label: "Level 9", cost: 430 },
    { level: 10, label: "Level 10", cost: 470 },
  ];

  const selectedLevel = laborLevels.find(l => l.level === value);

  return (
    <div className="space-y-2">
      <Label htmlFor="laborLevel">Labor Cost Level</Label>
      <Select 
        value={value.toString()} 
        onValueChange={(val) => onChange(parseInt(val))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select labor level" />
        </SelectTrigger>
        <SelectContent>
          {laborLevels.map((level) => (
            <SelectItem key={level.level} value={level.level.toString()}>
              {level.label} - ${level.cost}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedLevel && (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Selected: {selectedLevel.label} - ${selectedLevel.cost}
        </p>
      )}
    </div>
  );
};

export default LaborCostSelector;
