import Image from "next/image";
import Link from "next/link";

type FooterProps = {
  organization_name: string;
};

export default function Footer({ organization_name }: FooterProps) {
  return (
    <footer className="w-full bg-white border-t border-black/10">
      <div
        className="mx-auto flex w-full flex-col gap-[clamp(14px,2.4vw,22px)] md:flex-row md:items-center md:justify-between"
        style={{
          maxWidth: "min(1280px, 96vw)",
          paddingInline: "clamp(14px,3vw,32px)",
          paddingBlock: "clamp(16px,2.8vw,26px)",
        }}
      >
        {/* Left: logo + org name */}
        <Link href="/" className="flex items-center" style={{ gap: "clamp(8px,1.3vw,14px)" }}>
          <Image
            src="/logo.webp"
            alt={organization_name}
            width={44}
            height={44}
            className="rounded-sm shadow-sm"
            style={{
              width: "clamp(30px,3.6vw,44px)",
              height: "clamp(30px,3.6vw,44px)",
            }}
            priority
          />
          <div className="flex flex-col">
            <span
              className="font-semibold text-sky-700 leading-tight"
              style={{ fontSize: "clamp(14px,1.8vw,18px)" }}
            >
              {organization_name}
            </span>
            
          </div>
        </Link>

        {/* Right: links + socials */}
        <div
          className="flex items-center gap-[clamp(14px,2vw,24px)]"
          style={{ fontSize: "clamp(13px,1.2vw,16px)" }}
        >
          <div
            className="flex items-center gap-[clamp(18px,2.5vw,28px)] font-semibold text-black"
            style={{ fontSize: "clamp(13px,1.2vw,16px)" }}
          >
            <Link href="/about" className="hover:opacity-70">
              About Us
            </Link>

            <Link href="/contact" className="hover:opacity-70">
              Contact Us
            </Link>

            <div className="flex items-center gap-[clamp(10px,1.6vw,16px)] ml-[clamp(6px,1vw,12px)]">
              <SocialImageLink href="https://instagram.com" label="Instagram" src="/instagram_logo.webp" />
              <SocialImageLink href="https://linkedin.com" label="LinkedIn" src="/linkedin_logo.webp" />
              <SocialImageLink href="https://line.me" label="LINE" src="/line_logo.webp" />
          </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialImageLink({
  href,
  label,
  src,
}: {
  href: string;
  label: string;
  src: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="grid place-items-center rounded-xl border border-black/10 bg-white shadow-sm hover:bg-black/[0.03] hover:opacity-90 transition"
      style={{
        width: "clamp(38px,4.6vw,46px)",
        height: "clamp(38px,4.6vw,46px)",
      }}
    >
      <Image
        src={src}
        alt=""
        width={22}
        height={22}
        style={{
          width: "clamp(18px,2.2vw,22px)",
          height: "clamp(18px,2.2vw,22px)",
        }}
      />
    </a>
  );
}

// function SocialIconLink({
//   href,
//   label,
//   children,
// }: {
//   href: string;
//   label: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <a
//       href={href}
//       aria-label={label}
//       target="_blank"
//       rel="noreferrer"
//       className="grid place-items-center rounded-xl border border-black/10 bg-white shadow-sm hover:bg-black/[0.03] hover:opacity-90 transition"
//       style={{
//         width: "clamp(38px,4.6vw,46px)",
//         height: "clamp(38px,4.6vw,46px)",
//       }}
//     >
//       {children}
//     </a>
//   );
// }

// function InstagramIcon() {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.8"
//       className="text-black/75"
//       style={{ width: "clamp(18px,2.2vw,22px)", height: "clamp(18px,2.2vw,22px)" }}
//       aria-hidden="true"
//     >
//       <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z" />
//       <path d="M12 16a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
//       <path d="M17.5 6.5h.01" />
//     </svg>
//   );
// }

// function LinkedInIcon() {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       fill="currentColor"
//       className="text-black/75"
//       style={{ width: "clamp(18px,2.2vw,22px)", height: "clamp(18px,2.2vw,22px)" }}
//       aria-hidden="true"
//     >
//       <path d="M6.94 6.5A1.94 1.94 0 1 1 5 4.56 1.94 1.94 0 0 1 6.94 6.5ZM7 8.5H5V20h2V8.5Zm4 0H9V20h2v-6.2c0-3.4 4-3.7 4 0V20h2v-6.9c0-5.5-5.8-5.3-7-2.6V8.5Z" />
//     </svg>
//   );
// }

// function LineIcon() {
//   // Simple LINE-style chat bubble with “LINE” text
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.8"
//       className="text-black/75"
//       style={{ width: "clamp(18px,2.2vw,22px)", height: "clamp(18px,2.2vw,22px)" }}
//       aria-hidden="true"
//     >
//       <path d="M12 3c5 0 9 3.1 9 7s-4 7-9 7c-.7 0-1.4-.1-2.1-.2L6 20l.8-3.2C4.5 15.6 3 13.9 3 10c0-3.9 4-7 9-7Z" />
//       <path d="M8 10.8h0" />
//       <path d="M11 10.8h0" />
//       <path d="M14 10.8h0" />
//       <path d="M7.3 14h9.4" />
//     </svg>
//   );
// }