"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useAddApplicationReview, useAddApplicationNote } from "@/lib/hooks/use-review-workflow";

interface ApplicationReviewDialogProps {
  application: any;
  reviewerId: string;
  trigger?: React.ReactNode;
}

export default function ApplicationReviewDialog({ 
  application, 
  reviewerId, 
  trigger 
}: ApplicationReviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("review");
  
  // Review form state
  const [reviewData, setReviewData] = useState({
    status: "PENDING",
    vote: "NEEDS_MORE_INFO",
    notes: ""
  });
  
  // Note form state
  const [noteData, setNoteData] = useState({
    content: "",
    isInternal: false
  });

  const addReviewMutation = useAddApplicationReview();
  const addNoteMutation = useAddApplicationNote();

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("applicationId", application.id);
    formData.append("status", reviewData.status);
    formData.append("vote", reviewData.vote);
    formData.append("notes", reviewData.notes);

    try {
      const result = await addReviewMutation.mutateAsync({ reviewerId, formData });
      if (result.success) {
        setReviewData({ status: "PENDING", vote: "NEEDS_MORE_INFO", notes: "" });
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("applicationId", application.id);
    formData.append("content", noteData.content);
    formData.append("isInternal", noteData.isInternal.toString());

    try {
      const result = await addNoteMutation.mutateAsync({ authorId: reviewerId, formData });
      if (result.success) {
        setNoteData({ content: "", isInternal: false });
      }
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return <Clock className="w-4 h-4" />;
      case "IN_PROGRESS": return <AlertCircle className="w-4 h-4" />;
      case "COMPLETED": return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getVoteIcon = (vote: string) => {
    switch (vote) {
      case "APPROVE": return <ThumbsUp className="w-4 h-4" />;
      case "REJECT": return <ThumbsDown className="w-4 h-4" />;
      case "NEEDS_MORE_INFO": return <HelpCircle className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getVoteColor = (vote: string) => {
    switch (vote) {
      case "APPROVE": return "bg-green-100 text-green-800";
      case "REJECT": return "bg-red-100 text-red-800";
      case "NEEDS_MORE_INFO": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-2" />Review</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Application</DialogTitle>
          <DialogDescription>
            Review application details and provide feedback
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Application Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Application Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Student</Label>
                  <p className="text-sm text-gray-600">
                    {application.student?.studentProfile?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Intake</Label>
                  <p className="text-sm text-gray-600">
                    {application.intake?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Department</Label>
                  <p className="text-sm text-gray-600">
                    {application.academicInfo?.department || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">CGPA</Label>
                  <p className="text-sm text-gray-600">
                    {application.academicInfo?.cgpa || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="review">Review & Vote</TabsTrigger>
              <TabsTrigger value="notes">Notes & Comments</TabsTrigger>
            </TabsList>

            <TabsContent value="review" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Review Decision</CardTitle>
                  <CardDescription>
                    Provide your review status and vote for this application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="status">Review Status</Label>
                        <Select 
                          value={reviewData.status} 
                          onValueChange={(value) => setReviewData(prev => ({ ...prev, status: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>Pending</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="IN_PROGRESS">
                              <div className="flex items-center space-x-2">
                                <AlertCircle className="w-4 h-4" />
                                <span>In Progress</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="COMPLETED">
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4" />
                                <span>Completed</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="vote">Vote</Label>
                        <Select 
                          value={reviewData.vote} 
                          onValueChange={(value) => setReviewData(prev => ({ ...prev, vote: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="APPROVE">
                              <div className="flex items-center space-x-2">
                                <ThumbsUp className="w-4 h-4" />
                                <span>Approve</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="REJECT">
                              <div className="flex items-center space-x-2">
                                <ThumbsDown className="w-4 h-4" />
                                <span>Reject</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="NEEDS_MORE_INFO">
                              <div className="flex items-center space-x-2">
                                <HelpCircle className="w-4 h-4" />
                                <span>Needs More Info</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Review Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Provide detailed feedback about this application..."
                        value={reviewData.notes}
                        onChange={(e) => setReviewData(prev => ({ ...prev, notes: e.target.value }))}
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={addReviewMutation.isPending}
                      >
                        {addReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Add Note</CardTitle>
                  <CardDescription>
                    Add internal or public notes about this application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleNoteSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="content">Note Content</Label>
                      <Textarea
                        id="content"
                        placeholder="Enter your note..."
                        value={noteData.content}
                        onChange={(e) => setNoteData(prev => ({ ...prev, content: e.target.value }))}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isInternal"
                        checked={noteData.isInternal}
                        onChange={(e) => setNoteData(prev => ({ ...prev, isInternal: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="isInternal">Internal note (only visible to staff/admin)</Label>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={addNoteMutation.isPending}
                      >
                        {addNoteMutation.isPending ? "Adding..." : "Add Note"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Existing Notes */}
              {application.notes && application.notes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Existing Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {application.notes.map((note: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              {note.author?.name || "Unknown"}
                            </span>
                            <div className="flex items-center space-x-2">
                              {note.isInternal && (
                                <Badge variant="secondary">Internal</Badge>
                              )}
                              <span className="text-xs text-gray-500">
                                {new Date(note.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Existing Reviews */}
          {application.reviews && application.reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Review History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {application.reviews.map((review: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {review.reviewer?.name || "Unknown"}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Badge className={getVoteColor(review.vote)}>
                            {getVoteIcon(review.vote)}
                            <span className="ml-1">{review.vote.replace("_", " ")}</span>
                          </Badge>
                          <Badge variant="outline">
                            {getStatusIcon(review.status)}
                            <span className="ml-1">{review.status.replace("_", " ")}</span>
                          </Badge>
                        </div>
                      </div>
                      {review.notes && (
                        <p className="text-sm text-gray-700">{review.notes}</p>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
