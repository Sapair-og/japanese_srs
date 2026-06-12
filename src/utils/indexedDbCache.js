const DB_NAME = 'JpVocabDB';
const STORE_NAME = 'vocab_store';
const KEY_NAME = 'cached_list';

function getDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export async function setCachedVocab(vocabList) {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(vocabList, KEY_NAME);
      request.onsuccess = () => resolve(true);
      request.onerror = (event) => reject(event.target.error);
    });
  } catch (err) {
    console.error('Failed to save to IndexedDB:', err);
    return false;
  }
}

export async function getCachedVocab() {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(KEY_NAME);
      request.onsuccess = (event) => resolve(event.target.result || null);
      request.onerror = (event) => reject(event.target.error);
    });
  } catch (err) {
    console.error('Failed to read from IndexedDB:', err);
    return null;
  }
}
