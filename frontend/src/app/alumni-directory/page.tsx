"use client";

import React, { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Title from "@/components/Title";
import AlumniCard from "@/components/AlumniCard";

type Alumni = {
  id: number;
  firstname: string;
  lastname: string;
  company: string;
  role: string;
  generalIndustry: string;
  graduatedFrom: string;
  location: string;
  workDuration: string;
  pronouns: string;
  expertise: string[];
  imageUrl?: string;
};

const ACRONYMS = new Set(["UX", "UI", "AI", "SQL", "API", "B2B", "SaaS"]);

function normalizeTag(tag: string) {
  const cleaned = tag.trim().replace(/\s+/g, " ");
  const upper = cleaned.toUpperCase();

  if (ACRONYMS.has(upper)) return upper;

  return cleaned.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

const alumniData: Alumni[] = [
  {
    id: 1,
    firstname: "Emily",
    lastname: "Chen",
    company: "Google",
    role: "Software Engineer",
    generalIndustry: "Technology",
    graduatedFrom: "University of Toronto",
    location: "Toronto, Canada",
    workDuration: "8+ years",
    pronouns: "she/her",
    expertise: ["Mentorship", "Backend", "System Design", "Tech"],
  },
  {
    id: 2,
    firstname: "David",
    lastname: "Singh",
    company: "Deloitte",
    role: "Consultant",
    generalIndustry: "Consulting",
    graduatedFrom: "York University",
    location: "Toronto, Canada",
    workDuration: "5-7 years",
    pronouns: "he/him",
    expertise: ["Networking", "Business", "Strategy"],
  },
  {
    id: 3,
    firstname: "Aisha",
    lastname: "Khan",
    company: "Shopify",
    role: "Product Manager",
    generalIndustry: "Technology",
    graduatedFrom: "Toronto Metropolitan University",
    location: "Ottawa, Canada",
    workDuration: "5-7 years",
    pronouns: "she/her",
    expertise: ["Product", "Leadership", "Startups", "SaaS"],
  },
  {
    id: 4,
    firstname: "Sofia",
    lastname: "Martinez",
    company: "RBC",
    role: "Financial Analyst",
    generalIndustry: "Finance",
    graduatedFrom: "McMaster University",
    location: "Toronto, Canada",
    workDuration: "3-5 years",
    pronouns: "she/her",
    expertise: ["Finance", "Excel", "Capital Markets"],
  },
  {
    id: 5,
    firstname: "Liam",
    lastname: "O'Connor",
    company: "Amazon",
    role: "UX Designer",
    generalIndustry: "Technology",
    graduatedFrom: "OCAD University",
    location: "Vancouver, Canada",
    workDuration: "3-5 years",
    pronouns: "he/him",
    expertise: ["UX", "Research", "Design Systems"],
  },
  {
    id: 6,
    firstname: "Noor",
    lastname: "Hassan",
    company: "Public Health Ontario",
    role: "Research Associate",
    generalIndustry: "Healthcare",
    graduatedFrom: "University of Waterloo",
    location: "Toronto, Canada",
    workDuration: "1-3 years",
    pronouns: "she/her",
    expertise: ["Research", "Health", "Data Analysis"],
  },
];

export default function AlumniDirectoryPage() {
  const [status, setStatus] = useState("");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedGraduatedFrom, setSelectedGraduatedFrom] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedWorkDuration, setSelectedWorkDuration] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"relevance" | "name" | "duration">(
    "relevance",
  );

  const normalizedAlumni = useMemo(() => {
    return alumniData.map((alumni) => ({
      ...alumni,
      expertise: alumni.expertise.map(normalizeTag),
    }));
  }, []);

  const availableIndustries = useMemo(() => {
    return [
      ...new Set(normalizedAlumni.map((alumni) => alumni.generalIndustry)),
    ].sort((a, b) => a.localeCompare(b));
  }, [normalizedAlumni]);

  const availableSchools = useMemo(() => {
    return [
      ...new Set(normalizedAlumni.map((alumni) => alumni.graduatedFrom)),
    ].sort((a, b) => a.localeCompare(b));
  }, [normalizedAlumni]);

  const availableLocations = useMemo(() => {
    return [...new Set(normalizedAlumni.map((alumni) => alumni.location))].sort(
      (a, b) => a.localeCompare(b),
    );
  }, [normalizedAlumni]);

  const availableWorkDurations = useMemo(() => {
    return [...new Set(normalizedAlumni.map((alumni) => alumni.workDuration))];
  }, [normalizedAlumni]);

  const availableExpertise = useMemo(() => {
    const allTags = normalizedAlumni.flatMap((alumni) => alumni.expertise);
    return [...new Set(allTags)].sort((a, b) => a.localeCompare(b));
  }, [normalizedAlumni]);

  const toggleExpertise = (tag: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  };

  const workDurationOrder: Record<string, number> = {
    "1-3 years": 1,
    "3-5 years": 2,
    "5-7 years": 3,
    "8+ years": 4,
  };

  const filteredAlumni = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = normalizedAlumni.filter((alumni) => {
      const matchesSearch =
        query === "" ||
        `${alumni.firstname} ${alumni.lastname}`
          .toLowerCase()
          .includes(query) ||
        alumni.company.toLowerCase().includes(query) ||
        alumni.role.toLowerCase().includes(query) ||
        alumni.generalIndustry.toLowerCase().includes(query) ||
        alumni.graduatedFrom.toLowerCase().includes(query) ||
        alumni.location.toLowerCase().includes(query) ||
        alumni.workDuration.toLowerCase().includes(query) ||
        alumni.expertise.some((tag) => tag.toLowerCase().includes(query));

      const matchesIndustry =
        selectedIndustry === "" || alumni.generalIndustry === selectedIndustry;

      const matchesGraduatedFrom =
        selectedGraduatedFrom === "" ||
        alumni.graduatedFrom === selectedGraduatedFrom;

      const matchesLocation =
        selectedLocation === "" || alumni.location === selectedLocation;

      const matchesWorkDuration =
        selectedWorkDuration === "" ||
        alumni.workDuration === selectedWorkDuration;

      const matchesExpertise =
        selectedExpertise.length === 0 ||
        selectedExpertise.some((tag) => alumni.expertise.includes(tag));

      return (
        matchesSearch &&
        matchesIndustry &&
        matchesGraduatedFrom &&
        matchesLocation &&
        matchesWorkDuration &&
        matchesExpertise
      );
    });

    if (sortBy === "name") {
      return [...filtered].sort((a, b) =>
        `${a.firstname} ${a.lastname}`.localeCompare(
          `${b.firstname} ${b.lastname}`,
        ),
      );
    }

    if (sortBy === "duration") {
      return [...filtered].sort(
        (a, b) =>
          workDurationOrder[a.workDuration] - workDurationOrder[b.workDuration],
      );
    }

    return filtered;
  }, [
    normalizedAlumni,
    searchTerm,
    selectedIndustry,
    selectedGraduatedFrom,
    selectedLocation,
    selectedWorkDuration,
    selectedExpertise,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedIndustry("");
    setSelectedGraduatedFrom("");
    setSelectedLocation("");
    setSelectedWorkDuration("");
    setSelectedExpertise([]);
    setSortBy("relevance");
    setStatus("");
  };

  const handleConnect = (id: number) => {
    const alumni = normalizedAlumni.find((a) => a.id === id);
    if (alumni) {
      setStatus(
        `Connection request sent to ${alumni.firstname} ${alumni.lastname}`,
      );
    }
  };

  return (
    <main className="min-h-screen  font-sans text-slate-800">
      <section className="mx-auto w-full max-w-7xl px-[3%] py-12">
        <Title
          text="Alumni Directory"
          subtitle="Engage with graduates and unlock new opportunities"
        />

        <div className="mt-8 rounded-[32px] border border-[#D8C9BD] bg-[#F7F3EE] px-5 py-6 shadow-sm sm:px-8 sm:py-8">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_0.7fr_0.7fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-[#B89482]" />
              <input
                type="text"
                placeholder="Search by name, role, company, expertise"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 w-full rounded-full border border-[#D8C9BD] bg-[#F3EEE8] pl-14 pr-6 text-[15px] text-[#8A5A47] placeholder:text-[#A57C68] outline-none transition focus:border-[#C9896A]"
              />
            </div>

            <div className="relative">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="h-12 w-full appearance-none rounded-full border border-transparent bg-[#C9896A] pl-6 pr-14 text-[15px] font-semibold text-white outline-none transition focus:ring-2 focus:ring-[#0A7C95]/20"
              >
                <option value="" className="text-slate-800">
                  Industry
                </option>
                {availableIndustries.map((industry) => (
                  <option
                    key={industry}
                    value={industry}
                    className="text-slate-800"
                  >
                    {industry}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-6 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
            </div>

            <div className="relative">
              <select
                value={selectedGraduatedFrom}
                onChange={(e) => setSelectedGraduatedFrom(e.target.value)}
                className="h-12 w-full appearance-none rounded-full border border-transparent bg-[#C9896A] pl-6 pr-14 text-[15px] font-semibold text-white outline-none transition focus:ring-2 focus:ring-[#0A7C95]/20"
              >
                <option value="" className="text-slate-800">
                  Graduated From
                </option>
                {availableSchools.map((school) => (
                  <option
                    key={school}
                    value={school}
                    className="text-slate-800"
                  >
                    {school}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-6 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAdvancedOpen((prev) => !prev)}
              className="rounded-2xl border border-[#E1D4CA] bg-[#EFE7E0] px-7 py-3 text-sm font-semibold text-[#8A5A47] transition hover:bg-[#E7DDD4]"
            >
              <span className="inline-flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Advanced search
                {isAdvancedOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </span>
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-2xl border border-[#E1D4CA] bg-[#EFE7E0] px-7 py-3 text-sm font-semibold text-[#8A5A47] transition hover:bg-[#E7DDD4]"
            >
              Clear filters
            </button>
          </div>

          {isAdvancedOpen && (
            <>
              <div className="my-6 h-px bg-[#E3D7CE]" />

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <div className="relative">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="h-14 w-full appearance-none rounded-full border border-[#D8C9BD] bg-[#F3EEE8] pl-6 pr-14 text-[15px] font-medium text-[#8A5A47] outline-none transition focus:border-[#C9896A]"
                  >
                    <option value="">Location</option>
                    {availableLocations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-6 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A5A47]" />
                </div>

                <div className="relative">
                  <select
                    value={selectedWorkDuration}
                    onChange={(e) => setSelectedWorkDuration(e.target.value)}
                    className="h-14 w-full appearance-none rounded-full border border-[#D8C9BD] bg-[#F3EEE8] pl-6 pr-14 text-[15px] font-medium text-[#8A5A47] outline-none transition focus:border-[#C9896A]"
                  >
                    <option value="">Work Duration</option>
                    {availableWorkDurations.map((duration) => (
                      <option key={duration} value={duration}>
                        {duration}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-6 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A5A47]" />
                </div>

                <div className="relative">
                  <button
                    type="button"
                    className="flex h-14 w-full items-center justify-between rounded-full border border-[#D8C9BD] bg-[#F3EEE8] pl-6 pr-6 text-[15px] font-medium text-[#8A5A47]"
                  >
                    <span>
                      {selectedExpertise.length > 0
                        ? `${selectedExpertise.length} selected`
                        : "Expertise"}
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#8A5A47]" />
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {availableExpertise.map((tag) => {
                  const isActive = selectedExpertise.includes(tag);

                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleExpertise(tag)}
                      className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                        isActive
                          ? "border-[#74AFC0] bg-[#74AFC0] text-white"
                          : "border-[#D8C9BD] bg-[#F3EEE8] text-[#8A5A47] hover:bg-[#EFE7E0]"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-[1.05rem] font-semibold text-[#9A715D]">
            {filteredAlumni.length} alumni
            {filteredAlumni.length === 1 ? "" : " found"}
          </p>

          <div className="flex flex-wrap items-center gap-5 text-[1.05rem]">
            <span className="font-semibold text-[#9A715D]">Sort by</span>

            {[
              { key: "relevance", label: "Relevance" },
              { key: "name", label: "Name" },
              { key: "duration", label: "Work Duration" },
            ].map((option) => {
              const isActive = sortBy === option.key;

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() =>
                    setSortBy(option.key as "relevance" | "name" | "duration")
                  }
                  className={`relative pb-1 transition ${
                    isActive
                      ? "font-semibold text-[#7A4B3D]"
                      : "text-[#C4B3A7] hover:text-[#7A4B3D]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 lg:grid-cols-3 lg:justify-items-stretch">
          {filteredAlumni.map((alumni) => (
            <AlumniCard
              key={alumni.id}
              firstname={alumni.firstname}
              lastname={alumni.lastname}
              company={alumni.company}
              role={alumni.role}
              location={alumni.location}
              pronouns={alumni.pronouns}
              tags={alumni.expertise}
              imageUrl={alumni.imageUrl}
              onConnect={() => handleConnect(alumni.id)}
            />
          ))}
        </div>

        {filteredAlumni.length === 0 && (
          <p className="mt-8 px-1 text-sm text-[#7A4B3D]">
            No alumni match your current search or filters.
          </p>
        )}

        {status && <p className="mt-6 px-1 text-sm text-slate-700">{status}</p>}
      </section>
    </main>
  );
}
