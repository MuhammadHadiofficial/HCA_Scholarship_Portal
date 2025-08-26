"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  Crown, 
  Star,
  User,
  Building2,
  MapPin,
  Calendar,
  AlertCircle
} from "lucide-react";
import { useVerifyAlumniProfile } from "@/lib/hooks/use-alumni-onboarding";

interface AlumniVerificationDialogProps {
  alumni: any;
  verifierId: string;
  trigger?: React.ReactNode;
}

export default function AlumniVerificationDialog({ 
  alumni, 
  verifierId, 
  trigger 
}: AlumniVerificationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [verificationData, setVerificationData] = useState({
    isVerified: false,
    verificationNotes: "",
    category: "BASIC",
    rank: "BRONZE"
  });

  const verifyAlumniProfileMutation = useVerifyAlumniProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("alumniId", alumni.alumniId);
    formData.append("isVerified", verificationData.isVerified.toString());
    formData.append("verificationNotes", verificationData.verificationNotes);
    formData.append("category", verificationData.category);
    formData.append("rank", verificationData.rank);
    formData.append("verifiedBy", verifierId);

    try {
      const result = await verifyAlumniProfileMutation.mutateAsync(formData);
      if (result.success) {
        setVerificationData({
          isVerified: false,
          verificationNotes: "",
          category: "BASIC",
          rank: "BRONZE"
        });
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Failed to verify alumni profile:", error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "BASIC": return <User className="w-4 h-4" />;
      case "SILVER": return <Star className="w-4 h-4" />;
      case "GOLD": return <Crown className="w-4 h-4" />;
      case "PLATINUM": return <Crown className="w-4 h-4" />;
      case "DIAMOND": return <Crown className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "BASIC": return "bg-gray-100 text-gray-800";
      case "SILVER": return "bg-gray-200 text-gray-800";
      case "GOLD": return "bg-yellow-100 text-yellow-800";
      case "PLATINUM": return "bg-blue-100 text-blue-800";
      case "DIAMOND": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "BRONZE": return "bg-orange-100 text-orange-800";
      case "SILVER": return "bg-gray-200 text-gray-800";
      case "GOLD": return "bg-yellow-100 text-yellow-800";
      case "PLATINUM": return "bg-blue-100 text-blue-800";
      case "DIAMOND": return "bg-purple-100 text-purple-800";
      default: return "bg-orange-100 text-orange-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <CheckCircle className="w-4 h-4 mr-2" />
            Verify Profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Verify Alumni Profile</DialogTitle>
          <DialogDescription>
            Review and verify {alumni.user?.name || "this alumni"} profile
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alumni Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm text-gray-600">
                    {alumni.user?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-gray-600">
                    {alumni.user?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Alumni ID</Label>
                  <p className="text-sm text-gray-600 font-mono">
                    {alumni.alumniId || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Graduation Year</Label>
                  <p className="text-sm text-gray-600">
                    {alumni.graduationYear || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Department</Label>
                  <p className="text-sm text-gray-600">
                    {alumni.department || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Digital Signature</Label>
                  <p className="text-sm text-gray-600 font-mono">
                    {alumni.digitalSignature || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          {alumni.additionalInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Professional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Current Employer</Label>
                    <p className="text-sm text-gray-600">
                      {alumni.additionalInfo.currentEmployer || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Job Title</Label>
                    <p className="text-sm text-gray-600">
                      {alumni.additionalInfo.jobTitle || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Industry</Label>
                    <p className="text-sm text-gray-600">
                      {alumni.additionalInfo.industry || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <p className="text-sm text-gray-600">
                      {alumni.additionalInfo.location || "N/A"}
                    </p>
                  </div>
                  {alumni.additionalInfo.phoneNumber && (
                    <div>
                      <Label className="text-sm font-medium">Phone Number</Label>
                      <p className="text-sm text-gray-600">
                        {alumni.additionalInfo.phoneNumber}
                      </p>
                    </div>
                  )}
                  {alumni.additionalInfo.linkedinProfile && (
                    <div>
                      <Label className="text-sm font-medium">LinkedIn Profile</Label>
                      <a 
                        href={alumni.additionalInfo.linkedinProfile} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Profile
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Verification Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verification Decision</CardTitle>
              <CardDescription>
                Review the profile and make a verification decision
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="verify-true"
                      name="isVerified"
                      value="true"
                      checked={verificationData.isVerified === true}
                      onChange={(e) => setVerificationData(prev => ({ ...prev, isVerified: e.target.value === "true" }))}
                      className="text-blue-600"
                    />
                    <Label htmlFor="verify-true" className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Approve & Verify</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="verify-false"
                      name="isVerified"
                      value="false"
                      checked={verificationData.isVerified === false}
                      onChange={(e) => setVerificationData(prev => ({ ...prev, isVerified: e.target.value === "true" }))}
                      className="text-blue-600"
                    />
                    <Label htmlFor="verify-false" className="flex items-center space-x-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span>Reject</span>
                    </Label>
                  </div>
                </div>

                {verificationData.isVerified && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={verificationData.category} 
                        onValueChange={(value) => setVerificationData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BASIC">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4" />
                              <span>Basic</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="SILVER">
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4" />
                              <span>Silver</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="GOLD">
                            <div className="flex items-center space-x-2">
                              <Crown className="w-4 h-4" />
                              <span>Gold</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="PLATINUM">
                            <div className="flex items-center space-x-2">
                              <Crown className="w-4 h-4" />
                              <span>Platinum</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="DIAMOND">
                            <div className="flex items-center space-x-2">
                              <Crown className="w-4 h-4" />
                              <span>Diamond</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1">
                        Based on contribution potential and achievements
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="rank">Rank</Label>
                      <Select 
                        value={verificationData.rank} 
                        onValueChange={(value) => setVerificationData(prev => ({ ...prev, rank: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BRONZE">Bronze</SelectItem>
                          <SelectItem value="SILVER">Silver</SelectItem>
                          <SelectItem value="GOLD">Gold</SelectItem>
                          <SelectItem value="PLATINUM">Platinum</SelectItem>
                          <SelectItem value="DIAMOND">Diamond</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1">
                        Based on engagement and impact level
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="verificationNotes">Verification Notes</Label>
                  <Textarea
                    id="verificationNotes"
                    placeholder="Add notes about the verification decision..."
                    value={verificationData.verificationNotes}
                    onChange={(e) => setVerificationData(prev => ({ ...prev, verificationNotes: e.target.value }))}
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {verificationData.isVerified 
                      ? "Explain why this profile was approved and category/rank assigned"
                      : "Explain why this profile was rejected"
                    }
                  </p>
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
                    disabled={verifyAlumniProfileMutation.isPending}
                  >
                    {verifyAlumniProfileMutation.isPending ? "Verifying..." : "Submit Verification"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-sm font-medium text-gray-600 mb-1">Verification</div>
                  <Badge className={alumni.isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {alumni.isVerified ? "Verified" : "Pending"}
                  </Badge>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-sm font-medium text-gray-600 mb-1">Category</div>
                  <Badge className={getCategoryColor(alumni.category)}>
                    {getCategoryIcon(alumni.category)}
                    <span className="ml-1">{alumni.category}</span>
                  </Badge>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-sm font-medium text-gray-600 mb-1">Rank</div>
                  <Badge className={getRankColor(alumni.rank)}>
                    {alumni.rank}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
