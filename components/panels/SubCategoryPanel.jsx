import { BasePanel } from './BasePanel';
import { Button } from '@/components/ui/button';

export const SubCategoryPanel = ({
  subCategories,
  selectedSubCategory,
  selectedCategory,
  onSelect,
  onAction,
  fetchData
}) => {
  return (
    <BasePanel
      title="Sub Categories"
      onAdd={() => onAction('subCategory', 'add')}
      disabled={!selectedCategory}
    >
      <div className="space-y-2">
        {subCategories.map((subCategory) => (
          <Button
            key={subCategory.sub_category_id}
            variant={selectedSubCategory?.sub_category_id === subCategory.sub_category_id ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSelect(subCategory)}
          >
            {subCategory.name}
          </Button>
        ))}
      </div>
    </BasePanel>
  );
};
