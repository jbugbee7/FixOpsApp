
import PartsSearch from './parts/PartsSearch';
import AddPartToDirectory from './parts/AddPartToDirectory';

interface Part {
  part_name: string;
  part_number: string;
  part_cost: number;
  quantity: number;
  markup_percentage: number;
  final_price: number;
}

interface SystemPartsLookupProps {
  onAddPart: (part: Part) => void;
  applianceType?: string;
  applianceBrand?: string;
}

const SystemPartsLookup = ({ onAddPart, applianceType, applianceBrand }: SystemPartsLookupProps) => {
  return (
    <div className="space-y-4">
      <PartsSearch onAddPart={onAddPart} />
      <AddPartToDirectory 
        applianceType={applianceType}
        applianceBrand={applianceBrand}
      />
    </div>
  );
};

export default SystemPartsLookup;
