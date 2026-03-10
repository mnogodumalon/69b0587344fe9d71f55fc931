import { useState, useMemo, useCallback } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import type { FoobarDebug } from '@/types/app';
import { LivingAppsService } from '@/services/livingAppsService';
import { AI_PHOTO_SCAN, AI_PHOTO_LOCATION } from '@/config/ai-features';
import { FoobarDebugDialog } from '@/components/dialogs/FoobarDebugDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Plus, Pencil, Trash2, Search, Hash, Type, ToggleLeft, Database, CheckSquare, XSquare } from 'lucide-react';

export default function DashboardOverview() {
  const { foobarDebug, loading, error, fetchAll } = useDashboardData();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<FoobarDebug | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FoobarDebug | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return foobarDebug;
    const q = search.toLowerCase();
    return foobarDebug.filter(r =>
      (r.fields.test_text ?? '').toLowerCase().includes(q) ||
      String(r.fields.test_number ?? '').includes(q)
    );
  }, [foobarDebug, search]);

  const stats = useMemo(() => ({
    total: foobarDebug.length,
    withText: foobarDebug.filter(r => r.fields.test_text).length,
    checked: foobarDebug.filter(r => r.fields.test_checkbox === true).length,
    withNumber: foobarDebug.filter(r => r.fields.test_number != null).length,
  }), [foobarDebug]);

  const handleCreate = useCallback(async (fields: FoobarDebug['fields']) => {
    await LivingAppsService.createFoobarDebugEntry(fields);
    fetchAll();
  }, [fetchAll]);

  const handleEdit = useCallback(async (fields: FoobarDebug['fields']) => {
    if (!editRecord) return;
    await LivingAppsService.updateFoobarDebugEntry(editRecord.record_id, fields);
    fetchAll();
    setEditRecord(null);
  }, [editRecord, fetchAll]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await LivingAppsService.deleteFoobarDebugEntry(deleteTarget.record_id);
    fetchAll();
    setDeleteTarget(null);
  }, [deleteTarget, fetchAll]);

  if (loading) return <DashboardSkeleton />;
  if (error) return <DashboardError error={error} onRetry={fetchAll} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Debug Records</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage and inspect test data entries</p>
        </div>
        <Button onClick={() => { setEditRecord(null); setDialogOpen(true); }} className="shrink-0 gap-2">
          <Plus size={16} /> New Entry
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Total Records"
          value={String(stats.total)}
          description="All entries"
          icon={<Database size={18} className="text-muted-foreground" />}
        />
        <StatCard
          title="With Text"
          value={String(stats.withText)}
          description="Text field set"
          icon={<Type size={18} className="text-muted-foreground" />}
        />
        <StatCard
          title="With Number"
          value={String(stats.withNumber)}
          description="Number field set"
          icon={<Hash size={18} className="text-muted-foreground" />}
        />
        <StatCard
          title="Checked"
          value={String(stats.checked)}
          description="Checkbox = yes"
          icon={<ToggleLeft size={18} className="text-muted-foreground" />}
        />
      </div>

      {/* Main workspace */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b bg-muted/30">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by text or number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-8 text-sm bg-background"
            />
          </div>
          <span className="text-xs text-muted-foreground ml-auto">
            {filtered.length} of {foobarDebug.length} records
          </span>
        </div>

        {/* Records list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <Database size={36} className="opacity-20" />
            <p className="text-sm font-medium">
              {search ? 'No records match your search' : 'No debug records yet'}
            </p>
            {!search && (
              <Button variant="outline" size="sm" onClick={() => { setEditRecord(null); setDialogOpen(true); }} className="gap-1.5">
                <Plus size={14} /> Create first entry
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map(record => (
              <div
                key={record.record_id}
                className="flex items-center gap-4 px-4 py-3.5 hover:bg-muted/30 transition-colors group"
              >
                {/* Checkbox badge */}
                <div className="shrink-0">
                  {record.fields.test_checkbox ? (
                    <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10">
                      <CheckSquare size={16} className="text-primary" />
                    </span>
                  ) : (
                    <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-muted">
                      <XSquare size={16} className="text-muted-foreground opacity-40" />
                    </span>
                  )}
                </div>

                {/* Text field */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {record.fields.test_text || <span className="text-muted-foreground italic font-normal">No text</span>}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                    ID: {record.record_id.slice(-8)}
                  </p>
                </div>

                {/* Number field */}
                <div className="shrink-0 text-right">
                  {record.fields.test_number != null ? (
                    <Badge variant="secondary" className="font-mono text-xs">
                      {record.fields.test_number}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>

                {/* Actions */}
                <div className="shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => { setEditRecord(record); setDialogOpen(true); }}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(record)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <FoobarDebugDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditRecord(null); }}
        onSubmit={editRecord ? handleEdit : handleCreate}
        defaultValues={editRecord?.fields}
        enablePhotoScan={AI_PHOTO_SCAN['FoobarDebug']}
        enablePhotoLocation={AI_PHOTO_LOCATION['FoobarDebug']}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Entry"
        description={`Delete "${deleteTarget?.fields.test_text || 'this record'}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-36" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
      </div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}

function DashboardError({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center">
        <AlertCircle size={22} className="text-destructive" />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-foreground mb-1">Error Loading</h3>
        <p className="text-sm text-muted-foreground max-w-xs">{error.message}</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>Try Again</Button>
    </div>
  );
}
