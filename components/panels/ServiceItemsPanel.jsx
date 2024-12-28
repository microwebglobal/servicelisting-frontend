export const ServiceItemsPanel = ({ service, items = [], onAction }) => {
    if (!service) {
      return (
        <div className="text-center text-sm text-gray-500">
          Select a service to view items
        </div>
      );
    }
  
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{service.name}</h3>
            <p className="text-sm text-gray-500">${service.price}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAction('serviceItem', 'add', service)}
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
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onAction('serviceItem', 'edit', item)}>
                    Edit Item
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onAction('serviceItem', 'delete', item)}
                    className="text-red-600"
                  >
                    Delete Item
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>
    );
  };
  