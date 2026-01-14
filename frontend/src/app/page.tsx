"use client";

import { useEffect, useState } from "react";
import Card from "@/components/card";
import Title from "@/components/title";

export default function HomePage() {
  const [status, setStatus] = useState("Checking backend...");

  useEffect(() => {
    fetch("http://localhost:8000/health")
      .then((res) => res.json())
      .then((data) => setStatus(`Backend status: ${data.status}`))
      .catch(() => setStatus("Backend unreachable"));
  }, []);

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Alumni Platform</h1>
      <p>This is the Next.js frontend.</p>
      <Title text="Alumni Directory"/>
      <Card
        name="Name"
        occupation="Occupation"
        gradYear={2025}
        location="Location"
        tags={["Tag 1", "Tag 2", "Tag 3"]}
        onConnect={() => alert("Connect clicked")}
      />
      <p>{status}</p>
    </main>
  );
}
