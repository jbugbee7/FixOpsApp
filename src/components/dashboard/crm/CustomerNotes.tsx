
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Pin, Tag, FileText } from 'lucide-react';
import { CustomerNote } from '@/types/interaction';

interface CustomerNotesProps {
  customerId: number;
  notes: CustomerNote[];
}

const CustomerNotes = ({ customerId, notes }: CustomerNotesProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case 'technical': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'billing': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'support': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'sales': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'internal': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || note.note_type === selectedType;
    return matchesSearch && matchesType;
  });

  const pinnedNotes = filteredNotes.filter(note => note.is_pinned);
  const regularNotes = filteredNotes.filter(note => !note.is_pinned);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Customer Notes</CardTitle>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 border rounded-md bg-background"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="general">General</option>
            <option value="technical">Technical</option>
            <option value="billing">Billing</option>
            <option value="support">Support</option>
            <option value="sales">Sales</option>
            <option value="internal">Internal</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pinnedNotes.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Pin className="h-4 w-4" />
                Pinned Notes
              </h4>
              <div className="space-y-3">
                {pinnedNotes.map((note) => (
                  <div key={note.id} className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Pin className="h-4 w-4 text-orange-500" />
                        <h5 className="font-medium">{note.title}</h5>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getNoteTypeColor(note.note_type)}>
                          {note.note_type}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{note.content}</p>
                    {note.tags.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        {note.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(note.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {regularNotes.length === 0 && pinnedNotes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notes found for this customer.</p>
            </div>
          ) : (
            regularNotes.length > 0 && (
              <div>
                {pinnedNotes.length > 0 && (
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    All Notes
                  </h4>
                )}
                <div className="space-y-3">
                  {regularNotes.map((note) => (
                    <div key={note.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium">{note.title}</h5>
                        <Badge className={getNoteTypeColor(note.note_type)}>
                          {note.note_type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{note.content}</p>
                      {note.tags.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap mb-2">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          {note.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(note.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerNotes;
