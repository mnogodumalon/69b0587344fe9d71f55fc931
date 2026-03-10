// AUTOMATICALLY GENERATED TYPES - DO NOT EDIT

export type LookupValue = { key: string; label: string };
export type GeoLocation = { lat: number; long: number; info?: string };

export interface FoobarDebug {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    test_text?: string;
    test_number?: number;
    test_checkbox?: boolean;
  };
}

export const APP_IDS = {
  FOOBAR_DEBUG: '69b05862c2eb684e5bd1b8ae',
} as const;


export const LOOKUP_OPTIONS: Record<string, Record<string, {key: string, label: string}[]>> = {};

export const FIELD_TYPES: Record<string, Record<string, string>> = {
  'foobar_debug': {
    'test_text': 'string/text',
    'test_number': 'number',
    'test_checkbox': 'bool',
  },
};

type StripLookup<T> = {
  [K in keyof T]: T[K] extends LookupValue | undefined ? string | undefined
    : T[K] extends LookupValue[] | undefined ? string[] | undefined
    : T[K];
};

// Helper Types for creating new records (lookup fields as plain strings for API)
export type CreateFoobarDebug = StripLookup<FoobarDebug['fields']>;