
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Mail, MessageSquare, Edit, Trash2, Eye, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CreateEmailTemplateDialog from './CreateEmailTemplateDialog';

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

const CommunicationTemplates = () => {
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CommunicationTemplate | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('communication_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to handle JSON fields properly
      const transformedData = (data || []).map(item => ({
        ...item,
        variables: Array.isArray(item.variables) ? item.variables : 
                  typeof item.variables === 'string' ? JSON.parse(item.variables) : []
      }));
      
      setTemplates(transformedData);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to load communication templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTemplateStatus = async (templateId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('communication_templates')
        .update({ is_active: !isActive })
        .eq('id', templateId);

      if (error) throw error;

      setTemplates(templates.map(template => 
        template.id === templateId ? { ...template, is_active: !isActive } : template
      ));

      toast({
        title: "Success",
        description: `Template ${!isActive ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "Error",
        description: "Failed to update template",
        variant: "destructive",
      });
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      const { error } = await supabase
        .from('communication_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;

      setTemplates(templates.filter(template => template.id !== templateId));
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'appointment':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'follow-up':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'completion':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const renderTemplatePreview = (template: CommunicationTemplate) => {
    if (!template) return null;

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
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading communication templates...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Communication Templates</h3>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No communication templates created yet</p>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(template.type)}
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                    <Badge variant={template.is_active ? "default" : "secondary"}>
                      {template.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Type: {template.type.toUpperCase()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Variables: {template.variables.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setPreviewOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleTemplateStatus(template.id, template.is_active)}
                    >
                      {template.is_active ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewOpen && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Template Preview: {selectedTemplate.name}</h3>
              <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                Close
              </Button>
            </div>
            {renderTemplatePreview(selectedTemplate)}
          </div>
        </div>
      )}

      <CreateEmailTemplateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onTemplateCreated={fetchTemplates}
      />
    </div>
  );
};

export default CommunicationTemplates;
