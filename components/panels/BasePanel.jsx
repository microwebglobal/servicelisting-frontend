import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const BasePanel = ({ title, onAdd, children, disabled = false }) => (
  <Card className="w-1/4">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Button
        variant="ghost"
        size="sm"
        onClick={onAdd}
        disabled={disabled}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);