/**
 * Utility function to append Cloudinary transformation parameters to image URLs.
 * Ensures that images are optimally compressed and sized based on their context.
 *
 * @param {string} url - The original Cloudinary URL (or any URL, though only Cloudinary ones are transformed)
 * @param {string} type - The context of the image: 'avatar', 'chat', 'profile', 'portfolioThumbnail', 'portfolioFull', or 'fallback'
 * @returns {string} - The optimized URL
 */
export const getOptimizedImage = (url, type = 'fallback') => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return url;
  }

  let transformations = '';

  switch (type) {
    case 'avatar':
      transformations = 'w_150,h_150,c_fill,f_auto,q_auto';
      break;
    case 'chat':
      transformations = 'w_50,h_50,c_fill,f_auto,q_auto';
      break;
    case 'profile':
      transformations = 'w_300,h_300,c_fill,f_auto,q_auto';
      break;
    case 'cover':
      transformations = 'w_1200,c_scale,f_auto,q_auto';
      break;
    case 'portfolioThumbnail':
      transformations = 'w_500,f_auto,q_auto';
      break;
    case 'portfolioFull':
      transformations = 'w_1200,f_auto,q_auto';
      break;
    case 'fallback':
    default:
      transformations = 'f_auto,q_auto';
      break;
  }

  // Cloudinary URLs typically look like: https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/folder/image.jpg
  // We need to insert the transformations after '/upload/'
  return url.replace('/upload/', `/upload/${transformations}/`);
};
