import { Injectable, signal, computed } from '@angular/core';

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

const initialState: DocumentState = {
  documents: [],
  isScanning: false,
  isProcessing: false,
  error: null,
};

@Injectable({
  providedIn: 'root' // [cite: 41, 65]
})
export class DocumentStore {
  // 1. Private internal state
  private _state = signal<DocumentState>(initialState);

  // 2. Public Read-only Selectors (Reactive)
  public readonly documents = computed(() => this._state().documents);
  public readonly isScanning = computed(() => this._state().isScanning);
  public readonly isProcessing = computed(() => this._state().isProcessing);
  public readonly error = computed(() => this._state().error);

  public readonly recentScans = computed(() =>
    [...this._state().documents].sort((a, b) => b.timestamp - a.timestamp)
  );

  // 3. Methods to update state (Actions)
  setScanning(status: boolean) {
    this._state.update(state => ({ ...state, isScanning: status })); // [cite: 47]
  }

  setProcessing(status: boolean) {
    this._state.update(state => ({ ...state, isProcessing: status, error: null })); // [cite: 44]
  }

  addDocument(doc: ScanResult) {
    this._state.update(state => ({
      ...state,
      documents: [...state.documents, doc],
      isProcessing: false
    }));
  }

  setError(message: string | null) {
    this._state.update(state => ({
      ...state,
      error: message,
      isProcessing: false,
      isScanning: false
    })); // [cite: 44, 70]
  }
}
