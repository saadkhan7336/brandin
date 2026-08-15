import React, { useEffect, useState } from "react";
import { getOptimizedImage } from "../../utils/imageOptimization";
import { avatarColorClass, getNameInitial, isUsableAvatarUrl } from "../../utils/avatar";

/**
 * Profile image, or the first letter of the person's name when there is no photo.
 */
export default function UserAvatar({
  src,
  name = "",
  alt,
  className = "w-10 h-10 rounded-full",
  textClassName = "",
  imageType = "avatar",
}) {
  const usable = isUsableAvatarUrl(src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const initial = getNameInitial(name);
  const showImage = usable && !failed;

  return (
    <div
      className={`overflow-hidden shrink-0 flex items-center justify-center font-bold ${avatarColorClass(name)} ${className}`}
      aria-label={alt || name || "Avatar"}
      role="img"
    >
      {showImage ? (
        <img
          loading="lazy"
          decoding="async"
          src={getOptimizedImage(src, imageType)}
          alt={alt || name || ""}
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className={`select-none leading-none ${textClassName}`}>{initial}</span>
      )}
    </div>
  );
}
