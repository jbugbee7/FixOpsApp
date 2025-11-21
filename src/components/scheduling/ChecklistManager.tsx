import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ClipboardList, 
  CheckCircle2,
  Circle,
  GripVertical 
} from 'lucide-react';
import { JobChecklist } from '@/hooks/useSchedulingData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface ChecklistManagerProps {
  checklists: JobChecklist[];
  onCreateChecklist: (checklist: Partial<JobChecklist>) => void;
  onUpdateChecklist: (id: string, updates: Partial<JobChecklist>) => void;
  onDeleteChecklist: (id: string) => void;
}

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  required: boolean;
  category?: string;
}

const ChecklistManager: React.FC<ChecklistManagerProps> = ({
  checklists,
  onCreateChecklist,
  onUpdateChecklist,
  onDeleteChecklist,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<JobChecklist | null>(null);
  const [formData, setFormData] = useState<Partial<JobChecklist>>({
    name: '',
    description: '',
    items: [],
    is_active: true,
  });

  const applianceTypes = [
    'Refrigerator', 'Washer', 'Dryer', 'Dishwasher', 'Oven', 'Microwave', 
    'HVAC', 'Water Heater', 'Garbage Disposal', 'Other'
  ];

  const serviceTypes = [
    'Installation', 'Repair', 'Maintenance', 'Inspection', 'Warranty'
  ];

  const categories = [
    'Safety Check', 'Initial Inspection', 'Diagnostics', 'Repair Steps', 
    'Testing', 'Cleanup', 'Customer Communication'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      items: [],
      is_active: true,
    });
    setEditingChecklist(null);
  };

  const handleSubmit = () => {
    if (!formData.name?.trim()) return;

    if (editingChecklist) {
      onUpdateChecklist(editingChecklist.id, formData);
    } else {
      onCreateChecklist(formData);
    }

    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleEdit = (checklist: JobChecklist) => {
    setFormData(checklist);
    setEditingChecklist(checklist);
    setIsCreateModalOpen(true);
  };

  const addChecklistItem = () => {
    const newItem: ChecklistItem = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      required: false,
      category: 'Initial Inspection',
    };

    setFormData(prev => ({
      ...prev,
      checklist_items: [...(prev.checklist_items || []), newItem],
    }));
  };

  const updateChecklistItem = (index: number, updates: Partial<ChecklistItem>) => {
    setFormData(prev => ({
      ...prev,
      checklist_items: prev.checklist_items?.map((item, i) => 
        i === index ? { ...item, ...updates } : item
      ) || [],
    }));
  };

  const removeChecklistItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      checklist_items: prev.checklist_items?.filter((_, i) => i !== index) || [],
    }));
  };

  const groupedItems = (items: ChecklistItem[]) => {
    const grouped: Record<string, ChecklistItem[]> = {};
    items.forEach(item => {
      const category = item.category || 'Other';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(item);
    });
    return grouped;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Job Checklists
          </CardTitle>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create Checklist
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingChecklist ? 'Edit Checklist' : 'Create New Checklist'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Checklist Name</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Refrigerator Repair Checklist"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appliance_type">Appliance Type</Label>
                    <Select
                      value={formData.appliance_type || ''}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, appliance_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select appliance type" />
                      </SelectTrigger>
                      <SelectContent>
                        {applianceTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service_type">Service Type</Label>
                    <Select
                      value={formData.service_type || ''}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, service_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of when to use this checklist"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Checklist Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Checklist Items</h3>
                    <Button type="button" variant="outline" onClick={addChecklistItem}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {formData.checklist_items?.map((item, index) => (
                      <div key={item.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <GripVertical className="h-5 w-5 text-muted-foreground mt-2" />
                          <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <Input
                                placeholder="Item title"
                                value={item.title}
                                onChange={(e) => updateChecklistItem(index, { title: e.target.value })}
                              />
                              <Select
                                value={item.category || ''}
                                onValueChange={(value) => updateChecklistItem(index, { category: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Textarea
                              placeholder="Item description (optional)"
                              value={item.description || ''}
                              onChange={(e) => updateChecklistItem(index, { description: e.target.value })}
                              rows={2}
                            />
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`required-${index}`}
                                checked={item.required}
                                onCheckedChange={(checked) => 
                                  updateChecklistItem(index, { required: !!checked })
                                }
                              />
                              <Label htmlFor={`required-${index}`}>Required item</Label>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeChecklistItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingChecklist ? 'Update' : 'Create'} Checklist
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {checklists.map(checklist => {
              const grouped = groupedItems(checklist.checklist_items);
              
              return (
                <Card key={checklist.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{checklist.name}</CardTitle>
                        <div className="flex gap-2 mt-2">
                          {checklist.appliance_type && (
                            <Badge variant="secondary" className="text-xs">
                              {checklist.appliance_type}
                            </Badge>
                          )}
                          {checklist.service_type && (
                            <Badge variant="outline" className="text-xs">
                              {checklist.service_type}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(checklist)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteChecklist(checklist.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {checklist.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {checklist.description}
                      </p>
                    )}
                    
                    <div className="space-y-3">
                      <div className="text-sm font-medium">
                        {checklist.checklist_items.length} items
                      </div>
                      
                      {Object.entries(grouped).slice(0, 3).map(([category, items]) => (
                        <div key={category} className="space-y-1">
                          <div className="text-xs font-medium text-muted-foreground">
                            {category}
                          </div>
                          {items.slice(0, 2).map(item => (
                            <div key={item.id} className="flex items-center gap-2 text-xs">
                              {item.required ? (
                                <CheckCircle2 className="h-3 w-3 text-red-500" />
                              ) : (
                                <Circle className="h-3 w-3 text-muted-foreground" />
                              )}
                              <span className="truncate">{item.title}</span>
                            </div>
                          ))}
                          {items.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{items.length - 2} more
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {Object.keys(grouped).length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{Object.keys(grouped).length - 3} more categories
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChecklistManager;