import { BasePanel } from './BasePanel';
import { Button } from '@/components/ui/button';

export const ServiceTypePanel = ({
  serviceTypes,
  selectedType,
  selectedSubCategory,
  onSelect,
  onAction,
  fetchData
}) => {
  return (
    <BasePanel
      title="Service Types"
      onAdd={() => onAction('serviceType', 'add')}
      disabled={!selectedSubCategory}
    >
      <div className="space-y-2">
        {serviceTypes.map((type) => (
          <Button
            key={type.type_id}
            variant={selectedType?.type_id === type.type_id ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSelect(type)}
          >
            {type.name}
          </Button>
        ))}
      </div>
    </BasePanel>
  );
};
