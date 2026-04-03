import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#e9d1c2] border-t border-black/10">
      <div
        className="mx-auto flex flex-col gap-5 py-4 sm:py-5"
        style={{
          paddingInline: "clamp(14px,3vw,32px)",
        }}
      >
        {/* Top row */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Left: logo + org name */}
          <Link
            href="/"
            className="flex items-center min-w-0"
            style={{ gap: "clamp(8px,1.3vw,14px)" }}
          >
            <Image
              src="/logo.svg"
              alt="Taiwanese Alumni Network"
              width={44}
              height={44}
              className="rounded-sm shadow-sm shrink-0"
              style={{
                width: "clamp(30px,3.6vw,44px)",
                height: "clamp(30px,3.6vw,44px)",
              }}
              priority
            />
            <span
              className="font-semibold text-[#007A97] leading-tight"
              style={{ fontSize: "clamp(14px,1.8vw,18px)" }}
            >
              Taiwanese Alumni Network
            </span>
          </Link>

          {/* Right: links + socials */}
          <div
            className="flex flex-wrap items-center text-[#5C3A2E] font-semibold"
            style={{
              gap: "clamp(14px,2.2vw,28px)",
              fontSize: "clamp(13px,1.2vw,16px)",
            }}
          >
            <Link href="/about" className="hover:opacity-70">
              About Us
            </Link>

            <Link href="/contact" className="hover:opacity-70">
              Contact Us
            </Link>

            <div className="flex items-center gap-[clamp(10px,1.6vw,16px)] md:ml-2">
              <SocialImageLink
                href="https://www.instagram.com/utsc.rocsaut/"
                label="Instagram"
                src="/instagram_logo.webp"
              />
              <SocialImageLink
                href="https://ca.linkedin.com/company/rocsaut"
                label="LinkedIn"
                src="/linkedin_logo.webp"
              />
              <SocialImageLink
                href="https://line.me/R/ti/p/%40215nnwqe"
                label="LINE"
                src="/line_logo.webp"
              />
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div>
          <p
            className="text-[#5C3A2E]/60 leading-relaxed"
            style={{ fontSize: "clamp(12px,1.1vw,14px)" }}
          >
            © 2026 Taiwanese Alumni Network. All rights reserved.
          </p>
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
      className="grid place-items-center rounded-xl hover:bg-black/[0.03] hover:opacity-90 transition"
      style={{
        width: "clamp(38px,4.6vw,46px)",
        height: "clamp(38px,4.6vw,46px)",
      }}
    >
      <Image
        src={src}
        alt=""
        width={50}
        height={50}
        style={{
          width: "clamp(18px,2.2vw,22px)",
          height: "clamp(18px,2.2vw,22px)",
        }}
      />
    </a>
  );
}
