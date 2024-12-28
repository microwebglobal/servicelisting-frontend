export const PackageSectionsPanel = ({ 
    package: pkg, 
    sections = [], 
    selectedSection,
    onSelect,
    onAction 
  }) => {
    if (!pkg) {
      return (
        <div className="text-center text-sm text-gray-500">
          Select a package to view sections
        </div>
      );
    }
  
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{pkg.name} Sections</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAction('packageSection', 'add')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        </div>
        
        <div className="space-y-2">
          {sections.map((section) => (
            <Button
              key={section.section_id}
              variant={selectedSection?.section_id === section.section_id ? "secondary" : "ghost"}
              className="w-full justify-between"
              onClick={() => onSelect(section)}
            >
              <span>{section.name}</span>
              <span className="text-sm text-gray-500">
                {section.items_count} items
              </span>
            </Button>
          ))}
        </div>
      </div>
    );
  };