import { BasePanel } from './BasePanel';
import { Button } from '@/components/ui/button';

export const CategoryPanel = ({
  categories,
  selectedCategory,
  onSelect,
  onAction,
  fetchData
}) => {
  return (
    <BasePanel
      title="Categories"
      onAdd={() => onAction('category', 'add')}
    >
      <div className="space-y-2">
        {categories.map((category) => (
          <Button
            key={category.category_id}
            variant={selectedCategory?.category_id === category.category_id ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSelect(category)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </BasePanel>
  );
};