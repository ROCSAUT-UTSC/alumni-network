import Image from "next/image";

type StudentCardProps = {
  firstname: string;
  lastname: string;
  major: string;
  year: string;
  institution: string;
  pronouns?: string;
  tags: string[];
  imageUrl?: string;
  onConnect?: () => void;
  onViewProfile?: () => void;
  onTagClick?: (tag: string) => void;
};

function getInitials(firstname: string, lastname: string) {
  return `${firstname?.[0] ?? ""}${lastname?.[0] ?? ""}`.toUpperCase();
}

export default function StudentCard({
  firstname,
  lastname,
  major,
  year,
  institution,
  pronouns = "she/her",
  tags,
  imageUrl,
  onConnect,
  onViewProfile,
  onTagClick,
}: StudentCardProps) {
  const shownTags = (tags ?? []).slice(0, 3);

  return (
    <section className="w-full max-w-[360px] rounded-[20px] border-[2px] border-[#7A4B3D] bg-[#F5F4EF] p-5 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 border-b border-[#7A4B3D]/15 pb-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#366c8e]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`${firstname} ${lastname} profile`}
                fill
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xl font-semibold text-white">
                {getInitials(firstname, lastname)}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[1.05rem] font-semibold text-[#7A4B3D]">
              {firstname} {lastname}
            </h2>
            <p className="mt-0.5 text-sm text-[#7A4B3D]">{pronouns}</p>
          </div>

          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#6CA6B3]/20 px-3 py-1 text-[12px] font-medium text-[#007A97]">
            Student
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[18px] bg-[#7A4B3D]/[0.06] px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#7A4B3D]/70">
              Major
            </p>
            <p className="mt-1 text-[13px] font-medium leading-snug text-[#7A4B3D]">
              {major}
            </p>
          </div>

          <div className="rounded-[18px] bg-[#7A4B3D]/[0.06] px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#7A4B3D]/70">
              Year of Study
            </p>
            <p className="mt-1 text-[13px] font-medium leading-snug text-[#7A4B3D]">
              {year}
            </p>
          </div>

          <div className="col-span-2 rounded-[18px] bg-[#7A4B3D]/[0.06] px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#7A4B3D]/70">
              INSTITUTION
            </p>
            <p className="mt-1 text-[13px] font-medium leading-snug text-[#7A4B3D]">
              {institution}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {shownTags.map((tag, idx) => (
            <button
              key={`${tag}-${idx}`}
              onClick={() => onTagClick?.(tag)}
              className="rounded-full bg-[#6CA6B3] px-4 py-1.5 text-[12px] font-semibold text-white transition hover:brightness-95"
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex gap-3 pt-1">
          {/* Connect (outlined) */}
          <button
            onClick={onConnect}
            className="flex-1 rounded-full border-2 border-[#7A4B3D] bg-transparent px-6 py-3 text-[14px] font-semibold text-[#007A97] transition hover:bg-[#7A4B3D]/5"
          >
            Connect
          </button>

          {/* View Profile (filled) */}
          <button
            onClick={onViewProfile}
            className="flex-1 rounded-full bg-[#E3D8CF] px-6 py-3 text-[14px] font-semibold text-[#7A4B3D] transition hover:brightness-95"
          >
            View Profile
          </button>
        </div>
      </div>
    </section>
  );
}
