"use client";

import { useEffect, useState } from "react";
import AlumniCard from "@/components/AlumniCard";
import Title from "@/components/Title";
import MessageBox from "@/components/MessageBox";
import Header from "@/components/Header";
import AlumniProfile from "@/components/AlumniProfile";
import StudentProfile from "@/components/StudentProfile";

import Footer from "@/components/Footer";

export default function HomePage() {
  const [status, setStatus] = useState("Checking backend...");

  useEffect(() => {
    fetch("http://localhost:8000/health")
      .then((res) => res.json())
      .then((data) => setStatus(`Backend status: ${data.status}`))
      .catch(() => setStatus("Backend unreachable"));
  }, []);

  return (
    <main style={{ fontFamily: "system-ui" }}>
      <h1>Alumni Platform</h1>
      <p>This is the Next.js frontend.</p>

      <div style={{ marginTop: 500 }}></div>

      <MessageBox recipient="" />
      <AlumniProfile />
      <StudentProfile />

      <p>{status}</p>
    </main>
  );
}
