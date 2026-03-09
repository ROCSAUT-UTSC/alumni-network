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
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <Header organization_name="UTSC Alumni" features="Features" student_directory="Student Directory" alumni_directory="Alumni Directory" login="Login" registar="Registar"/>
      <h1>Alumni Platform</h1>
      <p>This is the Next.js frontend.</p>
      <Title text="Alumni Directory"/>
      <div 
      
      className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10"
      >
        <AlumniCard
        name="Name"
        occupation="Industry"
        gradYear={2025}
        location="Location"
        tags={["Tag 1", "Tag 2", "Tag 3"]}
        onConnect={() => alert("Connect clicked")}
        
        />
        <AlumniCard
        name="Name"
        occupation="Industry"
        gradYear={2025}
        location="Location"
        tags={["Tag 1", "Tag 2", "Tag 3"]}
        onConnect={() => alert("Connect clicked")}
        
        />
        <AlumniCard
        name="Name"
        occupation="Industry"
        gradYear={2025}
        location="Location"
        tags={["Tag 1", "Tag 2", "Tag 3"]}
        onConnect={() => alert("Connect clicked")}
        
        />
      </div>
      
      <div style={{marginTop: 500}}></div>

      <MessageBox recipient=""/>
      <AlumniProfile />
      <StudentProfile/>
      
      <p>{status}</p>
      <Footer organization_name="UTSC Alumni"/>
    </main>
  );
}
