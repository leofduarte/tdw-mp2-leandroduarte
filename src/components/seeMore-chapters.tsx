import React from "react";

interface SeeMoreChapterProps {
  children: React.ReactNode;
  maxHeight: number;
  className?: string;
  onOpen: () => void;
}

const SeeMoreChapter: React.FC<SeeMoreChapterProps> = ({
  children,
  maxHeight = 200,
  className = "",
  onOpen,
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div
        onClick={onOpen}
        ref={contentRef}
        className={`overflow-hidden ${className}`}
        style={{
          maxHeight: `${maxHeight}px`,
        }}
      >
        {children}
      </div>

      <span
        onClick={onOpen}
        className="text-sm text-white py-2 cursor-pointer"
        aria-label="Open more chapters"
      >
        See full chapter
      </span>
    </div>
  );
};

export default SeeMoreChapter;
