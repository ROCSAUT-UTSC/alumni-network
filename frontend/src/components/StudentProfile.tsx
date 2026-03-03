// components/StudentProfileBox.tsx
import React from "react";
import ProfileShell from "./ProfileShell";
import { ProfileField } from "./ProfileField";

export default function StudentProfile() {
  return (
    <ProfileShell
      sidebarItems={[
        { label: "Dashboard", active: true },
        { label: "Account Details" },
        { label: "Change Password", active: true },
        { label: "Logout", active: true },
      ]}
    >
      <div className="flex flex-col gap-3">
        <ProfileField label="First Name..." required icon="star" />
        <ProfileField label="Last Name..." required icon="star" />
        <ProfileField label="Pronouns" icon="chev" />
        <ProfileField label="Graduation Year" icon="chev" />
        <ProfileField label="Major" icon="search" />
        <ProfileField label="University" icon="search" />
        <ProfileField label="School Email..." icon="mail" />
        <ProfileField label="Alumni to be..." icon="search" />
        <ProfileField label="Bio" />
      </div>
    </ProfileShell>
  );
}
