
import React from "react";

type FieldProps = {
  label: string;
  placeholder?: string;
  required?: boolean;
  icon?: "star" | "search" | "mail" | "chev";
  type?: string;
};

function Icon({ name }: { name: FieldProps["icon"] }) {
  const cls = "text-black/70";
  const sizeStyle = { width: "clamp(14px,1.6vw,18px)", height: "clamp(14px,1.6vw,18px)" };

  if (name === "star")
    return (
      <svg viewBox="0 0 24 24" className={cls} style={sizeStyle} fill="currentColor">
        <path d="M12 17.3 18.2 21l-1.6-7 5.4-4.7-7.1-.6L12 2 9.1 8.7 2 9.3 7.4 14l-1.6 7Z" />
      </svg>
    );
  if (name === "search")
    return (
      <svg viewBox="0 0 24 24" className={cls} style={sizeStyle} fill="currentColor">
        <path d="M10 2a8 8 0 1 0 4.9 14.3l4.4 4.4 1.4-1.4-4.4-4.4A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z" />
      </svg>
    );
  if (name === "mail")
    return (
      <svg viewBox="0 0 24 24" className={cls} style={sizeStyle} fill="currentColor">
        <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5Z" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className={cls} style={sizeStyle} fill="currentColor">
      <path d="M7 10l5 5 5-5H7Z" />
    </svg>
  );
}

export function ProfileField({
  label,
  placeholder,
  required,
  icon,
  type = "text",
}: FieldProps) {
  return (
    <label className="relative block">
      <div
        className="pointer-events-none absolute top-1/2 -translate-y-1/2"
        style={{ left: "clamp(10px,1.1vw,14px)" }}
      >
        {icon ? <Icon name={icon} /> : null}
      </div>

      <input
        type={type}
        placeholder={(placeholder ?? label) + (required ? "" : " (optional)")}
        className="w-full border border-[#7a4b3d]/60 bg-white outline-none focus:border-[#7a4b3d] focus:ring-2 focus:ring-[#7a4b3d]/15"
        style={{
          height: "clamp(36px,4.2vw,44px)",
          borderRadius: "999px",
          paddingLeft: "clamp(36px,4vw,44px)",
          paddingRight: "clamp(12px,1.4vw,18px)",
          fontSize: "clamp(12px,1.35vw,14px)",
        }}
      />
    </label>
  );
}
