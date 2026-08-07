import Image from "next/image";
import React from "react";

type PitchGamePreviewProps = {
  alt: string;
  className?: string;
  priority?: boolean;
};

const PitchGamePreview = ({
  alt,
  className = "",
  priority = false,
}: PitchGamePreviewProps): React.JSX.Element => (
  <div
    className={`relative aspect-[4/3] overflow-hidden bg-[#eef1f4] ${className}`}
  >
    <Image
      src="/images/pitch-matching-game.png"
      alt={alt}
      width={1200}
      height={900}
      priority={priority}
      className="absolute bottom-0 left-1/2 h-auto w-[117.2%] max-w-none -translate-x-1/2"
    />
  </div>
);

export default PitchGamePreview;
