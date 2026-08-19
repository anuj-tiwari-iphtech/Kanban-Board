export const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];
  

  export const MAX_FILE_SIZE = 500 * 1024; 
  export const MAX_FILES = 3;
  export const MAX_TOTAL_SIZE = 2 * 1024 * 1024; 
  
  export function validateFiles(newFiles, existingFiles = []) {
    const errors = [];
  
    if (existingFiles.length + newFiles.length > MAX_FILES) {
      errors.push(`You can attach up to ${MAX_FILES} files.`);
      return { valid: false, accepted: [], errors };
    }
  
    let totalSize = existingFiles.reduce((sum, f) => sum + f.size, 0);
    const accepted = [];
  
    for (const file of newFiles) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        errors.push(`${file.name}: unsupported file type.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: exceeds ${MAX_FILE_SIZE / 1024}KB limit.`);
        continue;
      }
      if (totalSize + file.size > MAX_TOTAL_SIZE) {
        errors.push(`${file.name}: would exceed total ${MAX_TOTAL_SIZE / (1024 * 1024)}MB limit.`);
        continue;
      }
      totalSize += file.size;
      accepted.push(file);
    }
  
    return { valid: errors.length === 0, accepted, errors };
  }