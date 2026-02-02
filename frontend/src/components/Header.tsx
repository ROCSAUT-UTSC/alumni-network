import Image from "next/image";
import Link from "next/link";

type HeaderProps = {
  organization_name: string;
  features: string;
  directory: string;
  community: string;
  events: string
};

export default function Header({ 
    organization_name, 
    features,
    directory,
    community,
    events,
}: HeaderProps) {
  return (
    <header className="w-full bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
        {/* Left: logo + name */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="UTSC Alumni"
            width={40}
            height={40}
            className="rounded-sm shadow-sm"
            priority
          />
          <span className="text-lg font-medium text-sky-700">
            {organization_name}
          </span>
        </Link>

        {/* Right: nav links */}
        <nav className="flex items-center gap-10 text-base font-semibold text-black">
          <Link href="/features" className="hover:opacity-70">
            {features}
          </Link>
          <Link href="/directory" className="hover:opacity-70">
            {directory}
          </Link>
          <Link href="/community" className="hover:opacity-70">
            {community}
          </Link>
          <Link href="/events" className="hover:opacity-70">
            {events}
          </Link>
        </nav>
      </div>
    </header>
  );
}
