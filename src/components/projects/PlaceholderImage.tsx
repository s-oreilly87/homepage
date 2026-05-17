import type { Project } from "@/lib/projects";

interface PlaceholderImageProps {
  palette: Project["imagePalette"];
}

export function PlaceholderImage({ palette }: PlaceholderImageProps) {
  return (
    <div
      className="relative w-full rounded-xl overflow-hidden mb-6 aspect-video"
      style={{
        background: `linear-gradient(145deg, ${palette.from} 0%, ${palette.via} 55%, ${palette.to} 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff0a 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0px, transparent 18px, #ffffff03 18px, #ffffff03 19px)",
        }}
        aria-hidden="true"
      />
      <span className="absolute bottom-3 right-3.5 font-display text-[0.5rem] tracking-widest uppercase text-white/15 select-none">
        Screenshot TBC
      </span>
    </div>
  );
}
