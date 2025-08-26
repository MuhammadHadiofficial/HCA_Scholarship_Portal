"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Plus } from "lucide-react";
import { useAddApplicationNote } from "@/lib/hooks/use-review-workflow";

interface QuickNoteDialogProps {
  applicationId: string;
  authorId: string;
  trigger?: React.ReactNode;
}

export default function QuickNoteDialog({ 
  applicationId, 
  authorId, 
  trigger 
}: QuickNoteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [noteData, setNoteData] = useState({
    content: "",
    isInternal: false
  });

  const addNoteMutation = useAddApplicationNote();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("applicationId", applicationId);
    formData.append("content", noteData.content);
    formData.append("isInternal", noteData.isInternal.toString());

    try {
      const result = await addNoteMutation.mutateAsync({ authorId, formData });
      if (result.success) {
        setNoteData({ content: "", isInternal: false });
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Add Note
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
          <DialogDescription>
            Add a note or comment about this application
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              disabled={addNoteMutation.isPending}
            >
              {addNoteMutation.isPending ? "Adding..." : "Add Note"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
