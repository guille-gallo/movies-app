import { useState } from "react";
import { Avatar } from "@material-ui/core";

export function AvatarWithFallback({ src, fallbackSrc, className, ...rest }) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  const onError = () => {
    setImgSrc(fallbackSrc);
  };

  return (
    <Avatar {...rest} className={className} key={imgSrc}>
      <img
        src={imgSrc}
        onError={onError}
        alt={rest.alt}
        referrerPolicy="no-referrer"
        data-testid="avatar"
      />
    </Avatar>
  );
}
