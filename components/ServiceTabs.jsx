import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServicesPanel } from "@/components/panels/ServicesPanel";
import { PackagesPanel } from "@/components/panels/PackagesPanel";
import { ServiceItemsPanel } from "@/components/panels/ServiceItemsPanel";
import { PackageSectionsPanel } from "@/components/panels/PackageSectionsPanel";
import { SectionItemsPanel } from "@/components/panels/SectionItemsPanel";
export const ServiceTabs = ({
  activeTab,
  setActiveTab,
  selectedType,
  services,
  packages,
  selectedService,
  selectedPackage,
  serviceItems,
  packageSections,
  selectedSection,
  sectionItems,
  onSelectService,
  onSelectPackage,
  onSelectSection,
  onAction,
  onClick,
}) => (
  <div className="w-1/2 border rounded-lg p-4">
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full mb-4">
        <TabsTrigger value="services" className="flex-1">
          Services
        </TabsTrigger>
        <TabsTrigger value="packages" className="flex-1">
          Packages
        </TabsTrigger>
      </TabsList>

      <TabsContent value="services" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <ServicesPanel
            selectedType={selectedType}
            services={services}
            selectedService={selectedService}
            onSelect={onSelectService}
            onAction={onAction}
          />
          <ServiceItemsPanel
            service={selectedService}
            items={serviceItems}
            onAction={onAction}
            onClick={onClick}
          />
        </div>
      </TabsContent>

      <TabsContent value="packages" className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <PackagesPanel
            selectedType={selectedType}
            packages={packages}
            selectedPackage={selectedPackage}
            onSelect={onSelectPackage}
            onAction={onAction}
          />
          <PackageSectionsPanel
            package={selectedPackage}
            sections={packageSections}
            selectedSection={selectedSection}
            onSelect={onSelectSection}
            onAction={onAction}
          />
          <SectionItemsPanel
            section={selectedSection}
            items={sectionItems}
            onAction={onAction}
          />
        </div>
      </TabsContent>
    </Tabs>
  </div>
);
