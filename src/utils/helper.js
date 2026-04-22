import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Shared verification logic for Brands and Influencers
 * @param {Object} user - The user object containing verifiedPlatforms
 * @param {Object} roleProfile - The Brand or Influencer profile containing socialMedia
 * @returns {Boolean} - Whether the profile qualifies for a verified tick
 */
export function checkVerification(user, roleProfile) {
  if (!user || !roleProfile || !user.isVerified) return false;

  let rawLinks = {};
  
  // Format 1: socialMedia Map/Object (Profile View)
  if (roleProfile.socialMedia && (roleProfile.socialMedia instanceof Map || Object.keys(roleProfile.socialMedia).length > 0)) {
    rawLinks = (roleProfile.socialMedia instanceof Map) 
      ? Object.fromEntries(roleProfile.socialMedia) 
      : roleProfile.socialMedia;
  } 
  // Format 2: platforms Array (Search Result/Model View)
  else if (Array.isArray(roleProfile.platforms)) {
    roleProfile.platforms.forEach(p => {
      // Handle various platform object structures (backend consistency)
      const name = p.name;
      const handle = p.username || p.handle;
      if (name && handle) {
        rawLinks[name.toLowerCase()] = handle;
      }
    });
  }

  // With the new OAuth system, selected platforms might have an empty string `""` as their value.
  const platformsCount = Object.entries(rawLinks)
    .filter(([_, val]) => typeof val === 'string' || val === null || val === undefined)
    .length;

  if (platformsCount === 0) return false;

  // Handles different projection names (user.verifiedPlatforms vs userDoc.verifiedPlatforms)
  const verifiedPlatforms = user.verifiedPlatforms || user.verifiedPlatformsMap || {};
  
  // Normalize to a local object for checking
  let verifiedMap = {};
  if (Array.isArray(verifiedPlatforms)) {
    verifiedPlatforms.forEach(p => {
      if (p && p.platform && p.verified) verifiedMap[p.platform.toLowerCase()] = p;
    });
  } else if (verifiedPlatforms instanceof Map) {
    verifiedMap = Object.fromEntries(verifiedPlatforms);
  } else {
    verifiedMap = verifiedPlatforms;
  }

  const unverifiedCount = Object.entries(rawLinks)
    .filter(([key, val]) => (typeof val === 'string' || val === null || val === undefined) && !verifiedMap[key.toLowerCase()])
    .length;

  const verifiedCount = platformsCount - unverifiedCount;

  if (platformsCount < 3) {
    // If < 3 platforms, all must be verified
    return unverifiedCount === 0;
  } else {
    // If >= 3 platforms, at least 3 must be verified
    return verifiedCount >= 3;
  }
}