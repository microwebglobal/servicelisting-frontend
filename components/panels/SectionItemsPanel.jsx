export const SectionItemsPanel = ({ section, items = [], onAction }) => {
    if (!section) {
      return (
        <div className="text-center text-sm text-gray-500">
          Select a section to view items
        </div>
      );
    }
  
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{section.name} Items</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAction('sectionItem', 'add')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
        
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.item_id}
              className="flex items-center justify-between p-2 rounded-lg border"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAction('sectionItem', 'edit', item)}
              >
                Edit
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };