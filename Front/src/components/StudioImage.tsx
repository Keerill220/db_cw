import { Music } from "lucide-react";

/**
 * Image placeholder used when a studio/room has no photoUrl in the DB.
 * Renders a teal gradient with a Music icon, sized via parent's className.
 */
export function StudioPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-600 flex items-center justify-center ${className}`}>
      <Music className="w-1/3 h-1/3 max-w-16 max-h-16 text-white/70" />
    </div>
  );
}

interface ImgProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export function StudioImage({ src, alt, className }: ImgProps) {
  if (!src) return <StudioPlaceholder className={className} />;
  return <img src={src} alt={alt} className={className} onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")} />;
}
