import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const PackagesPanel = ({ selectedType, packages = [], onAction }) => {
  if (!selectedType) {
    return (
      <div className="text-center text-sm text-gray-500">
        Select a service type to view packages
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => onAction('package', 'add')}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Package
      </Button>
      
      <div className="space-y-2">
        {packages.map((pkg) => (
          <Button
            key={pkg.package_id}
            variant="ghost"
            className="w-full justify-between"
            onClick={() => onAction('package', 'edit', pkg)}
          >
            <span>{pkg.name}</span>
            <span className="text-sm text-gray-500">
              ${pkg.price}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};