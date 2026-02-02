import React from "react";

type SidebarItem = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export default function ProfileShell({
  sidebarItems,
  avatarColor = "#3b6f8f",
  children,
}: {
  sidebarItems: SidebarItem[];
  avatarColor?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="w-full max-w-[min(95vw,1100px)] bg-[#7a4b3d] p-[clamp(10px,1.6vw,18px)]"
      style={{ borderRadius: "clamp(18px,3vw,34px)" }}
    >
      <div
        className="bg-white overflow-hidden"
        style={{ borderRadius: "clamp(14px,2.4vw,26px)" }}
      >
        {/* Top avatar header */}
        <div
          className="relative flex items-center justify-center border-b border-black/20"
          style={{ height: "clamp(160px,22vw,240px)" }}
        >
          <div
            className="relative flex items-center justify-center rounded-full"
            style={{
              width: "clamp(96px,14vw,150px)",
              height: "clamp(96px,14vw,150px)",
              background: avatarColor,
            }}
          >
            {/* icon */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-white/95"
              style={{
                width: "clamp(44px,6vw,78px)",
                height: "clamp(44px,6vw,78px)",
              }}
              aria-hidden="true"
            >
              <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2-8 4.5V20h16v-1.5C20 16 16.42 14 12 14Z" />
            </svg>

            {/* Edit pill */}
            <button
              type="button"
              className="absolute bg-white text-[#1b6fb2] border border-[#7a4b3d] shadow-sm whitespace-nowrap"
              style={{
                top: "clamp(6px,1.2vw,10px)",
                right: "clamp(-10px,-1vw,-6px)",
                borderRadius: "999px",
                padding: "clamp(4px,0.6vw,8px) clamp(10px,1vw,14px)",
                fontSize: "clamp(11px,1.2vw,13px)",
              }}
            >
              Edit
            </button>
          </div>
        </div>

        {/* Body: becomes 1 column on small screens, 2 columns on md+ */}
        <div
          className="grid gap-[clamp(12px,2vw,24px)] p-[clamp(12px,2.2vw,24px)] md:grid-cols-[clamp(150px,20vw,190px)_1fr]"
        >
          {/* Sidebar: turns into top tabs on small screens */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className={[
                  "shrink-0 border transition",
                  item.active
                    ? "border-[#7a4b3d] bg-[#7a4b3d] text-white"
                    : "border-[#7a4b3d] bg-white text-[#7a4b3d]",
                ].join(" ")}
                style={{
                  height: "clamp(36px,4.2vw,44px)",
                  minWidth: "clamp(120px,18vw,160px)",
                  borderRadius: "clamp(10px,1.5vw,14px)",
                  fontSize: "clamp(12px,1.35vw,14px)",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
