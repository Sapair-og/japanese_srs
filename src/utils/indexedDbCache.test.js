import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getCachedVocab, setCachedVocab } from './indexedDbCache';

describe('IndexedDB Cache tests', () => {
  let mockDb;
  let mockTransaction;
  let mockStore;
  let mockRequest;

  beforeEach(() => {
    mockRequest = {
      onsuccess: null,
      onerror: null,
      onupgradeneeded: null,
      result: null,
      error: null
    };

    mockStore = {
      put: vi.fn(() => mockRequest),
      get: vi.fn(() => mockRequest)
    };

    mockTransaction = {
      objectStore: vi.fn(() => mockStore)
    };

    mockDb = {
      objectStoreNames: {
        contains: vi.fn(() => true)
      },
      transaction: vi.fn(() => mockTransaction)
    };

    global.indexedDB = {
      open: vi.fn(() => {
        const openRequest = {
          onsuccess: null,
          onerror: null,
          onupgradeneeded: null
        };
        // Trigger success in the next tick
        setTimeout(() => {
          if (openRequest.onsuccess) {
            openRequest.onsuccess({ target: { result: mockDb } });
          }
        }, 0);
        return openRequest;
      })
    };
  });

  afterEach(() => {
    delete global.indexedDB;
  });

  it('should set cached vocab successfully', async () => {
    const mockVocab = [{ id: 1, english: 'test' }];
    
    // Setup request success trigger
    mockStore.put.mockImplementation(() => {
      const putRequest = {};
      setTimeout(() => {
        if (putRequest.onsuccess) putRequest.onsuccess();
      }, 0);
      return putRequest;
    });

    const success = await setCachedVocab(mockVocab);
    expect(success).toBe(true);
    expect(mockDb.transaction).toHaveBeenCalledWith('vocab_store', 'readwrite');
    expect(mockStore.put).toHaveBeenCalledWith(mockVocab, 'cached_list');
  });

  it('should get cached vocab successfully', async () => {
    const mockVocab = [{ id: 1, english: 'test' }];

    mockStore.get.mockImplementation(() => {
      const getRequest = {};
      setTimeout(() => {
        if (getRequest.onsuccess) {
          getRequest.onsuccess({ target: { result: mockVocab } });
        }
      }, 0);
      return getRequest;
    });

    const cached = await getCachedVocab();
    expect(cached).toEqual(mockVocab);
    expect(mockDb.transaction).toHaveBeenCalledWith('vocab_store', 'readonly');
    expect(mockStore.get).toHaveBeenCalledWith('cached_list');
  });

  it('should handle error if indexedDB is not supported', async () => {
    delete global.indexedDB;
    const result = await getCachedVocab();
    expect(result).toBeNull();
  });
});
