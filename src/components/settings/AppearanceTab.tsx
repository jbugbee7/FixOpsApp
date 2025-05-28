
import { Label } from "@/components/ui/label";
import ThemeToggle from "@/components/ThemeToggle";

const AppearanceTab = () => {
  return (
    <div className="space-y-6 mt-0">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Appearance Settings</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Customize how the application looks and feels
        </p>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
            <div>
              <Label className="text-base font-medium">Theme</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Switch between light and dark mode
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceTab;
