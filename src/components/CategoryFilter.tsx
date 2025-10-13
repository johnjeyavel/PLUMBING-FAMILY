import { Button } from "@/components/ui/button";

const categories = [
  { id: "all", label: "ALL FAMILY'S" },
  { id: "pipe fitting", label: "PIPE FITTINGS" },
  { id: "pipe accessories", label: "PIPE ACCESSORIES" },
  { id: "mechanical equipment", label: "MECHANICAL EQUIPMENT" },
  { id: "specialty equipment", label: "SPECIALTY EQUIPMENT" },
  { id: "structural stiffeners", label: "STRUCTURAL STIFFENERS" },
  { id: "others", label: "OTHERS" },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="bg-card border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-6 py-6">
        <h2 className="text-3xl font-bold mb-6">ALL FAMILY'S</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "border-muted hover:border-accent hover:text-accent"
              }
              onClick={() => onCategoryChange(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
