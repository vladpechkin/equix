import { DetailedHTMLProps, ImgHTMLAttributes, useState } from "react";

export const Img = (
  props: DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div
      className={`${
        isExpanded
          ? "fixed flex items-center justify-center top-0 left-0 h-full w-full bg-black/50 p-2 z-10"
          : "contents"
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <img {...props} className={`rounded-lg border border-accent ${isExpanded ? "h-full" : props.className || ""}`} />
    </div>
  );
};
