
import { applianceGuides } from "@/data/applianceGuides";
import ApplianceGuideCard from "./ApplianceGuideCard";

const GuidesTab = () => {
  return (
    <div className="grid gap-4">
      {applianceGuides.map((appliance, index) => (
        <ApplianceGuideCard key={index} appliance={appliance} />
      ))}
    </div>
  );
};

export default GuidesTab;
