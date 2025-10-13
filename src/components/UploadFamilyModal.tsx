import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UploadFamilyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UploadFamilyModal = ({
  open,
  onOpenChange,
}: UploadFamilyModalProps) => {
  const [familyName, setFamilyName] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);
  const [userId, setUserId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [rvtFile, setRvtFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!familyName || !category || !imageFile || !rvtFile || !userId) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate user ID
    if (userId !== "John@2000") {
      toast.error("User ID not correct");
      return;
    }

    setIsUploading(true);

    try {
      // Upload image
      const imageFileName = `${Date.now()}-${imageFile.name}`;
      const { data: imageData, error: imageError } = await supabase.storage
        .from("family-images")
        .upload(imageFileName, imageFile);

      if (imageError) throw imageError;

      // Upload RVT file
      const rvtFileName = `${Date.now()}-${rvtFile.name}`;
      const { data: rvtData, error: rvtError } = await supabase.storage
        .from("rvt-files")
        .upload(rvtFileName, rvtFile);

      if (rvtError) throw rvtError;

      // Get public URLs
      const { data: imageUrlData } = supabase.storage
        .from("family-images")
        .getPublicUrl(imageFileName);

      const { data: rvtUrlData } = supabase.storage
        .from("rvt-files")
        .getPublicUrl(rvtFileName);

      // Insert into database
      const { error: insertError } = await supabase
        .from("plumbing_families")
        .insert({
          family_name: familyName,
          category: category,
          image_url: imageUrlData.publicUrl,
          rvt_file_url: rvtUrlData.publicUrl,
          rating: rating,
          user_id: userId,
        });

      if (insertError) throw insertError;

      toast.success("Family uploaded successfully!");
      
      // Reset form
      setFamilyName("");
      setCategory("");
      setRating(0);
      setUserId("");
      setImageFile(null);
      setRvtFile(null);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload family");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Family</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="image">Upload Image *</Label>
            <div className="mt-2">
              <Input
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="rvt">Upload RVF File *</Label>
            <div className="mt-2">
              <Input
                id="rvt"
                type="file"
                onChange={(e) => setRvtFile(e.target.files?.[0] || null)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="category">Select Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pipe fitting">Pipe Fitting</SelectItem>
                <SelectItem value="pipe accessories">Pipe Accessories</SelectItem>
                <SelectItem value="mechanical equipment">Mechanical Equipment</SelectItem>
                <SelectItem value="specialty equipment">Specialty Equipment</SelectItem>
                <SelectItem value="structural stiffeners">Structural Stiffeners</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name">Family Name *</Label>
            <Input
              id="name"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Enter family name"
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label>Rating (max 5 stars) *</Label>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 cursor-pointer transition-colors ${
                    star <= rating
                      ? "fill-accent text-accent"
                      : "text-muted hover:text-accent"
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="userId">User ID *</Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID"
              className="mt-2"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isUploading}
          >
            {isUploading ? (
              "Uploading..."
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Submit
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
