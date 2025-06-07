
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Customer } from '@/types/crm';
import CustomerInteractions from './CustomerInteractions';
import CustomerNotes from './CustomerNotes';
import CustomerTimeline from './CustomerTimeline';

interface CustomerDetailViewProps {
  customer: Customer;
  onBack: () => void;
}

const CustomerDetailView = ({ customer, onBack }: CustomerDetailViewProps) => {
  // Mock data for interactions, notes, and timeline
  const [interactions] = useState([]);
  const [notes] = useState([]);
  const [timeline] = useState([]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'at risk': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment.toLowerCase()) {
      case 'vip': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'premium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'standard': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <h1 className="text-2xl font-bold">Customer Details</h1>
      </div>

      {/* Customer Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{customer.name}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge className={getStatusColor(customer.status)}>
                  {customer.status}
                </Badge>
                <Badge className={getSegmentColor(customer.segment)}>
                  {customer.segment}
                </Badge>
              </div>
            </div>
            <Button size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Customer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.address}</span>
                </div>
              </div>
            </div>

            {/* Customer Metrics */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">Customer Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Orders:</span>
                  <span className="font-medium">{customer.totalOrders}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Spent:</span>
                  <span className="font-medium">${customer.totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Lifetime Value:</span>
                  <span className="font-medium">${customer.lifetime_value.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Order Value:</span>
                  <span className="font-medium">${customer.avgOrderValue}</span>
                </div>
              </div>
            </div>

            {/* Important Dates */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">Important Dates</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Acquisition Date</div>
                    <div>{new Date(customer.acquisitionDate).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Last Contact</div>
                    <div>{new Date(customer.lastContact).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="interactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="interactions">
          <CustomerInteractions customerId={customer.id} interactions={interactions} />
        </TabsContent>

        <TabsContent value="notes">
          <CustomerNotes customerId={customer.id} notes={notes} />
        </TabsContent>

        <TabsContent value="timeline">
          <CustomerTimeline customerId={customer.id} timeline={timeline} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDetailView;
