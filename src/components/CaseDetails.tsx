
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Wrench, Calendar, Phone, MapPin, FileText, Edit, Mail } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EditCaseForm from './EditCaseForm';
import { Case } from '@/types/case';

interface CaseDetailsProps {
  case: Case;
  onBack: () => void;
  onStatusUpdate: (caseId: string, newStatus: string) => void;
}

const CaseDetails = ({ case: caseData, onBack, onStatusUpdate }: CaseDetailsProps) => {
  const [status, setStatus] = useState(caseData.status);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCase, setCurrentCase] = useState(caseData);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    onStatusUpdate(caseData.id, newStatus);
  };

  const handleEditSave = (updatedCase: Case) => {
    setCurrentCase(updatedCase);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  // If in editing mode, show the edit form
  if (isEditing) {
    return (
      <EditCaseForm 
        case={currentCase} 
        onBack={handleEditCancel}
        onSave={handleEditSave}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Case Details</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Case #{currentCase.id}</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2"
              variant="outline"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Status Card */}
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between dark:text-slate-100">
                <span>Case Status</span>
                <Badge variant={status === 'Completed' ? 'default' : status === 'In Progress' ? 'secondary' : 'outline'}>
                  {status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium dark:text-slate-300">Update Status:</span>
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                <User className="h-5 w-5" />
                <span>Customer Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Customer Name</label>
                  <p className="text-lg font-semibold dark:text-slate-100">{currentCase.customer_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Phone Number</label>
                  <p className="text-lg dark:text-slate-100 flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {currentCase.customer_phone || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Email Address</label>
                  <p className="text-lg dark:text-slate-100 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {currentCase.customer_email || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Service Date</label>
                  <p className="text-lg dark:text-slate-100 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(currentCase.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Service Address</label>
                <div className="text-lg dark:text-slate-100">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      {currentCase.customer_address && (
                        <div>{currentCase.customer_address}</div>
                      )}
                      {currentCase.customer_address_line_2 && (
                        <div>{currentCase.customer_address_line_2}</div>
                      )}
                      {(currentCase.customer_city || currentCase.customer_state || currentCase.customer_zip_code) && (
                        <div>
                          {currentCase.customer_city}{currentCase.customer_city && currentCase.customer_state ? ', ' : ''}
                          {currentCase.customer_state} {currentCase.customer_zip_code}
                        </div>
                      )}
                      {!currentCase.customer_address && !currentCase.customer_city && 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appliance Information */}
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                <Wrench className="h-5 w-5" />
                <span>Appliance Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Appliance</label>
                  <p className="text-lg font-semibold dark:text-slate-100">{currentCase.appliance_brand} {currentCase.appliance_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Model</label>
                  <p className="text-lg dark:text-slate-100">{currentCase.appliance_model || 'N/A'}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Serial Number</label>
                  <p className="text-lg dark:text-slate-100">{currentCase.serial_number || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Warranty Status</label>
                  <p className="text-lg dark:text-slate-100">{currentCase.warranty_status || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                <FileText className="h-5 w-5" />
                <span>Service Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Service Type</label>
                <p className="text-lg dark:text-slate-100">{currentCase.service_type || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Problem Description</label>
                <p className="text-lg dark:text-slate-100">{currentCase.problem_description}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Initial Diagnosis</label>
                <p className="text-lg dark:text-slate-100">{currentCase.initial_diagnosis || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Parts Needed</label>
                <p className="text-lg dark:text-slate-100">{currentCase.parts_needed || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Estimated Time</label>
                <p className="text-lg dark:text-slate-100">{currentCase.estimated_time || 'N/A'}</p>
              </div>
              {currentCase.technician_notes && (
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Technician Notes</label>
                  <p className="text-lg dark:text-slate-100">{currentCase.technician_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
