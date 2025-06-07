
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CreateEmailTemplateDialog from './CreateEmailTemplateDialog';
import TemplatesList from './templates/TemplatesList';
import TemplatePreviewModal from './templates/TemplatePreviewModal';

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

  const openPreview = (template: CommunicationTemplate) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
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
        <TemplatesList 
          templates={templates}
          onTemplateUpdated={fetchTemplates}
          onPreviewClick={openPreview}
        />
      )}

      <TemplatePreviewModal
        template={selectedTemplate}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />

      <CreateEmailTemplateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onTemplateCreated={fetchTemplates}
      />
    </div>
  );
};

export default CommunicationTemplates;
