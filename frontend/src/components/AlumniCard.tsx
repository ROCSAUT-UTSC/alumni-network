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
    <section className="relative box-border flex h-[330px] w-[395px] flex-col overflow-hidden rounded-[24px] border-2 border-[#774c3d] bg-[#fafaf5] pb-[10px]">
      {/* Top image area */}
     <div className="relative flex items-start justify-center overflow-hidden pt-[16px]">
        <button
            type="button"
            onClick={onConnect}
            className="absolute right-[14px] top-[14px] z-[10] rounded-[999px] border border-[#774c3d] bg-transparent px-[18px] py-[10px] text-[16px] font-[600] text-[#007a97] hover:bg-[#6d6d6d]/15 transition-colors"
        >
            Connect
        </button>

        <Image
            src={imageUrl ?? "/profile_icon.png"}
            alt={`${name} profile`}
            width={280}
            height={280}
            className="h-auto w-[280px]"
        />
    </div>


      {/* Bottom info */}
      <div className="grid grid-cols-2 gap-[10px] px-[18px] pb-[10px] pt-[8px]">
        <div className="text-left">
          <p className="m-0 text-[20px] font-[600] text-[#e7ddd6]">{name}</p>
          <p className="mt-[6px] text-[16px] font-[400] text-[#6d6d6d]">
            {occupation}
          </p>
        </div>

        <div className="text-right">
          <p className="m-0 text-[20px] font-[600] text-[#774c3d]">
            Class of {gradYear}
          </p>
          <p className="mt-[6px] text-[16px] font-[400] text-[#6d6d6d]">
            {location}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex justify-between gap-[23px] px-[18px] pt-[14px]">
        {shownTags.map((tag, idx) => (
          <button
            key={`${tag}-${idx}`}
            type="button"
            onClick={() => onTagClick?.(tag)}
            className="h-[38px] w-[103px] cursor-pointer rounded-[999px] bg-[#6CB7C9] text-[16px] font-[600] text-white hover:brightness-[0.98]"
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
}
