"use client";
import React, { useEffect, useState } from "react";
import { useServiceManagement } from "../../src/hooks/useServiceManagement";
import { useDialog } from "../../src/hooks/useDialog";
import { CategoryPanel } from "@/components/panels/CategoryPanel";
import { SubCategoryPanel } from "@/components/panels/SubCategoryPanel";
import { ServiceTypePanel } from "@/components/panels/ServiceTypePanel";
import { ServiceTabs } from "@/components/ServiceTabs";
import { FormDialog } from "@/components/FormDialog";

const ServiceManagement = () => {
  const [activeTab, setActiveTab] = useState("services");
  const { data, handlers, fetchFunctions, isLoading } = useServiceManagement();

  const { dialogState, handleDialog } = useDialog();

  // Handle dialog actions
  const handleDialogAction = (type, mode, item = null) => {
    handleDialog.open(type, mode, item);
  };

  // Handle dialog close and refresh data
  const handleDialogClose = () => {
    const { type } = dialogState;
    handleDialog.close();

    console.log(dialogState);

    // Refresh relevant data based on dialog type
    if (type === "service" && data.selectedType) {
      fetchFunctions.services(data.selectedType.type_id);
    } else if (type === "serviceItem" && data.selectedService) {
      fetchFunctions.serviceItems(data.selectedService.service_id);
    } else if (type === "package" && data.selectedType) {
      fetchFunctions.packages(data.selectedType.type_id);
    } else if (dialogState.type === "subCategory" && data.selectedCategory) {
      fetchFunctions.subCategories(data.selectedCategory.category_id);
    } else if (dialogState.type === "category") {
      fetchFunctions.categories();
    } else if (dialogState.type === "serviceType" && data.selectedSubCategory) {
      fetchFunctions.serviceTypes(data.selectedSubCategory.sub_category_id);
    } else if (dialogState.type === "packageSection" && data.selectedPackage) {
      fetchFunctions.packageSections(data.selectedPackage.package_id);
    } else if (dialogState.type === "packageItem" && data.selectedSection) {
      fetchFunctions.sectionItems(data.selectedSection.section_id);
    }
  };

  // Prepare selected data for forms
  const selectedData = {
    typeId: data.selectedType?.type_id,
    serviceId: data.selectedService?.service_id,
    packageId: data.selectedPackage?.package_id,
    sectionId: data.selectedSection?.section_id,
    categoryId: data.selectedCategory?.category_id,
    subCategoryId: data.selectedSubCategory?.sub_category_id,
  };

  return (
    <div className="p-4">
      <div className="flex space-x-4">
        <CategoryPanel
          categories={data.categories}
          selectedCategory={data.selectedCategory}
          onSelect={handlers.category}
          onAction={handleDialogAction}
          fetchData={fetchFunctions.categories}
          isLoading={isLoading}
        />

        <SubCategoryPanel
          subCategories={data.subCategories}
          selectedSubCategory={data.selectedSubCategory}
          selectedCategory={data.selectedCategory}
          onSelect={handlers.subCategory}
          onAction={handleDialogAction}
          fetchData={() =>
            fetchFunctions.subCategories(data.selectedCategory?.category_id)
          }
          isLoading={isLoading}
        />

        <ServiceTypePanel
          serviceTypes={data.serviceTypes}
          selectedType={data.selectedType}
          selectedSubCategory={data.selectedSubCategory}
          onSelect={handlers.type}
          onAction={handleDialogAction}
          fetchData={() =>
            fetchFunctions.serviceTypes(
              data.selectedSubCategory?.sub_category_id
            )
          }
          isLoading={isLoading}
        />

        <ServiceTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedType={data.selectedType}
          services={data.services}
          packages={data.packages}
          selectedService={data.selectedService}
          selectedPackage={data.selectedPackage}
          serviceItems={data.serviceItems}
          packageSections={data.packageSections}
          selectedSection={data.selectedSection}
          sectionItems={data.sectionItems}
          onSelectService={handlers.service}
          onSelectPackage={handlers.package}
          onSelectSection={handlers.section}
          onAction={handleDialogAction}
          isLoading={isLoading}
        />
      </div>

      <FormDialog
        dialogState={dialogState}
        onClose={handleDialogClose}
        selectedData={selectedData}
        onAction={handleDialogAction}
      />
    </div>
  );
};

export default ServiceManagement;
