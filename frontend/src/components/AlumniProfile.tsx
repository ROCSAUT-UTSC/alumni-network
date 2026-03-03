
import React from "react";
import ProfileShell from "./ProfileShell";
import { ProfileField } from "./ProfileField";

export default function AlumniProfile() {
  return (
    <ProfileShell
      sidebarItems={[
        { label: "Dashboard", active: true },
        { label: "Account Details" },
        { label: "Change Password", active: true },
        { label: "Logout" },
      ]}
    >
      <div className="flex flex-col gap-3">
        <ProfileField label="First Name..." required icon="star" />
        <ProfileField label="Last Name..." required icon="star" />
        <ProfileField label="Pronouns" icon="chev" />
        <ProfileField label="Industry" icon="search" />
        <ProfileField label="Email..." icon="mail" />
        <ProfileField label="Bio" />
        <ProfileField label="Location..." icon="search" />
        <ProfileField label="Position..." icon="search" />
        <ProfileField label="Current Work Duration" icon="chev" />
        <ProfileField label="Academic History" icon="chev" />
        <ProfileField label="LinkedIn" icon="chev" />
      </div>
    </ProfileShell>
  );
}
