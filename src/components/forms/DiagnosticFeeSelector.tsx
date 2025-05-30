
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DiagnosticFeeSelectorProps {
  value: string;
  onChange: (type: string, amount: number) => void;
}

const DiagnosticFeeSelector = ({ value, onChange }: DiagnosticFeeSelectorProps) => {
  const diagnosticOptions = [
    { type: "standard", label: "Standard", cost: 99 },
    { type: "built-in", label: "Built-in Brands", cost: 125 },
    { type: "boutique", label: "Boutique Brands", cost: 150 },
  ];

  const handleChange = (selectedType: string) => {
    const option = diagnosticOptions.find(opt => opt.type === selectedType);
    if (option) {
      onChange(option.type, option.cost);
    }
  };

  const selectedOption = diagnosticOptions.find(opt => opt.type === value);

  return (
    <div className="space-y-2">
      <Label htmlFor="diagnosticFee">Diagnostic Fee</Label>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select diagnostic fee type" />
        </SelectTrigger>
        <SelectContent>
          {diagnosticOptions.map((option) => (
            <SelectItem key={option.type} value={option.type}>
              {option.label} - ${option.cost}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedOption && (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Selected: {selectedOption.label} - ${selectedOption.cost}
        </p>
      )}
    </div>
  );
};

export default DiagnosticFeeSelector;
