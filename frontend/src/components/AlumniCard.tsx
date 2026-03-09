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
    /* 1. aspect-[4/3] (or [380/300]) locks the card into a horizontal rectangle.
      2. rounded-[20px] restored for that specific soft-corner look from your first image.
      3. All internal units now use % or cqi to ensure they grow with the card.
    */
    <section
      className="@container w-full aspect-[380/310] rounded-[20px] border-[2px] border-[#7a4b3d] bg-[#f5f4ef] p-[5%] flex flex-col justify-between shadow-sm"
    >
      {/* Top section: Avatar + Name */}
      <div className="flex items-center gap-[5%]">
        <div className="relative w-[28%] aspect-square shrink-0">
          <Image
            src={imageUrl ?? "/profile_icon.png"}
            alt={`${name} profile`}
            fill
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <h2 className="text-[7cqi] font-semibold leading-tight text-[#7a4b3d]">
            {name}
          </h2>
          <p className="text-[4cqi] text-[#7a4b3d]">
            Pronouns
          </p>
        </div>
      </div>

      {/* Industry + Location */}
      <div className="flex justify-between text-[4.5cqi] text-gray-600 px-[2%]">
        <p className="truncate max-w-[50%]">{occupation || "Industry"}</p>
        <p className="truncate max-w-[40%] text-right">{location || "Location"}</p>
      </div>

      {/* Tags */}
      <div className="flex justify-between gap-[2%]">
        {shownTags.map((tag, idx) => (
          <button
            key={`${tag}-${idx}`}
            onClick={() => onTagClick?.(tag)}
            className="flex-1 rounded-full bg-[#6CA6B3] py-[2%] text-[3.8cqi] text-white font-semibold hover:brightness-95 truncate px-[1%]"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Connect button */}
      <div className="flex justify-center">
        <button
          onClick={onConnect}
          className="w-[70%] rounded-full border-[2px] border-[#7a4b3d] py-[2.5%] text-[4.5cqi] font-semibold text-[#007a97] hover:bg-[#7a4b3d]/10 transition"
        >
          Connect
        </button>
      </div>
    </section>
  );
}