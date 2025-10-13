import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { CategoryFilter } from "@/components/CategoryFilter";
import { FamilyCard } from "@/components/FamilyCard";
import { UploadFamilyModal } from "@/components/UploadFamilyModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PlumbingFamily {
  id: string;
  family_name: string;
  category: string;
  image_url: string;
  rvt_file_url: string;
  rating: number;
  user_id: string;
}

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [families, setFamilies] = useState<PlumbingFamily[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    fetchFamilies();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("plumbing_families_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "plumbing_families",
        },
        () => {
          fetchFamilies();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchFamilies = async () => {
    const { data, error } = await supabase
      .from("plumbing_families")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching families:", error);
      return;
    }

    setFamilies(data || []);
  };

  const handleGetStarted = () => {
    const familiesSection = document.getElementById("families-section");
    familiesSection?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteFamily = async (id: string) => {
    try {
      // Find the family to get file URLs
      const family = families.find((f) => f.id === id);
      if (!family) return;

      // Extract filenames from URLs
      const extractFileName = (url: string) => {
        const parts = url.split('/');
        return parts[parts.length - 1];
      };

      const imageFileName = extractFileName(family.image_url);
      const rvtFileName = extractFileName(family.rvt_file_url);

      // Delete image from storage
      const { error: imageError } = await supabase.storage
        .from("family-images")
        .remove([imageFileName]);

      if (imageError) {
        console.error("Error deleting image:", imageError);
      }

      // Delete RVT file from storage
      const { error: rvtError } = await supabase.storage
        .from("rvt-files")
        .remove([rvtFileName]);

      if (rvtError) {
        console.error("Error deleting RVT file:", rvtError);
      }

      // Delete database record
      const { error: dbError } = await supabase
        .from("plumbing_families")
        .delete()
        .eq("id", id);

      if (dbError) {
        toast({
          title: "Error",
          description: "Failed to delete family from database.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Family deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting family:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const filteredFamilies =
    selectedCategory === "all"
      ? families
      : families.filter((family) => family.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        onGetStarted={handleGetStarted}
        onUploadFamily={() => setIsUploadModalOpen(true)}
      />

      <div id="families-section">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFamilies.map((family) => (
              <FamilyCard
                key={family.id}
                id={family.id}
                familyName={family.family_name}
                category={family.category}
                imageUrl={family.image_url}
                rvtFileUrl={family.rvt_file_url}
                rating={family.rating}
                onDelete={handleDeleteFamily}
              />
            ))}
          </div>

          {filteredFamilies.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                No families found in this category. Upload one to get started!
              </p>
            </div>
          )}
        </div>
      </div>

      <UploadFamilyModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
      />
    </div>
  );
};

export default Index;
