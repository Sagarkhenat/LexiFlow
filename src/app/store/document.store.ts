import { signal, computed } from '@angular/core';

export interface ScanResult {
  id: string;
  timestamp: number;
  category: 'Receipt' | 'BusinessCard' | 'Prescription' | 'Unknown';
  rawText: string;
  structuredData: any;
  confidence: number;
  imageUrl?: string;
}

export interface DocumentState {
  documents: ScanResult[];
  isScanning: boolean;
  isProcessing: boolean;
  error: string | null;
}

// Initial State
const initialState: DocumentState = {
  documents: [],
  isScanning: false,
  isProcessing: false,
  error: null,
};

// Define the selectors outside the main object to avoid circular references
const _state = signal<DocumentState>(initialState);

const documents = computed(() => _state().documents);
const isProcessing = computed(() => _state().isProcessing);
const error = computed(() => _state().error);
const recentScans = computed(() =>
  [..._state().documents].sort((a, b) => b.timestamp - a.timestamp)
);

/**
 * LexiFlow Document Store
 * Manages the global state of scanned documents and AI processing status.
 */
export const DocumentStore = {
  // Expose the signals
  documents,
  isProcessing,
  error,
  recentScans,

  // Actions
  setScanning(status: boolean) {
    _state.update(state => ({ ...state, isScanning: status }));
  },

  setProcessing(status: boolean) {
    _state.update(state => ({ ...state, isProcessing: status, error: null }));
  },

  addDocument(doc: ScanResult) {
    _state.update(state => ({
      ...state,
      documents: [...state.documents, doc],
      isProcessing: false
    }));
  },

  setError(message: string | null) {
    _state.update(state => ({
      ...state,
      error: message,
      isProcessing: false,
      isScanning: false
    }));
  }
};
