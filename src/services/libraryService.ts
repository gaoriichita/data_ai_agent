export interface LibraryFile {
  id: string;
  name: string;
  type: 'image' | 'document' | 'other';
  size: number; // in bytes
  updatedAt: number;
  // We can store a tiny base64 thumbnail if it's an image, or just mock it.
  // For safety and performance, we'll avoid storing large data here.
}

const STORAGE_KEY = 'appforge_library_files_v2';

export const getLibraryFiles = (): LibraryFile[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    // Return empty by default, no mock data
    return [];
  } catch (e) {
    console.error('Failed to load library files', e);
    return [];
  }
};

export const addLibraryFile = (file: LibraryFile) => {
  try {
    const files = getLibraryFiles();
    files.unshift(file);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  } catch (e) {
    console.error('Failed to save library file', e);
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatFileDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${date.getDate()} ${months[date.getMonth()]}`;
};
