import type { FoobarDebug } from '@/types/app';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Pencil } from 'lucide-react';

interface FoobarDebugViewDialogProps {
  open: boolean;
  onClose: () => void;
  record: FoobarDebug | null;
  onEdit: (record: FoobarDebug) => void;
}

export function FoobarDebugViewDialog({ open, onClose, record, onEdit }: FoobarDebugViewDialogProps) {
  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View Foobar Debug</DialogTitle>
        </DialogHeader>
        <div className="flex justify-end">
          <Button size="sm" onClick={() => { onClose(); onEdit(record); }}>
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Textfeld</Label>
            <p className="text-sm">{record.fields.test_text ?? '—'}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Zahlenfeld</Label>
            <p className="text-sm">{record.fields.test_number ?? '—'}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Checkbox</Label>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              record.fields.test_checkbox ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              {record.fields.test_checkbox ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}