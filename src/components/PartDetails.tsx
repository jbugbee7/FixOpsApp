
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface PartDetailsProps {
  part: {
    id: string;
    part_number: string;
    part_name: string;
    appliance_brand?: string;
    appliance_model?: string;
    appliance_type?: string;
    created_at: string;
  };
  onBack: () => void;
}

const PartDetails = ({ part, onBack }: PartDetailsProps) => {
  const handleGoogleSearch = () => {
    const searchQuery = `${part.part_number} ${part.part_name} ${part.appliance_brand || ''} replacement part`.trim();
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(googleUrl, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 dark:bg-slate-900/80 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Part Details</h1>
            <div></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="dark:text-slate-100 flex items-center justify-between">
              <span>{part.part_name}</span>
              <Button onClick={handleGoogleSearch} size="sm" className="flex items-center space-x-2">
                <ExternalLink className="h-4 w-4" />
                <span>Search Online</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Part Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Part Number</label>
                    <p className="text-slate-900 dark:text-slate-100 font-mono">{part.part_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Part Name</label>
                    <p className="text-slate-900 dark:text-slate-100">{part.part_name}</p>
                  </div>
                  {part.appliance_brand && (
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Appliance Brand</label>
                      <p className="text-slate-900 dark:text-slate-100">{part.appliance_brand}</p>
                    </div>
                  )}
                  {part.appliance_model && (
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Appliance Model</label>
                      <p className="text-slate-900 dark:text-slate-100">{part.appliance_model}</p>
                    </div>
                  )}
                  {part.appliance_type && (
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Appliance Type</label>
                      <p className="text-slate-900 dark:text-slate-100">{part.appliance_type}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Added to Database</label>
                    <p className="text-slate-900 dark:text-slate-100">{formatDate(part.created_at)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Part Resources</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Find purchasing options, installation guides, and compatibility information for this part.
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={handleGoogleSearch} 
                    variant="outline" 
                    className="w-full flex items-center space-x-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Find This Part</span>
                  </Button>
                  <Button 
                    onClick={() => {
                      const searchQuery = `${part.part_number} installation instructions`;
                      const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
                      window.open(googleUrl, '_blank');
                    }} 
                    variant="outline" 
                    className="w-full flex items-center space-x-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Installation Guide</span>
                  </Button>
                  <Button 
                    onClick={() => {
                      const searchQuery = `${part.part_number} compatibility ${part.appliance_brand || ''}`.trim();
                      const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
                      window.open(googleUrl, '_blank');
                    }} 
                    variant="outline" 
                    className="w-full flex items-center space-x-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Compatibility Check</span>
                  </Button>
                  <Button 
                    onClick={() => {
                      const searchQuery = `${part.part_number} price compare buy`;
                      const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
                      window.open(googleUrl, '_blank');
                    }} 
                    variant="outline" 
                    className="w-full flex items-center space-x-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Compare Prices</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartDetails;
