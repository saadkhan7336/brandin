/**
 * Compresses an image file before upload using native Canvas.
 * 
 * @param {File} file - The image file to compress
 * @param {string} type - 'avatar' or 'normal'
 * @returns {Promise<File>} - The compressed image file
 */
export const compressImage = (file, type = 'normal') => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      return resolve(file);
    }

    // Determine target max size in bytes
    const targetSizeMB = type === 'avatar' ? 0.5 : 1;
    const targetSizeBytes = targetSizeMB * 1024 * 1024;
    
    // If it's already smaller than target, just resolve
    if (file.size <= targetSizeBytes) {
      return resolve(file);
    }

    const maxWidthOrHeight = 1920;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Resize
        if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
          if (width > height) {
            height = Math.round((height * maxWidthOrHeight) / width);
            width = maxWidthOrHeight;
          } else {
            width = Math.round((width * maxWidthOrHeight) / height);
            height = maxWidthOrHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Binary search for acceptable quality
        let low = 0.0;
        let high = 1.0;
        let bestBlob = null;
        
        const tryQuality = (q) => {
          return new Promise((res) => {
            canvas.toBlob((blob) => {
              res(blob);
            }, file.type === 'image/png' ? 'image/png' : 'image/jpeg', q);
          });
        };

        const attemptCompression = async () => {
          // Fast path: try 0.7 first
          let blob = await tryQuality(0.7);
          if (blob.size <= targetSizeBytes) {
            bestBlob = blob;
          } else {
            // Binary search
            for (let i = 0; i < 5; i++) {
              const mid = (low + high) / 2;
              blob = await tryQuality(mid);
              if (blob.size <= targetSizeBytes) {
                bestBlob = blob;
                low = mid;
              } else {
                high = mid;
              }
            }
          }
          
          if (!bestBlob) {
            bestBlob = await tryQuality(0.1); // Fallback to lowest if needed
          }

          const newFile = new File([bestBlob], file.name, {
            type: bestBlob.type,
            lastModified: Date.now(),
          });

          console.log(`Compressed ${file.name} from ${(file.size / 1024 / 1024).toFixed(2)} MB to ${(newFile.size / 1024 / 1024).toFixed(2)} MB`);
          resolve(newFile);
        };

        attemptCompression();
      };
      
      img.onerror = () => {
        console.error('Error loading image for compression');
        resolve(file); // fallback
      };
    };
    
    reader.onerror = () => {
      console.error('Error reading file for compression');
      resolve(file); // fallback
    };
  });
};
