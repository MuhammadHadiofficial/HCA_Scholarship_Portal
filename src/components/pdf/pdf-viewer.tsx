"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Eye, 
  ExternalLink,
  Calendar,
  User,
  GraduationCap
} from "lucide-react";

interface PDFViewerProps {
  title: string;
  description?: string;
  pdfUrl: string;
  trigger?: React.ReactNode;
  metadata?: {
    type?: string;
    date?: string;
    author?: string;
    version?: string;
  };
  showDownload?: boolean;
}

export default function PDFViewer({ 
  title, 
  description, 
  pdfUrl, 
  trigger, 
  metadata,
  showDownload = true
}: PDFViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => {
    setIsOpen(true);
    setIsLoading(true);
    setError(null);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setError("Failed to load PDF. Please try again or download the file.");
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View PDF
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{title}</DialogTitle>
              {description && (
                <DialogDescription className="mt-2">
                  {description}
                </DialogDescription>
              )}
            </div>
            {showDownload && (
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </div>
          
          {/* Metadata Display */}
          {metadata && (
            <div className="flex flex-wrap gap-2 mt-4">
              {metadata.type && (
                <Badge variant="outline">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  {metadata.type}
                </Badge>
              )}
              {metadata.date && (
                <Badge variant="outline">
                  <Calendar className="w-3 h-3 mr-1" />
                  {metadata.date}
                </Badge>
              )}
              {metadata.author && (
                <Badge variant="outline">
                  <User className="w-3 h-3 mr-1" />
                  {metadata.author}
                </Badge>
              )}
              {metadata.version && (
                <Badge variant="outline">
                  <FileText className="w-3 h-3 mr-1" />
                  v{metadata.version}
                </Badge>
              )}
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 relative min-h-[600px]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading PDF...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-red-600 mb-4">{error}</p>
                <div className="space-x-2">
                  <Button onClick={() => window.open(pdfUrl, '_blank')} variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in New Tab
                  </Button>
                  {showDownload && (
                    <Button onClick={handleDownload}>
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          <iframe
            src={pdfUrl}
            className="w-full h-full min-h-[600px] border-0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title={title}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
