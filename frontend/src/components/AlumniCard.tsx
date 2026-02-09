import Image from "next/image";

type CardProps = {
  name: string;
  occupation: string;
  gradYear: number;
  location: string;
  tags: string[];
  imageUrl?: string;
  onConnect?: () => void;
  onTagClick?: (tag: string) => void;
};

export default function AlumniCard({
  name,
  occupation,
  gradYear,
  location,
  tags,
  imageUrl,
  onConnect,
  onTagClick,
}: CardProps) {
  const shownTags = tags.slice(0, 3);

  return (
    <section
      className="relative flex w-full max-w-[25rem] flex-col aspect-[395/330] overflow-hidden rounded-[1.5rem] border-2 border-[#774c3d] bg-[#fafaf5] pb-2"
    >
      {/* Top image area */}
      <div className="relative flex items-start justify-center overflow-hidden pt-4">
        <button
          type="button"
          onClick={onConnect}
          className="absolute right-3 top-3 z-10 rounded-full border border-[#774c3d] bg-transparent px-4 py-2 text-sm sm:text-base font-semibold text-[#007a97] transition-colors hover:bg-[#6d6d6d]/30"
        >
          Connect
        </button>

        <Image
          src={imageUrl ?? "/profile_icon.png"}
          alt={`${name} profile`}
          width={280}
          height={280}
          className="w-[65%] max-w-[18rem] h-auto"
          priority
        />
      </div>

      {/* Bottom info */}
      <div className="grid grid-cols-2 gap-2 px-4 sm:px-5 pt-2 pb-2">
        <div className="text-left">
          <p className="m-0 text-base sm:text-lg font-semibold text-[#4c4f69]">
            {name}
          </p>
          <p className="mt-1 text-sm sm:text-base font-normal text-[#6d6d6d]">
            {occupation}
          </p>
        </div>

        <div className="text-right">
          <p className="mt-1 text-sm sm:text-base font-normal text-[#6d6d6d]">
            {location}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-auto flex justify-between gap-3 px-4 sm:px-5 pt-3">
        {shownTags.map((tag, idx) => (
          <button
            key={`${tag}-${idx}`}
            type="button"
            onClick={() => onTagClick?.(tag)}
            className="flex-1 min-w-0 rounded-full bg-[#6CB7C9] py-2 text-sm sm:text-base font-semibold text-white transition hover:brightness-95"
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
}
