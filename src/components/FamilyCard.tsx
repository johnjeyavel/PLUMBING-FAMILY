import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface FamilyCardProps {
  id: string;
  familyName: string;
  category: string;
  imageUrl: string;
  rvtFileUrl: string;
  rating: number;
  onDelete?: (id: string) => void;
}

export const FamilyCard = ({
  id,
  familyName,
  category,
  imageUrl,
  rvtFileUrl,
  rating,
  onDelete,
}: FamilyCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [password, setPassword] = useState("");

  const handleView = () => {
    window.open(imageUrl, "_blank");
  };

  const handleDownload = () => {
    window.open(rvtFileUrl, "_blank");
  };

  const handleDeleteClick = () => {
    setPassword("");
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (password !== "John1234#") {
      toast({
        title: "Error",
        description: "Enter correct password",
        variant: "destructive",
      });
      return;
    }
    onDelete?.(id);
    setShowDeleteDialog(false);
    setPassword("");
  };

  return (
    <>
      <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-border hover:border-accent bg-card">
        <div className="aspect-square overflow-hidden bg-muted relative">
          <img
            src={imageUrl}
            alt={familyName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={handleDeleteClick}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      <div className="p-4 space-y-3">
        <Badge variant="secondary" className="uppercase text-xs">
          {category}
        </Badge>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? "fill-accent text-accent"
                    : "text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
        </div>
        <h3 className="text-lg font-bold uppercase">{familyName}</h3>
        <p className="text-xs text-muted-foreground">READY-TO-USE</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            onClick={handleView}
          >
            <Eye className="w-4 h-4 mr-2" />
            VIEW
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            DOWNLOAD
          </Button>
        </div>
      </div>
    </Card>

    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Family</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{familyName}"? This action cannot be undone and will delete all associated files.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Label htmlFor="delete-password" className="text-sm font-medium">
            Enter Password to Confirm
          </Label>
          <Input
            id="delete-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="mt-2"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setPassword("")}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
  );
};
