
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CommunicationTemplate {
  id: string;
  name: string;
  type: string;
  category: string;
  subject: string;
  content: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface TemplatePreviewModalProps {
  template: CommunicationTemplate | null;
  open: boolean;
  onClose: () => void;
}

const TemplatePreviewModal = ({ template, open, onClose }: TemplatePreviewModalProps) => {
  if (!open || !template) return null;

  // Sample data for preview
  const sampleData = {
    customerName: "John Smith",
    appointmentDate: "March 15, 2024",
    technicianName: "Mike Johnson",
    serviceType: "Refrigerator Repair"
  };

  let previewContent = template.content;
  
  // Replace variables with sample data
  template.variables.forEach(variable => {
    const regex = new RegExp(`{{${variable}}}`, 'g');
    previewContent = previewContent.replace(regex, sampleData[variable as keyof typeof sampleData] || `[${variable}]`);
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Template Preview: {template.name}</h3>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Subject:</h4>
            <p className="text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">{template.subject}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Content Preview:</h4>
            <div className="text-sm bg-gray-50 dark:bg-gray-800 p-4 rounded whitespace-pre-wrap">
              {previewContent}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Available Variables:</h4>
            <div className="flex flex-wrap gap-2">
              {template.variables.map((variable, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {`{{${variable}}}`}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal;
