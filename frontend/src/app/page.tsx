"use client";

import { useEffect, useState } from "react";

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
      <p>{status}</p>
    </main>
  );
}
