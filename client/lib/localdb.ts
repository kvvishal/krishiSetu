type RecordType = "crop" | "soil" | "advisory" | "vendor";

export interface LocalRecord {
  id: string;
  type: RecordType;
  payload: any;
  updatedAt: number;
  pending?: boolean;
}

const DB_NAME = "krishsaathi";
const DB_VERSION = 1;
const STORE_RECORDS = "records";
const STORE_OUTBOX = "outbox";

async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_RECORDS))
        db.createObjectStore(STORE_RECORDS, { keyPath: "id" });
      if (!db.objectStoreNames.contains(STORE_OUTBOX))
        db.createObjectStore(STORE_OUTBOX, { keyPath: "id" });
    };
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
  });
}

export async function putRecord(
  rec: LocalRecord,
  enqueueForSync = true,
): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([STORE_RECORDS, STORE_OUTBOX], "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE_RECORDS).put({
      ...rec,
      pending: enqueueForSync ? true : rec.pending,
    });
    if (enqueueForSync) tx.objectStore(STORE_OUTBOX).put(rec);
  });
}

export async function getAllRecords(): Promise<LocalRecord[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_RECORDS, "readonly");
    const store = tx.objectStore(STORE_RECORDS);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as LocalRecord[]);
    req.onerror = () => reject(req.error);
  });
}

export async function drainOutbox(): Promise<LocalRecord[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_OUTBOX, "readonly");
    const store = tx.objectStore(STORE_OUTBOX);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as LocalRecord[]);
    req.onerror = () => reject(req.error);
  });
}

export async function clearOutboxByIds(ids: string[]): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_OUTBOX, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    const store = tx.objectStore(STORE_OUTBOX);
    ids.forEach((id) => store.delete(id));
  });
}

export async function markSynced(ids: string[]): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_RECORDS, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    const store = tx.objectStore(STORE_RECORDS);
    ids.forEach((id) => {
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const rec = getReq.result as LocalRecord | undefined;
        if (rec) store.put({ ...rec, pending: false });
      };
    });
  });
}

export async function backgroundSync(): Promise<{ synced: number }> {
  if (!navigator.onLine) return { synced: 0 };
  const outbox = await drainOutbox();
  if (outbox.length === 0) return { synced: 0 };
  const res = await fetch("/api/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ changes: outbox }),
  });
  if (!res.ok) throw new Error("Sync failed");
  const ids = outbox.map((r) => r.id);
  await clearOutboxByIds(ids);
  await markSynced(ids);
  return { synced: ids.length };
}

export function startAutoSync(intervalMs = 10000) {
  const run = () => backgroundSync().catch(() => {});
  window.addEventListener("online", run);
  setInterval(run, intervalMs);
}

export async function getRecordsByType(type: RecordType): Promise<LocalRecord[]> {
  const all = await getAllRecords();
  return all
    .filter((r) => r.type === type)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function deleteRecordsByIds(ids: string[]): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([STORE_RECORDS, STORE_OUTBOX], "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    const r = tx.objectStore(STORE_RECORDS);
    const o = tx.objectStore(STORE_OUTBOX);
    ids.forEach((id) => {
      r.delete(id);
      o.delete(id);
    });
  });
}

export async function clearType(type: RecordType): Promise<void> {
  const toDelete = (await getAllRecords()).filter((r) => r.type === type).map((r) => r.id);
  if (toDelete.length) await deleteRecordsByIds(toDelete);
}
