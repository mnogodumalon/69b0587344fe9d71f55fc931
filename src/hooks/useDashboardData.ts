import { useState, useEffect, useMemo, useCallback } from 'react';
import type { FoobarDebug } from '@/types/app';
import { LivingAppsService } from '@/services/livingAppsService';

export function useDashboardData() {
  const [foobarDebug, setFoobarDebug] = useState<FoobarDebug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAll = useCallback(async () => {
    setError(null);
    try {
      const [foobarDebugData] = await Promise.all([
        LivingAppsService.getFoobarDebug(),
      ]);
      setFoobarDebug(foobarDebugData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load data'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { foobarDebug, setFoobarDebug, loading, error, fetchAll };
}