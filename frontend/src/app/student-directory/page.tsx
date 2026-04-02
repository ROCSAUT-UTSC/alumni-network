"use client";

import React, { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Title from "@/components/Title";
import StudentCard from "@/components/StudentCard";

type Student = {
  id: number;
  firstname: string;
  lastname: string;
  major: string;
  year: string;
  expectedGraduationYear: string;
  institution: string;
  location: string;
  pronouns: string;
  tags: string[];
  imageUrl?: string;
};

const ACRONYMS = new Set(["UX", "UI", "AI", "SQL", "API"]);

function normalizeTag(tag: string) {
  const cleaned = tag.trim().replace(/\s+/g, " ");
  const upper = cleaned.toUpperCase();

  if (ACRONYMS.has(upper)) return upper;

  return cleaned.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

const studentData: Student[] = [
  {
    id: 1,
    firstname: "Ava",
    lastname: "Martinez",
    major: "Computer Science",
    year: "3rd Year",
    expectedGraduationYear: "2027",
    institution: "University of Toronto",
    location: "Toronto, Canada",
    pronouns: "she/her",
    tags: ["React", "Python", "AI", "Java"],
  },
  {
    id: 2,
    firstname: "Liam",
    lastname: "Chen",
    major: "Statistics",
    year: "2nd Year",
    expectedGraduationYear: "2028",
    institution: "York University",
    location: "Toronto, Canada",
    pronouns: "he/him",
    tags: ["SQL", "Data", "Analytics"],
  },
  {
    id: 3,
    firstname: "Noor",
    lastname: "Hassan",
    major: "Health Studies",
    year: "4th Year",
    expectedGraduationYear: "2026",
    institution: "Toronto Metropolitan University",
    location: "Toronto, Canada",
    pronouns: "she/her",
    tags: ["Research", "Leadership", "Health"],
  },
  {
    id: 4,
    firstname: "Ethan",
    lastname: "Williams",
    major: "Business Administration",
    year: "1st Year",
    expectedGraduationYear: "2029",
    institution: "Seneca College",
    location: "Toronto, Canada",
    pronouns: "he/him",
    tags: ["Finance", "Excel", "Business"],
  },
  {
    id: 5,
    firstname: "Sofia",
    lastname: "Kowalski",
    major: "Psychology",
    year: "3rd Year",
    expectedGraduationYear: "2027",
    institution: "McMaster University",
    location: "Hamilton, Canada",
    pronouns: "she/her",
    tags: ["UX", "Research", "Design"],
  },
  {
    id: 6,
    firstname: "David",
    lastname: "Park",
    major: "Marketing",
    year: "4th Year",
    expectedGraduationYear: "2026",
    institution: "George Brown College",
    location: "Toronto, Canada",
    pronouns: "he/him",
    tags: ["Marketing", "Startups", "Pitching", "Leadership"],
  },
];

export default function StudentDirectoryPage() {
  const [status, setStatus] = useState("");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"relevance" | "name" | "year">(
    "relevance",
  );

  const normalizedStudents = useMemo(() => {
    return studentData.map((student) => ({
      ...student,
      tags: student.tags.map(normalizeTag),
    }));
  }, []);

  const availableTags = useMemo(() => {
    const tags = normalizedStudents.flatMap((student) => student.tags);
    return [...new Set(tags)].sort((a, b) => a.localeCompare(b));
  }, [normalizedStudents]);

  const availableMajors = useMemo(() => {
    return [
      ...new Set(normalizedStudents.map((student) => student.major)),
    ].sort((a, b) => a.localeCompare(b));
  }, [normalizedStudents]);

  const availableInstitutions = useMemo(() => {
    return [
      ...new Set(normalizedStudents.map((student) => student.institution)),
    ].sort((a, b) => a.localeCompare(b));
  }, [normalizedStudents]);

  const availableLocations = useMemo(() => {
    return [
      ...new Set(normalizedStudents.map((student) => student.location)),
    ].sort((a, b) => a.localeCompare(b));
  }, [normalizedStudents]);

  const availableYears = useMemo(() => {
    return [
      ...new Set(
        normalizedStudents.map((student) => student.expectedGraduationYear),
      ),
    ].sort();
  }, [normalizedStudents]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  };

  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = normalizedStudents.filter((student) => {
      const matchesSearch =
        query === "" ||
        `${student.firstname} ${student.lastname}`
          .toLowerCase()
          .includes(query) ||
        student.major.toLowerCase().includes(query) ||
        student.year.toLowerCase().includes(query) ||
        student.location.toLowerCase().includes(query) ||
        student.expectedGraduationYear.toLowerCase().includes(query) ||
        student.location.toLowerCase().includes(query) ||
        student.institution.toLowerCase().includes(query) ||
        student.tags.some((tag) => tag.toLowerCase().includes(query));

      const matchesMajor =
        selectedMajor === "" || student.major === selectedMajor;

      const matchesInstitution =
        selectedInstitution === "" ||
        student.institution === selectedInstitution;

      const matchesLocation =
        selectedLocation === "" || student.location === selectedLocation;

      const matchesYear =
        selectedYear === "" || student.expectedGraduationYear === selectedYear;

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => student.tags.includes(tag));

      return (
        matchesSearch &&
        matchesMajor &&
        matchesInstitution &&
        matchesLocation &&
        matchesYear &&
        matchesTags
      );
    });

    if (sortBy === "name") {
      return [...filtered].sort((a, b) =>
        `${a.firstname} ${a.lastname}`.localeCompare(
          `${b.firstname} ${b.lastname}`,
        ),
      );
    }

    if (sortBy === "year") {
      return [...filtered].sort((a, b) =>
        a.expectedGraduationYear.localeCompare(b.expectedGraduationYear),
      );
    }

    return filtered;
  }, [
    normalizedStudents,
    searchTerm,
    selectedMajor,
    selectedInstitution,
    selectedLocation,
    selectedYear,
    selectedTags,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedMajor("");
    setSelectedInstitution("");
    setSelectedLocation("");
    setSelectedYear("");
    setSelectedTags([]);
    setSortBy("relevance");
    setStatus("");
  };

  const handleConnect = (id: number) => {
    const student = normalizedStudents.find((s) => s.id === id);
    if (student) {
      setStatus(
        `Connection request sent to ${student.firstname} ${student.lastname}`,
      );
    }
  };

  const handleViewProfile = (id: number) => {
    const student = normalizedStudents.find((s) => s.id === id);
    if (student) {
      setStatus(`Viewing profile for ${student.firstname} ${student.lastname}`);
    }
  };

  const sortButtonClass = (value: "relevance" | "name" | "year") =>
    `rounded-2xl px-7 py-3 text-sm font-semibold transition ${
      sortBy === value
        ? "bg-[#E7DDD4] text-[#8A5A47]"
        : "border border-[#D9CDC3] bg-[#F5F1EC] text-[#CFC6BD] hover:text-[#8A5A47]"
    }`;

  return (
    <main className="min-h-screen font-sans text-slate-800">
      <section className="mx-auto w-full max-w-7xl px-[3%] py-12">
        <Title
          text="Student Directory"
          subtitle="Find your people, build projects, and grow together"
        />

        <div className="mt-8 rounded-[32px] border border-[#D8C9BD] bg-[#F7F3EE] px-5 py-6 shadow-sm sm:px-8 sm:py-8">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_0.7fr_0.7fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-[#B89482]" />
              <input
                type="text"
                placeholder="Search by name, major, skills"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 w-full rounded-full border border-[#D8C9BD] bg-[#F3EEE8] pl-14 pr-6 text-[15px] text-[#8A5A47] placeholder:text-[#A57C68] outline-none transition focus:border-[#C9896A]"
              />
            </div>

            <div className="relative">
              <select
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
                className="h-12 w-full appearance-none rounded-full border border-transparent bg-[#C9896A] pl-6 pr-14 text-[15px] font-semibold text-white outline-none transition focus:ring-2 focus:ring-[#0A7C95]/20"
              >
                <option value="" className="text-slate-800">
                  Major / Program
                </option>
                {availableMajors.map((major) => (
                  <option key={major} value={major} className="text-slate-800">
                    {major}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-6 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
            </div>

            <div className="relative">
              <select
                value={selectedInstitution}
                onChange={(e) => setSelectedInstitution(e.target.value)}
                className="h-12 w-full appearance-none rounded-full border border-transparent bg-[#C9896A] pl-6 pr-14 text-[15px] font-semibold text-white outline-none transition focus:ring-2 focus:ring-[#0A7C95]/20"
              >
                <option value="" className="text-slate-800">
                  Institution
                </option>
                {availableInstitutions.map((institution) => (
                  <option
                    key={institution}
                    value={institution}
                    className="text-slate-800"
                  >
                    {institution}
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
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="h-14 w-full appearance-none rounded-full border border-[#D8C9BD] bg-[#F3EEE8] pl-6 pr-14 text-[15px] font-medium text-[#8A5A47] outline-none transition focus:border-[#C9896A]"
                  >
                    <option value="">Graduation year</option>
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
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
                      {selectedTags.length > 0
                        ? `${selectedTags.length} selected`
                        : "Skills"}
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#8A5A47]" />
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {availableTags.map((tag) => {
                  const isActive = selectedTags.includes(tag);

                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
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
            {filteredStudents.length} student
            {filteredStudents.length === 1 ? "" : "s"} found
          </p>

          <div className="flex flex-wrap items-center gap-5 text-[1.05rem]">
            <span className="font-semibold text-[#9A715D]">Sort by</span>

            {["relevance", "name", "year"].map((option) => {
              const isActive = sortBy === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSortBy(option as any)}
                  className={`relative pb-1 transition ${
                    isActive
                      ? "font-semibold text-[#7A4B3D]"
                      : "text-[#C4B3A7] hover:text-[#7A4B3D]"
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 lg:grid-cols-3 lg:justify-items-stretch">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              firstname={student.firstname}
              lastname={student.lastname}
              major={student.major}
              year={student.year}
              institution={student.institution}
              pronouns={student.pronouns}
              tags={student.tags}
              imageUrl={student.imageUrl}
              onConnect={() => handleConnect(student.id)}
              onViewProfile={() => handleViewProfile(student.id)}
              onTagClick={(tag) => toggleTag(tag)}
            />
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <p className="mt-8 px-1 text-sm text-[#7A4B3D]">
            No students match your current search or filters.
          </p>
        )}

        {status && <p className="mt-6 px-1 text-sm text-slate-700">{status}</p>}
      </section>
    </main>
  );
}
