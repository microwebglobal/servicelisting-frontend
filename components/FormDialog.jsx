import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "./forms/CategoryForm";
import { SubCategoryForm } from "./forms/SubCategoryForm";
import { ServiceTypeForm } from "./forms/ServiceTypeForm";
import { ServiceForm } from "./forms/ServiceForm";
import { PackageForm } from "./forms/PackageForm";
import { ServiceItemForm } from "./forms/ServiceItemForm";
import { PackageSectionForm } from "./forms/PackageSectionForm";
import { PackageItemForm } from "./forms/PackageItemForm";

export const FormDialog = ({
  dialogState,
  onClose,
  selectedData,
  onAction,
}) => {
  const { type, mode, item } = dialogState;

  console.log(selectedData);

  const DIALOG_COMPONENTS = {
    category: CategoryForm,
    subCategory: SubCategoryForm,
    serviceType: ServiceTypeForm,
    service: ServiceForm,
    package: PackageForm,
    packageSection: PackageSectionForm,
    packageItem: PackageItemForm,
    serviceItem: ServiceItemForm,
  };

  const DIALOG_TITLES = {
    category: "Category",
    subCategory: "Sub Category",
    serviceType: "Service Type",
    service: "Service",
    package: "Package",
    packageSection: "Package Section",
    packageItem: "Package Item",
    serviceItem: "Service Item",
  };

  const FormComponent = DIALOG_COMPONENTS[type];

  if (!type || !mode) return null;

  const getFormProps = () => {
    const baseProps = {
      mode,
      onClose, // Changed from onSubmit to onClose to match PackageItemForm
      data: item,
    };

    // Ensure selectedData exists and has required properties
    const safeSelectedData = {
      packageId: selectedData?.packageId,
      sectionId: selectedData?.sectionId,
      serviceId: selectedData?.serviceId,
      categoryId: selectedData?.categoryId,
      subCategoryId: selectedData?.subCategoryId,
      typeId: selectedData?.typeId,
    };

    switch (type) {
      case "packageItem":
        return {
          ...baseProps,
          selectedData: {
            packageId: safeSelectedData.packageId,
            sectionId: item?.section_id || safeSelectedData.sectionId,
          },
        };
      case "serviceItem":
        return {
          ...baseProps,
          selectedData: {
            serviceId: safeSelectedData.serviceId,
          },
        };
      case "packageSection":
        return {
          ...baseProps,
          selectedData: {
            packageId: safeSelectedData.packageId,
          },
        };
      case "subCategory":
        return {
          ...baseProps,
          selectedData: {
            categoryId: safeSelectedData.categoryId,
          },
        };
      case "serviceType":
        return {
          ...baseProps,
          selectedData: {
            subCategoryId: safeSelectedData.subCategoryId,
          },
        };
      case "service":
        return {
          ...baseProps,
          selectedData: {
            typeId: safeSelectedData.typeId,
          },
        };
      case "package":
        return {
          ...baseProps,
          selectedData: {
            typeId: safeSelectedData.typeId,
          },
        };
      default:
        return baseProps;
    }
  };

  return (
    <Dialog open={!!type} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "add"
              ? `Add ${DIALOG_TITLES[type]}`
              : `Edit ${DIALOG_TITLES[type]}`}
          </DialogTitle>
        </DialogHeader>
        {FormComponent && <FormComponent {...getFormProps()} />}
      </DialogContent>
    </Dialog>
  );
};
