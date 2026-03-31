import Image from "next/image";
import Link from "next/link";

type FooterProps = {
  organization_name: string;
};

export default function Footer({ organization_name }: FooterProps) {
  return (
    <footer className="w-full bg-[#f5f4ef] border-t border-black/10">
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
              <SocialImageLink href="https://www.instagram.com/utsc.rocsaut/" label="Instagram" src="/instagram_logo.webp" />
              <SocialImageLink href="https://ca.linkedin.com/company/rocsaut" label="LinkedIn" src="/linkedin_logo.webp" />
              <SocialImageLink href="https://line.me/R/ti/p/%40215nnwqe" label="LINE" src="/line_logo.webp" />
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
