import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { CategoryForm } from './forms/CategoryForm';
import { SubCategoryForm } from './forms/SubCategoryForm';
import { ServiceTypeForm } from './forms/ServiceTypeForm';
import { ServiceForm } from './forms/ServiceForm';
import { PackageForm } from './forms/PackageForm';
import { ServiceItemForm } from './forms/ServiceItemForm';

export const FormDialog = ({
    dialogState,
    onClose,
    selectedData,
    onAction
}) => {
    const { type, mode, item } = dialogState;
    
    const DIALOG_COMPONENTS = {
        category: CategoryForm,
        subCategory: SubCategoryForm,
        serviceType: ServiceTypeForm,
        service: ServiceForm,
        package: PackageForm,
        serviceItem: ServiceItemForm,
    };

    const DIALOG_TITLES = {
        category: 'Category',
        subCategory: 'Sub Category',
        serviceType: 'Service Type',
        service: 'Service',
        package: 'Package',
        serviceItem: 'Service Item', 
    };

    const FormComponent = DIALOG_COMPONENTS[type];

    if (!type || !mode) return null;

    return (
        <Dialog open={!!type} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'add' ? `Add ${DIALOG_TITLES[type]}` : `Edit ${DIALOG_TITLES[type]}`}
                    </DialogTitle>
                </DialogHeader>
                {FormComponent && (
                    <FormComponent
                        mode={mode}
                        data={item}
                        selectedData={selectedData}
                        onClose={onClose}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};