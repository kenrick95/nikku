export type DroppedFile = {
  file: File;
  relativePath: string;
};

export type DroppedSelection = {
  files: DroppedFile[];
  folderName: string | null;
};

type Handle = {
  kind: 'file' | 'directory';
  name: string;
  getFile?: () => Promise<File>;
  values?: () => AsyncIterable<Handle>;
};

type Entry = {
  isFile: boolean;
  isDirectory: boolean;
  name: string;
  file?: (success: (file: File) => void, failure: (error: DOMException) => void) => void;
  createReader?: () => {
    readEntries: (success: (entries: Entry[]) => void, failure: (error: DOMException) => void) => void;
  };
};

type DropCandidate = {
  handle: Promise<Handle | null> | null;
  entry: Entry | null;
  file: File | null;
};

export async function readDroppedItems(items: DataTransferItemList): Promise<DroppedSelection> {
  // Both entry APIs must be called during the drop event while its data store is readable.
  const candidates = Array.from(items)
    .filter((item) => item.kind === 'file')
    .map((item): DropCandidate => {
      const extendedItem = item as DataTransferItem & {
        getAsFileSystemHandle?: () => Promise<Handle | null>;
        getAsEntry?: () => Entry | null;
        webkitGetAsEntry?: () => Entry | null;
      };
      return {
        handle: extendedItem.getAsFileSystemHandle?.() ?? null,
        entry: extendedItem.getAsEntry?.() ?? extendedItem.webkitGetAsEntry?.() ?? null,
        file: item.getAsFile(),
      };
    });

  const files: DroppedFile[] = [];
  const folderNames: string[] = [];
  for (const candidate of candidates) {
    let handled = false;
    if (candidate.handle) {
      try {
        const handle = await candidate.handle;
        if (handle) {
          const handleFiles: DroppedFile[] = [];
          await collectHandle(handle, handle.name, handleFiles);
          files.push(...handleFiles);
          if (handle.kind === 'directory') folderNames.push(handle.name);
          handled = true;
        }
      } catch {
        // Fall through to the entry API captured during the same drop event.
      }
    }
    if (!handled && candidate.entry) {
      if (candidate.entry.isDirectory) folderNames.push(candidate.entry.name);
      await collectEntry(candidate.entry, candidate.entry.name, files);
      handled = true;
    }
    if (!handled && candidate.file) {
      files.push({ file: candidate.file, relativePath: candidate.file.name });
    }
  }

  return {
    files,
    folderName: folderNames.length === 1 ? folderNames[0] : folderNames.length > 1 ? 'Dropped folders' : null,
  };
}

async function collectHandle(handle: Handle, path: string, files: DroppedFile[]) {
  if (handle.kind === 'file') {
    if (!handle.getFile) throw new Error('Could not read dropped file');
    files.push({ file: await handle.getFile(), relativePath: path });
    return;
  }
  if (!handle.values) throw new Error('Could not read dropped folder');
  for await (const child of handle.values()) {
    await collectHandle(child, `${path}/${child.name}`, files);
  }
}

async function collectEntry(entry: Entry, path: string, files: DroppedFile[]) {
  if (entry.isFile) {
    if (!entry.file) throw new Error('Could not read dropped file');
    const file = await new Promise<File>((resolve, reject) => entry.file!(resolve, reject));
    files.push({ file, relativePath: path });
    return;
  }
  if (!entry.isDirectory || !entry.createReader) return;
  const reader = entry.createReader();
  while (true) {
    const entries = await new Promise<Entry[]>((resolve, reject) => reader.readEntries(resolve, reject));
    if (!entries.length) return;
    for (const child of entries) {
      await collectEntry(child, `${path}/${child.name}`, files);
    }
  }
}
