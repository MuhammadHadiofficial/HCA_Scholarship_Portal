"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";
import PDFViewer from "@/components/pdf/pdf-viewer";

export default function StudentGuidelinesPage() {
  const [selectedGuideline, setSelectedGuideline] = useState<any>(null);

  // Mock guidelines data - replace with real data from API
  const guidelines = [
    {
      id: 1,
      title: "Scholarship Application Guidelines",
      version: "2.1",
      lastUpdated: "2024-01-15",
      description: "Complete guide for applying to scholarships",
      isActive: true,
      content: "Comprehensive guidelines covering eligibility, application process, and requirements.",
      category: "Application"
    },
    {
      id: 2,
      title: "Academic Requirements & Standards",
      version: "1.8",
      lastUpdated: "2024-01-10",
      description: "Academic criteria and performance standards",
      isActive: true,
      content: "Detailed academic requirements including CGPA standards and performance expectations.",
      category: "Academic"
    },
    {
      id: 3,
      title: "Financial Need Assessment",
      version: "1.5",
      lastUpdated: "2024-01-05",
      description: "How financial need is evaluated",
      isActive: true,
      content: "Process and criteria for assessing student financial need and family income verification.",
      category: "Financial"
    },
    {
      id: 4,
      title: "Scholarship Maintenance Guidelines",
      version: "1.3",
      lastUpdated: "2023-12-20",
      description: "Maintaining your scholarship award",
      isActive: true,
      content: "Requirements and conditions for maintaining scholarship eligibility and continued funding.",
      category: "Maintenance"
    }
  ];

  const policies = [
    {
      id: 1,
      title: "Code of Conduct",
      version: "1.2",
      lastUpdated: "2024-01-12",
      description: "Student conduct and behavioral expectations",
      isActive: true,
      category: "Conduct"
    },
    {
      id: 2,
      title: "Appeal Process",
      version: "1.0",
      lastUpdated: "2023-12-15",
      description: "How to appeal scholarship decisions",
      isActive: true,
      category: "Appeals"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Application": return "bg-blue-100 text-blue-800";
      case "Academic": return "bg-green-100 text-green-800";
      case "Financial": return "bg-purple-100 text-purple-800";
      case "Maintenance": return "bg-orange-100 text-orange-800";
      case "Conduct": return "bg-red-100 text-red-800";
      case "Appeals": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Application": return <FileText className="w-4 h-4" />;
      case "Academic": return <CheckCircle className="w-4 h-4" />;
      case "Financial": return <Info className="w-4 h-4" />;
      case "Maintenance": return <AlertCircle className="w-4 h-4" />;
      case "Conduct": return <AlertCircle className="w-4 h-4" />;
      case "Appeals": return <Info className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Scholarship Guidelines & Policies
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Access the latest scholarship guidelines, policies, and important information
          </p>
        </div>

        {/* Important Notice */}
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">Important Notice</h3>
                <p className="text-orange-700 text-sm">
                  Guidelines and policies are regularly updated. Always refer to the portal for the most current version. 
                  The PDF versions are generated on-demand and may not reflect the latest changes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guidelines Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Scholarship Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guidelines.map((guideline) => (
              <Card key={guideline.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{guideline.title}</CardTitle>
                      <CardDescription className="mb-3">
                        {guideline.description}
                      </CardDescription>
                    </div>
                    <Badge className={getCategoryColor(guideline.category)}>
                      {getCategoryIcon(guideline.category)}
                      <span className="ml-1">{guideline.category}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Version:</span>
                      <span className="font-medium">v{guideline.version}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Updated:</span>
                      <span className="font-medium">
                        {new Date(guideline.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="pt-3 border-t">
                      <div className="flex gap-2">
                        <PDFViewer
                          title={guideline.title}
                          description={guideline.description}
                          pdfUrl="/api/pdf/guidelines"
                          trigger={
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          }
                          metadata={{
                            type: guideline.category,
                            date: new Date(guideline.lastUpdated).toLocaleDateString(),
                            version: guideline.version
                          }}
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = "/api/pdf/guidelines";
                            link.download = `${guideline.title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Policies Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Policies & Procedures
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {policies.map((policy) => (
              <Card key={policy.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{policy.title}</CardTitle>
                      <CardDescription className="mb-3">
                        {policy.description}
                      </CardDescription>
                    </div>
                    <Badge className={getCategoryColor(policy.category)}>
                      {getCategoryIcon(policy.category)}
                      <span className="ml-1">{policy.category}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Version:</span>
                      <span className="font-medium">v{policy.version}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Updated:</span>
                      <span className="font-medium">
                        {new Date(policy.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="pt-3 border-t">
                      <Button variant="outline" size="sm" className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        View Policy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Access Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quick Access</CardTitle>
            <CardDescription>
              Frequently accessed documents and resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Complete Guidelines Package</h4>
                    <p className="text-sm text-gray-600">All guidelines in one PDF</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Academic Calendar</h4>
                    <p className="text-sm text-gray-600">Important dates and deadlines</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View Calendar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
