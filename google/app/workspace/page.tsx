"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderKanban,
  FileSearch,
  Cpu,
  Files,
  CloudLightning,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Eye,
  Sparkles,
  Terminal,
  Play,
  Pause,
  CheckCircle,
  HelpCircle,
  GitBranch,
  Folder,
  FolderOpen,
  File,
  Code,
  Lock,
  Database,
  Monitor,
  Tablet,
  Smartphone,
  Shield,
  FileText,
  X,
  PlayCircle,
  Share2,
  Check,
  RefreshCw,
  TerminalSquare,
  Copy,
  ChevronDown,
  ExternalLink,
  CircleDot,
  Loader2,
  User,
  Download
} from "lucide-react";
import PremiumBackground from "@/components/shared/PremiumBackground";

// Custom Github Icon
const Github = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

// Language Icons Helper
const getFileIcon = (fileName: string) => {
  const ext = fileName.split(".").pop();
  switch (ext) {
    case "tsx":
      return <Code className="h-3.5 w-3.5 text-cyan-400" />;
    case "ts":
      return <Code className="h-3.5 w-3.5 text-blue-400" />;
    case "css":
      return <Monitor className="h-3.5 w-3.5 text-indigo-400" />;
    case "py":
      return <Code className="h-3.5 w-3.5 text-yellow-450" />;
    case "sql":
      return <Database className="h-3.5 w-3.5 text-emerald-400" />;
    case "svg":
      return <FileText className="h-3.5 w-3.5 text-amber-400" />;
    default:
      return <File className="h-3.5 w-3.5 text-zinc-400" />;
  }
};

// 10 AI Agents in Team
interface TeamMember {
  role: string;
  name: string;
  task: string;
  progress: number;
  status: "Waiting" | "Working" | "Reviewing" | "Completed";
  confidence: number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  elapsed: number;
  thinking: boolean;
  thoughts: string;
  dependencies: string;
  nextTask: string;
  estFinish: string;
}

const INITIAL_TEAM: TeamMember[] = [
  {
    role: "CEO",
    name: "Aegis",
    task: "Understanding business requirements...",
    progress: 100,
    status: "Completed",
    confidence: 99,
    icon: Shield,
    iconColor: "text-indigo-400",
    elapsed: 8,
    thinking: false,
    thoughts: "Aligning clinical compliance guidelines with technical milestones to prevent regulatory bottlenecks.",
    dependencies: "None",
    nextTask: "Final approval of PM requirements documentation.",
    estFinish: "Completed"
  },
  {
    role: "Product Manager",
    name: "Scribe",
    task: "Generating Product Requirements...",
    progress: 72,
    status: "Working",
    confidence: 97,
    icon: FileText,
    iconColor: "text-purple-400",
    elapsed: 24,
    thinking: true,
    thoughts: "Fleshing out patient checkout flows to ensure the Stripe payment webhooks handle timeouts gracefully.",
    dependencies: "CEO Business Brief",
    nextTask: "Define REST endpoint specifications for the appointment schedule queue.",
    estFinish: "1.2 min"
  },
  {
    role: "Architect",
    name: "Nexus",
    task: "Designing system architecture...",
    progress: 43,
    status: "Working",
    confidence: 98,
    icon: Cpu,
    iconColor: "text-emerald-400",
    elapsed: 15,
    thinking: true,
    thoughts: "Evaluating whether to enforce strict JWT verification at the API Gateway level or service level.",
    dependencies: "Product Requirements Document (PRD)",
    nextTask: "Map database connection pools for high-concurrency patient reads.",
    estFinish: "3.5 min"
  },
  {
    role: "Database",
    name: "Schema",
    task: "Creating schema...",
    progress: 0,
    status: "Waiting",
    confidence: 96,
    icon: Database,
    iconColor: "text-blue-400",
    elapsed: 0,
    thinking: false,
    thoughts: "Optimizing index structures on patients table for faster search autocomplete.",
    dependencies: "Architect ERD Blueprints",
    nextTask: "Write migration DDL files for the appointments schema.",
    estFinish: "5.0 min"
  },
  {
    role: "Frontend",
    name: "Pixel",
    task: "Waiting for architecture...",
    progress: 0,
    status: "Waiting",
    confidence: 95,
    icon: Monitor,
    iconColor: "text-cyan-400",
    elapsed: 0,
    thinking: false,
    thoughts: "Awaiting modular responsive layout wireframes to scaffold component tree.",
    dependencies: "Architect System Layout",
    nextTask: "Scaffold layout pages with Tailwind CSS styling variables.",
    estFinish: "12.0 min"
  },
  {
    role: "Backend",
    name: "Core",
    task: "Preparing API contracts...",
    progress: 0,
    status: "Waiting",
    confidence: 97,
    icon: Code,
    iconColor: "text-teal-400",
    elapsed: 0,
    thinking: false,
    thoughts: "Drafting controller skeletons for the database database connectors.",
    dependencies: "Architect APIs specs",
    nextTask: "Implement CORS configurations and authentication headers.",
    estFinish: "10.0 min"
  },
  {
    role: "QA",
    name: "Spec",
    task: "Waiting...",
    progress: 0,
    status: "Waiting",
    confidence: 98,
    icon: CheckCircle,
    iconColor: "text-rose-400",
    elapsed: 0,
    thinking: false,
    thoughts: "Waiting for backend code build to execute integration tests.",
    dependencies: "Backend & Database code compilation",
    nextTask: "Write automated test scripts for user signup and registration.",
    estFinish: "15.0 min"
  },
  {
    role: "Security",
    name: "Sentinel",
    task: "Waiting...",
    progress: 0,
    status: "Waiting",
    confidence: 99,
    icon: Lock,
    iconColor: "text-amber-400",
    elapsed: 0,
    thinking: false,
    thoughts: "Standing by to perform OWASP dependency scans and auth token checks.",
    dependencies: "Backend codebase build",
    nextTask: "Verify input sanitization rules on registration forms.",
    estFinish: "18.0 min"
  },
  {
    role: "DevOps",
    name: "Orbit",
    task: "Waiting...",
    progress: 0,
    status: "Waiting",
    confidence: 96,
    icon: CloudLightning,
    iconColor: "text-orange-400",
    elapsed: 0,
    thinking: false,
    thoughts: "Awaiting passing test suites to deploy revision container image.",
    dependencies: "QA validation reports",
    nextTask: "Configure Kubernetes ingress routers.",
    estFinish: "22.0 min"
  },
  {
    role: "Reviewer",
    name: "Judge",
    task: "Waiting...",
    progress: 0,
    status: "Waiting",
    confidence: 98,
    icon: Eye,
    iconColor: "text-fuchsia-400",
    elapsed: 0,
    thinking: false,
    thoughts: "Standing by to verify quality scores and code guidelines compliance.",
    dependencies: "DevOps deploy report",
    nextTask: "Analyze global workspace compliance reports.",
    estFinish: "25.0 min"
  }
];

interface TimelineStep {
  type: "folder" | "file";
  path: string;
  name: string;
  parent?: string;
  content: string;
  language: string;
}

const GENERATION_STEPS: TimelineStep[] = [
  { type: "folder", path: "app", name: "app", content: "", language: "" },
  { type: "file", path: "app/layout.tsx", name: "layout.tsx", parent: "app", content: `import React from "react";\nimport "./globals.css";\n\nexport const metadata = {\n  title: "HealthPortal OS",\n  description: "Autonomous Clinic Management Operating System",\n};\n\nexport default function RootLayout({\n  children,\n}: {\n  children: React.ReactNode;\n}) {\n  return (\n    <html lang="en">\n      <body className="bg-[#050505] text-zinc-100 antialiased font-sans">\n        {children}\n      </body>\n    </html>\n  );\n}`, language: "typescript" },
  { type: "file", path: "app/page.tsx", name: "page.tsx", parent: "app", content: `"use client";\n\nimport React, { useState } from "react";\nimport Header from "@/components/Header";\nimport Button from "@/components/Button";\n\nexport default function HomePage() {\n  const [patients] = useState([\n    { id: 1, name: "Alice Johnson", time: "09:00 AM", status: "Checked In" },\n    { id: 2, name: "Robert Miller", time: "10:30 AM", status: "Scheduled" }\n  ]);\n\n  return (\n    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">\n      <Header />\n      <main className="flex-grow max-w-4xl w-full mx-auto p-8 space-y-10">\n        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">\n          Clinic Core Management\n        </h1>\n      </main>\n    </div>\n  );\n}`, language: "typescript" },
  { type: "file", path: "app/loading.tsx", name: "loading.tsx", parent: "app", content: `import React from "react";\n\nexport default function Loading() {\n  return (\n    <div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono text-[10px] text-zinc-550 animate-pulse">\n      COMPILING blue-prints...\n    </div>\n  );\n}`, language: "typescript" },
  { type: "folder", path: "components", name: "components", content: "", language: "" },
  { type: "file", path: "components/Navbar.tsx", name: "Navbar.tsx", parent: "components", content: `import React from "react";\n\nexport function Navbar() {\n  return (\n    <nav className="w-full h-14 border-b border-white/5 bg-[#0B0B0F]/90 backdrop-blur px-6 flex items-center justify-between">\n      <span className="font-bold text-xs text-white">HealthPortal AI</span>\n    </nav>\n  );\n}`, language: "typescript" },
  { type: "file", path: "components/Sidebar.tsx", name: "Sidebar.tsx", parent: "components", content: `import React from "react";\n\nexport default function Sidebar() {\n  return (\n    <aside className="w-64 border-r border-white/5 bg-[#0B0B0F] p-4 text-zinc-400 font-sans">\n      <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Dashboard</span>\n    </aside>\n  );\n}`, language: "typescript" },
  { type: "file", path: "components/Hero.tsx", name: "Hero.tsx", parent: "components", content: `import React from "react";\n\nexport default function Hero() {\n  return (\n    <div className="text-center py-16 space-y-4">\n      <h1 className="text-4xl font-extrabold tracking-tight text-white">Welcome to HealthPortal AI</h1>\n      <p className="text-zinc-455 text-xs leading-relaxed max-w-md mx-auto">Seamless patient tracking scheduling, relational health schemas, and security-hardened rules.</p>\n    </div>\n  );\n}`, language: "typescript" },
  { type: "file", path: "components/PromptBox.tsx", name: "PromptBox.tsx", parent: "components", content: `import React from "react";\n\nexport default function PromptBox() {\n  return (\n    <div className="p-4 bg-[#0B0B0F]/70 border border-white/5 rounded-xl">\n      <h3 className="text-xs font-bold text-white mb-2">Workspace Prompts</h3>\n    </div>\n  );\n}`, language: "typescript" },
  { type: "file", path: "components/ProjectCard.tsx", name: "ProjectCard.tsx", parent: "components", content: `import React from "react";\n\nexport default function ProjectCard() {\n  return (\n    <div className="p-4 border border-white/5 bg-[#0B0B0F] rounded-xl text-left">\n      <span className="text-[8px] font-mono text-zinc-550 uppercase block mb-1">Status</span>\n    </div>\n  );\n}`, language: "typescript" },
  { type: "folder", path: "lib", name: "lib", content: "", language: "" },
  { type: "file", path: "lib/utils.ts", name: "utils.ts", parent: "lib", content: `export function clsx(...inputs: any[]) {\n  return inputs.filter(Boolean).join(" ");\n}`, language: "typescript" },
  { type: "folder", path: "hooks", name: "hooks", content: "", language: "" },
  { type: "file", path: "hooks/useAuth.ts", name: "useAuth.ts", parent: "hooks", content: `import { useState, useEffect } from "react";\n\nexport function useAuth() {\n  const [user, setUser] = useState<any>(null);\n  return { user, loading: false };\n}`, language: "typescript" },
  { type: "folder", path: "api", name: "api", content: "", language: "" },
  { type: "file", path: "api/auth.ts", name: "auth.ts", parent: "api", content: `import jwt\n\nSECRET = "mock_secret_key"\n\ndef verify(token: str):\n    try:\n        return jwt.decode(token, SECRET, algorithms=["HS256"])\n    except:\n        return None`, language: "python" },
  { type: "file", path: "api/projects.ts", name: "projects.ts", parent: "api", content: `from fastapi import APIRouter\n\nrouter = APIRouter()\n\n@router.get("/projects")\ndef list_projects():\n    return [{"id": 1, "name": "AI Assistant"}]`, language: "python" },
  { type: "file", path: "api/agents.ts", name: "agents.ts", parent: "api", content: `from fastapi import APIRouter\n\nrouter = APIRouter()\n\n@router.get("/agents")\ndef get_agents():\n    return [{"role": "CEO", "status": "Ready"}]`, language: "python" },
  { type: "folder", path: "database", name: "database", content: "", language: "" },
  { type: "file", path: "database/schema.sql", name: "schema.sql", parent: "database", content: `-- Database Schema Init DDL\n\nCREATE TABLE IF NOT EXISTS users (\n    id SERIAL PRIMARY KEY,\n    email VARCHAR(255) UNIQUE NOT NULL,\n    password_hash VARCHAR(255) NOT NULL,\n    role VARCHAR(50) DEFAULT 'user'\n);\n\nCREATE TABLE IF NOT EXISTS patients (\n    id SERIAL PRIMARY KEY,\n    name VARCHAR(255) NOT NULL,\n    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`, language: "sql" },
  { type: "folder", path: "public", name: "public", content: "", language: "" },
  { type: "file", path: "public/logo.svg", name: "logo.svg", parent: "public", content: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#4F7CFF" class="w-6 h-6">\n  <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a3 3 0 0 0-3-3H6.75m5.25 3h3.75a3 3 0 0 0 3-3H12m-3-3.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />\n</svg>`, language: "xml" }
];

interface TimelineMessage {
  id: string;
  time: string;
  agent: string;
  name: string;
  text: string;
  priority: "High" | "Medium" | "Low";
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  reasoning?: string;
  timestamp?: string;
  decision?: {
    title: string;
    question: string;
    answer: string;
    impact: string;
    alternatives: string;
    reasoning: string;
    tradeoffs: string;
    confidence: number;
    dependencies: string;
    futureImprovements: string;
  };
}

const MOCK_CONVERSATIONS: TimelineMessage[] = [
  {
    id: "m0",
    time: "17:33:02",
    agent: "CEO",
    name: "Aegis",
    text: "The clinic needs appointment schedules, active patient queues, and relational compliance locked down. Let's outline the requirements.",
    priority: "High",
    icon: Shield,
    iconColor: "text-indigo-400",
    decision: {
      title: "Clinic CRM Compliance",
      question: "Why enforce strict relational compliance for clinic records?",
      answer: "Medical record updates and scheduling actions require transactional consistency (ACID) to avoid duplicate appointments or mismatched patient history.",
      impact: "Guarantees zero-data concurrency anomalies in clinical queues.",
      alternatives: "NoSQL DB (MongoDB) - rejected due to lacking native cross-document transactions.",
      reasoning: "A clinic portal cannot tolerate eventual consistency. Relational integrity ensures that patients are checked into queues with unique scheduling constraints.",
      tradeoffs: "Higher read/write latency compared to flat document stores.",
      confidence: 98,
      dependencies: "PostgreSQL, pg-pool client",
      futureImprovements: "Implement replica read pools to distribute load during morning check-in rushes."
    }
  },
  {
    id: "m1",
    time: "17:33:10",
    agent: "Product Manager",
    name: "Scribe",
    text: "Breaking this into 12 user stories, mapping auth credentials, active check-in patient lists, and schema fields.",
    priority: "Medium",
    icon: FileText,
    iconColor: "text-purple-400",
    decision: {
      title: "Authentication Specs",
      question: "Why enforce individual user login rules over a generic kiosk portal?",
      answer: "Clinic administrators must audit scheduling updates. Individual logins allow tracking updates back to specific staff roles.",
      impact: "Satisfies compliance standards for patient medical record handling.",
      alternatives: "Shared kiosk codes - rejected due to high risk of accountability leaks.",
      reasoning: "Strict traceability prevents HIPAA violations and holds staff accountable for queue adjustments.",
      tradeoffs: "Requires initial overhead setup of multi-factor rules.",
      confidence: 95,
      dependencies: "NextAuth context, JSON Web Tokens",
      futureImprovements: "Add hardware token passkeys support next quarter."
    }
  },
  {
    id: "m2",
    time: "17:33:18",
    agent: "Architect",
    name: "Nexus",
    text: "Blueprints approved. Choosing Next.js App Router for layout scoping and FastAPI Python for high-performance backend controllers.",
    priority: "High",
    icon: Cpu,
    iconColor: "text-emerald-400",
    decision: {
      title: "Next.js + FastAPI",
      question: "Why choose Next.js and FastAPI over Next.js API Routes?",
      answer: "FastAPI is built on ASGI (uvicorn), yielding superior concurrency speeds for patient check-ins. It also compiles OpenAPI schema specs automatically.",
      impact: "Reduces server query latency from 85ms down to 12ms under heavy load.",
      alternatives: "Express.js / Node.js - rejected due to higher memory usage and slower numeric computation speed.",
      reasoning: "Decoupling front-end rendering from the core business logic allows the FastAPI microservice to scale independently on target containers.",
      tradeoffs: "Adds secondary deployment microservice routing layer.",
      confidence: 97,
      dependencies: "Python 3.11+, NextJS 16.2",
      futureImprovements: "Implement gRPC interface for low-level backend to database worker links."
    }
  },
  {
    id: "m3",
    time: "17:33:26",
    agent: "Database",
    name: "Schema",
    text: "Designing PostgreSQL relational tables. Scaffolding SQL migration schemas for users and patients.",
    priority: "High",
    icon: Database,
    iconColor: "text-blue-400",
    decision: {
      title: "PostgreSQL Selection",
      question: "Why choose PostgreSQL over SQL Server?",
      answer: "PostgreSQL offers advanced JSONB indices alongside typical relational tables, which allows structured patient profiling data without losing ACID compliance.",
      impact: "Allows high scalability of clinical metadata fields with minimal query latency.",
      alternatives: "SQL Server - rejected due to high proprietary licensing fees.",
      reasoning: "Open-source reliability with robust transactional extensions and index support simplifies dynamic column scaling.",
      tradeoffs: "Requires manual configurations of vacuums and connection pool limits.",
      confidence: 96,
      dependencies: "Postgres engine version 16.1",
      futureImprovements: "Enable pg_vector for cognitive search on patient symptoms reports."
    }
  },
  {
    id: "m4",
    time: "17:33:34",
    agent: "Backend",
    name: "Core",
    text: "Authentication endpoints generated. Structuring JWT verification methods and secure password hashing algorithms.",
    priority: "High",
    icon: Code,
    iconColor: "text-teal-400",
    decision: {
      title: "JWT Authentication",
      question: "Why choose stateless JWT tokens instead of session cookies?",
      answer: "JWT tokens avoid storing session maps in a server cache, allowing clinical queries to scale across load-balanced containers seamlessly.",
      impact: "Stateless scalability across multi-zone instances.",
      alternatives: "Redis Session Cookies - rejected due to extra infrastructure dependency costs.",
      reasoning: "By packing role parameters into the token, the client can route immediately with no database verification lookup required.",
      tradeoffs: "Tokens cannot be easily revoked before expiration without blocklists.",
      confidence: 94,
      dependencies: "python-jose, bcrypt",
      futureImprovements: "Integrate a short-lived access token with refresh token rotation protocols."
    }
  },
  {
    id: "m5",
    time: "17:33:42",
    agent: "Frontend",
    name: "Pixel",
    text: "Rendering Navbar layout wireframe. Injecting layout scope components and responsiveness toggles.",
    priority: "Medium",
    icon: Monitor,
    iconColor: "text-cyan-400",
    decision: {
      title: "Tailwind CSS Styling",
      question: "Why choose utility CSS frameworks instead of component packages?",
      answer: "Tailwind provides absolute styling freedom. It matches the high-end Figma layout templates with zero dependency bloat.",
      impact: "Shrinks build bundle size by 75% compared to CSS-in-JS libraries.",
      alternatives: "Material UI - rejected due to style limitations and heavy bundle overheads.",
      reasoning: "Utility styling ensures the layout remains extremely performant and responsive across multiple desktop browser targets.",
      tradeoffs: "Results in long className strings in components.",
      confidence: 98,
      dependencies: "PostCSS, Autoprefixer",
      futureImprovements: "Use CSS variables for absolute dark/light theme shifts."
    }
  },
  {
    id: "m6",
    time: "17:33:50",
    agent: "QA",
    name: "Spec",
    text: "Scaffolding clinic queues unit test cases. Preparing auth verification testing paths.",
    priority: "Medium",
    icon: CheckCircle,
    iconColor: "text-rose-400",
    decision: {
      title: "Automated Testing",
      question: "Why mandate 90% code coverage tests for clinic routing logic?",
      answer: "Patient queues are dynamic. Modifying layouts without robust route testing leads to scheduling drops during upgrades.",
      impact: "Ensures stability of patient check-in updates.",
      alternatives: "Manual QA verification - rejected due to scaling limits and human error risks.",
      reasoning: "Strict continuous integration testing blocks regressions before they reach production servers.",
      tradeoffs: "Increases development timeline metrics by roughly 15%.",
      confidence: 95,
      dependencies: "Jest, Testing Library",
      futureImprovements: "Implement end-to-end user tests using Playwright."
    }
  },
  {
    id: "m7",
    time: "17:33:58",
    agent: "Security",
    name: "Sentinel",
    text: "Running security audits. Token encryption parameters passed. Vulnerability scanner verified zero critical breaches.",
    priority: "High",
    icon: Lock,
    iconColor: "text-amber-400",
    decision: {
      title: "HS256 Token Encryption",
      question: "Why choose HS256 algorithms for jwt tokens?",
      answer: "HS256 leverages a symmetric key, providing high speed. With symmetric key rotation enabled, it delivers enterprise security standards.",
      impact: "Speeds up authorization verification by 3.2ms per call.",
      alternatives: "RS256 - rejected because asymmetric key cryptography is slower and wasn't required for internal client-api routing.",
      reasoning: "HS256 has a small payload and parses quickly on micro-instance targets.",
      tradeoffs: "Requires securing the shared secret on both API server and client.",
      confidence: 92,
      dependencies: "cryptography.io engine",
      futureImprovements: "Transition to RS256 once external third-party integration logs require read-only validation."
    }
  },
  {
    id: "m8",
    time: "17:34:06",
    agent: "DevOps",
    name: "Orbit",
    text: "Docker configurations ready. Scaffold Cloud Run target container configs for autoscaling.",
    priority: "Medium",
    icon: CloudLightning,
    iconColor: "text-orange-400",
    decision: {
      title: "Google Cloud Run Deployment",
      question: "Why deploy on Google Cloud Run instead of raw VM nodes?",
      answer: "Cloud Run handles scale-to-zero autoscaling. If clinical staff aren't logged in during night shifts, server running costs drop to zero.",
      impact: "Cuts infrastructure maintenance costs by 65%.",
      alternatives: "AWS EC2 instances - rejected due to continuous hourly running costs.",
      reasoning: "Serverless containers handle fluctuating clinic check-in schedules seamlessly without manual cluster load configuration setup.",
      tradeoffs: "Prone to slight cold start latency (approx 2s) on inactive services.",
      confidence: 96,
      dependencies: "gcloud sdk, Docker Engine",
      futureImprovements: "Enable minimum instance settings to bypass container cold start latencies."
    }
  },
  {
    id: "m9",
    time: "17:34:14",
    agent: "Reviewer",
    name: "Judge",
    text: "Final quality score 98% audit check passed. Architecture approved. Ready to deploy the clinical platform sandbox!",
    priority: "High",
    icon: Eye,
    iconColor: "text-fuchsia-400",
    decision: {
      title: "Quality Score Thresholds",
      question: "Why require a 95%+ QA and code quality score to build?",
      answer: "Clinic dashboards require clean layout code to ensure accessibility for nurse staff on low-resolution tablets.",
      impact: "Guarantees layout compliance and component durability.",
      alternatives: "Ad-hoc developer approval - rejected due to inconsistent code styling formats.",
      reasoning: "Standardizing dynamic linting thresholds guarantees maintainable code that third-party teams can easily read.",
      tradeoffs: "Minor delays during pull request reviews.",
      confidence: 98,
      dependencies: "ESLint ruleset, Prettier configuration",
      futureImprovements: "Automate code style linting checks using github action hooks."
    }
  }
];

// Mock File Tree Nodes
interface FileNode {
  name: string;
  path: string;
  isFolder: boolean;
  children?: FileNode[];
  content?: string;
  language?: string;
}

const FILE_TREE: FileNode[] = [
  {
    name: "app",
    path: "app",
    isFolder: true,
    children: [
      {
        name: "page.tsx",
        path: "app/page.tsx",
        isFolder: false,
        language: "typescript",
        content: `"use client";\n\nimport React, { useState } from "react";\nimport Header from "@/components/Header";\nimport Button from "@/components/Button";\n\nexport default function HomePage() {\n  const [patients, setPatients] = useState([\n    { id: 1, name: "Alice Johnson", time: "09:00 AM", status: "Checked In" },\n    { id: 2, name: "Robert Miller", time: "10:30 AM", status: "Scheduled" }\n  ]);\n  const [newPatient, setNewPatient] = useState("");\n\n  const addPatient = () => {\n    if (!newPatient.trim()) return;\n    setPatients([\n      ...patients,\n      { id: Date.now(), name: newPatient, time: "11:45 AM", status: "Scheduled" }\n    ]);\n    setNewPatient("");\n  };\n\n  return (\n    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">\n      <Header />\n      \n      <main className="flex-grow max-w-4xl w-full mx-auto p-8 space-y-10 text-left">\n        <div className="space-y-4">\n          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">\n            Clinic Core Management Dashboard\n          </h1>\n          <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">\n            Autonomous patient tracking scheduling, relational health schemas, and security-hardened authentication rules.\n          </p>\n        </div>\n\n        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">\n          {/* Form */}\n          <div className="p-6 bg-[#0B0B0F] border border-white/5 rounded-2xl space-y-4">\n            <h3 className="text-sm font-bold text-white">Register Patient</h3>\n            <div className="flex gap-2">\n              <input\n                type="text"\n                value={newPatient}\n                onChange={(e) => setNewPatient(e.target.value)}\n                placeholder="Patient Full Name"\n                className="flex-grow p-2 text-xs bg-[#050505] border border-white/5 rounded-lg text-white outline-none focus:border-cyan-400"\n              />\n              <Button label="Add" variant="primary" onClick={addPatient} />\n            </div>\n          </div>\n\n          {/* List */}\n          <div className="p-6 bg-[#0B0B0F] border border-white/5 rounded-2xl space-y-4">\n            <h3 className="text-sm font-bold text-white">Active Queue</h3>\n            <div className="space-y-2">\n              {patients.map(p => (\n                <div key={p.id} className="flex justify-between items-center p-2.5 bg-[#050505] border border-white/5 rounded-xl text-xs">\n                  <span>{p.name}</span>\n                  <div className="flex items-center space-x-2 text-zinc-500 font-mono text-[10px]">\n                    <span>{p.time}</span>\n                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold font-sans scale-90">{p.status}</span>\n                  </div>\n                </div>\n              ))}\n            </div>\n          </div>\n        </div>\n      </main>\n    </div>\n  );\n}`
      },
      {
        name: "layout.tsx",
        path: "app/layout.tsx",
        isFolder: false,
        language: "typescript",
        content: `import React from "react";\nimport "./globals.css";\n\nexport const metadata = {\n  title: "HealthPortal OS",\n  description: "Autonomous Clinic Management Operating System",\n};\n\nexport default function RootLayout({\n  children,\n}: {\n  children: React.ReactNode;\n}) {\n  return (\n    <html lang="en">\n      <body className="bg-[#050505] text-zinc-100 antialiased font-sans">\n        {children}\n      </body>\n    </html>\n  );\n}`
      },
      {
        name: "globals.css",
        path: "app/globals.css",
        isFolder: false,
        language: "css",
        content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n:root {\n  --background: #050505;\n  --foreground: #FFFFFF;\n}\n\nbody {\n  background: var(--background);\n  color: var(--foreground);\n}\n\n/* IDE Custom Scrollbars */\n::-webkit-scrollbar {\n  width: 6px;\n  height: 6px;\n}\n\n::-webkit-scrollbar-track {\n  background: #050505;\n}\n\n::-webkit-scrollbar-thumb {\n  background: #1C1C1F;\n  border-radius: 3px;\n}\n\n::-webkit-scrollbar-thumb:hover {\n  background: #27272A;\n}`
      }
    ]
  },
  {
    name: "components",
    path: "components",
    isFolder: true,
    children: [
      {
        name: "Header.tsx",
        path: "components/Header.tsx",
        isFolder: false,
        language: "typescript",
        content: `"use client";\n\nimport React from "react";\n\nexport default function Header() {\n  return (\n    <header className="w-full h-16 border-b border-white/5 bg-[#0B0B0F]/90 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-50">\n      <div className="flex items-center space-x-2">\n        <div className="h-6 w-6 rounded-md bg-cyan-400 flex items-center justify-center font-black text-xs text-[#050505]">H</div>\n        <span className="font-bold text-xs text-white">HealthPortal AI</span>\n      </div>\n      <nav className="flex space-x-6 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">\n        <a href="#overview" className="hover:text-white transition-colors">Overview</a>\n        <a href="#schedules" className="hover:text-white transition-colors">Schedules</a>\n        <a href="#patients" className="hover:text-white transition-colors">Patients</a>\n      </nav>\n      <button className="text-[10px] px-3.5 py-1.5 rounded-lg border border-white/5 bg-[#050505] text-zinc-350 hover:text-white transition-all font-bold">\n        Connected\n      </button>\n    </header>\n  );\n}`
      },
      {
        name: "Sidebar.tsx",
        path: "components/Sidebar.tsx",
        isFolder: false,
        language: "typescript",
        content: `"use client";\n\nimport React from "react";\n\nexport default function Sidebar() {\n  return (\n    <aside className="w-64 border-r border-white/5 bg-[#0B0B0F] p-4 text-zinc-400 font-sans">\n      <div className="space-y-4">\n        <div className="px-3 py-2">\n          <h2 className="mb-2 px-4 text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Dashboard</h2>\n          <div className="space-y-1 text-xs">\n            <button className="w-full text-left py-2 px-4 rounded-lg bg-zinc-900 text-white font-bold">Workspace</button>\n            <button className="w-full text-left py-2 px-4 rounded-lg hover:bg-zinc-900 hover:text-white transition-colors">Settings</button>\n          </div>\n        </div>\n      </div>\n    </aside>\n  );\n}`
      },
      {
        name: "Button.tsx",
        path: "components/Button.tsx",
        isFolder: false,
        language: "typescript",
        content: `import React from "react";\n\ninterface ButtonProps {\n  label: string;\n  variant?: "primary" | "secondary";\n  onClick?: () => void;\n}\n\nexport default function Button({ label, variant = "primary", onClick }: ButtonProps) {\n  const baseStyle = "px-4 py-2 rounded-lg text-[10px] font-bold transition-all hover:scale-102 cursor-pointer shadow-md";\n  const styles = variant === "primary"\n    ? "bg-cyan-400 text-[#050505] hover:bg-cyan-350 shadow-cyan-400/5"\n    : "bg-[#050505] border border-white/5 text-zinc-350 hover:bg-white/5 hover:text-white";\n\n  return (\n    <button onClick={onClick} className={\`\${baseStyle} \${styles}\`}>\n      {label}\n    </button>\n  );\n}`
      }
    ]
  },
  {
    name: "lib",
    path: "lib",
    isFolder: true,
    children: [
      {
        name: "utils.ts",
        path: "lib/utils.ts",
        isFolder: false,
        language: "typescript",
        content: `export function clsx(...inputs: any[]) {\n  return inputs.filter(Boolean).join(" ");\n}\n\nexport function formatTime(timeStr: string) {\n  return new Date(timeStr).toLocaleTimeString("en-US", {\n    hour: "2-digit",\n    minute: "2-digit"\n  });\n}`
      },
      {
        name: "api.ts",
        path: "lib/api.ts",
        isFolder: false,
        language: "typescript",
        content: `export async function request(path: string, method: string = "GET", body?: any) {\n  const res = await fetch(\`/api/v1\${path}\`, {\n    method,\n    headers: { "Content-Type": "application/json" },\n    body: body ? JSON.stringify(body) : null\n  });\n  if (!res.ok) throw new Error("API call failed");\n  return res.json();\n}`
      }
    ]
  },
  {
    name: "public",
    path: "public",
    isFolder: true,
    children: [
      {
        name: "logo.svg",
        path: "public/logo.svg",
        isFolder: false,
        language: "xml",
        content: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#4F7CFF" class="w-6 h-6">\n  <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a3 3 0 0 0-3-3H6.75m5.25 3h3.75a3 3 0 0 0 3-3H12m-3-3.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />\n</svg>`
      }
    ]
  },
  {
    name: "api",
    path: "api",
    isFolder: true,
    children: [
      {
        name: "main.py",
        path: "api/main.py",
        isFolder: false,
        language: "python",
        content: `from fastapi import FastAPI\nfrom fastapi.middleware.cors import CORSMiddleware\nfrom api.routes import router\n\napp = FastAPI(title="HealthPortal Core API", version="1.0.0")\n\napp.add_middleware(\n    CORSMiddleware,\n    allow_origins=["*"],\n    allow_methods=["*"],\n    allow_headers=["*"],\n)\n\napp.include_router(router, prefix="/api/v1")\n\n@app.get("/")\ndef health():\n    return {"status": "ok"}`
      },
      {
        name: "routes.py",
        path: "api/routes.py",
        isFolder: false,
        language: "python",
        content: `from fastapi import APIRouter\n\nrouter = APIRouter()\n\n@router.get("/patients")\ndef list_patients():\n    return [\n        {"id": 1, "name": "Alice Johnson", "status": "active"},\n        {"id": 2, "name": "Robert Miller", "status": "scheduled"}\n    ]`
      },
      {
        name: "auth.py",
        path: "api/auth.py",
        isFolder: false,
        language: "python",
        content: `import jwt\n\nSECRET = "mock_secret_key"\n\ndef verify(token: str):\n    try:\n        return jwt.decode(token, SECRET, algorithms=["HS256"])\n    except:\n        return None`
      }
    ]
  },
  {
    name: "database",
    path: "database",
    isFolder: true,
    children: [
      {
        name: "schema.sql",
        path: "database/schema.sql",
        isFolder: false,
        language: "sql",
        content: `-- Database Schema Init DDL\n\nCREATE TABLE IF NOT EXISTS users (\n    id SERIAL PRIMARY KEY,\n    email VARCHAR(255) UNIQUE NOT NULL,\n    password_hash VARCHAR(255) NOT NULL,\n    role VARCHAR(50) DEFAULT 'user'\n);\n\nCREATE TABLE IF NOT EXISTS patients (\n    id SERIAL PRIMARY KEY,\n    name VARCHAR(255) NOT NULL,\n    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`
      },
      {
        name: "connection.ts",
        path: "database/connection.ts",
        isFolder: false,
        language: "typescript",
        content: `import { Pool } from "pg";\n\nconst dbPool = new Pool({\n  connectionString: process.env.DATABASE_URL\n});\n\nexport default dbPool;`
      }
    ]
  }
];

const MarkdownPreview = ({ content }: { content: string }) => {
  const lines = content.split("\n");
  return (
    <div className="font-sans text-[11px] leading-relaxed text-zinc-350 space-y-3.5 select-text px-6 py-4 max-w-none text-left font-normal select-text">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        // H1 Heading
        if (trimmed.startsWith("# ")) {
          return <h1 key={idx} className="text-sm font-extrabold text-white border-b border-white/5 pb-1.5 pt-3 font-mono">{trimmed.substring(2)}</h1>;
        }
        // H2 Heading
        if (trimmed.startsWith("## ")) {
          return <h2 key={idx} className="text-xs font-bold text-white pt-2.5 font-mono">{trimmed.substring(3)}</h2>;
        }
        // H3 Heading
        if (trimmed.startsWith("### ")) {
          return <h3 key={idx} className="text-[10px] font-bold text-white pt-2 font-mono">{trimmed.substring(4)}</h3>;
        }
        // Lists
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={idx} className="flex items-start space-x-2 pl-3">
              <span className="text-primary mt-1.5">•</span>
              <span>{trimmed.substring(2)}</span>
            </div>
          );
        }
        // Horizontal Rule
        if (trimmed === "---") {
          return <hr key={idx} className="border-white/5 my-3" />;
        }
        // Empty lines
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }
        // Code blocks simple formatting
        if (trimmed.startsWith("```")) {
          return null; // Skip code fences
        }
        // Default text line
        let textParts: React.ReactNode = trimmed;
        if (trimmed.includes("**")) {
          const parts = trimmed.split(/\*\*([^*]+)\*\*/g);
          textParts = parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part);
        }
        return <p key={idx} className="leading-relaxed select-text">{textParts}</p>;
      })}
    </div>
  );
};

const renderHighlightedText = (text: string) => {
  if (!text) return "";
  
  // Highlight mentions like @CEO, @PM, @Architect, @Frontend, @Backend, @QA, @Reviewer
  const regex = /(@(?:CEO|PM|Architect|Frontend|Backend|QA|Reviewer|Product Manager|ProductManager))/gi;
  const parts = text.split(regex);
  
  return parts.map((part, i) => {
    if (part.startsWith("@")) {
      return (
        <span key={i} className="font-bold bg-primary/10 text-primary border border-primary/20 px-1 py-0.2 rounded font-mono text-[9px]">
          {part}
        </span>
      );
    }
    return part;
  });
};

const mapDbMessageToTimelineMessage = (dbMsg: any): TimelineMessage => {
  const roleName = dbMsg.role;
  const agentConfig = INITIAL_TEAM.find(
    a => a.role.toLowerCase() === roleName.toLowerCase() ||
         (a.role === "PM" && roleName === "Product Manager")
  );

  let rawText = dbMsg.content || "";
  let reasoning = "";
  try {
    const parsed = JSON.parse(rawText);
    if (parsed && typeof parsed === "object") {
      if (parsed.text) rawText = parsed.text;
      if (parsed.reasoning) reasoning = parsed.reasoning;
    }
  } catch {
    // Non-JSON format content
  }

  return {
    id: dbMsg.id || `msg-${Date.now()}`,
    time: dbMsg.created_at ? new Date(dbMsg.created_at).toLocaleTimeString() : new Date().toLocaleTimeString(),
    agent: roleName,
    name: agentConfig ? agentConfig.name : (roleName === "user" ? "You (User)" : roleName),
    text: rawText,
    priority: "Medium",
    icon: agentConfig ? agentConfig.icon : User,
    iconColor: agentConfig ? agentConfig.iconColor : "text-primary",
    reasoning: reasoning || undefined,
    timestamp: dbMsg.created_at || new Date().toISOString()
  };
};

function buildFileTree(files: any[]): FileNode[] {
  const root: FileNode[] = [];

  for (const file of files) {
    const parts = file.path.split("/");
    let currentLevel = root;
    let currentPath = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isLast = i === parts.length - 1;

      let node = currentLevel.find(n => n.name === part);
      if (!node) {
        node = {
          name: part,
          path: currentPath,
          isFolder: !isLast,
          ...(isLast ? {
            content: file.content,
            language: file.language || getLanguageFromFilename(part)
          } : {
            children: []
          })
        };
        currentLevel.push(node);
      }
      if (node.children) {
        currentLevel = node.children;
      }
    }
  }
  return root;
}

function filterFileTree(nodes: FileNode[], query: string): FileNode[] {
  if (!query) return nodes;
  const lowerQuery = query.toLowerCase();

  return nodes
    .map(node => {
      if (node.isFolder) {
        const filteredChildren = node.children ? filterFileTree(node.children, query) : [];
        if (filteredChildren.length > 0 || node.name.toLowerCase().includes(lowerQuery)) {
          return {
            ...node,
            children: filteredChildren
          };
        }
        return null;
      } else {
        if (node.name.toLowerCase().includes(lowerQuery) || node.path.toLowerCase().includes(lowerQuery)) {
          return node;
        }
        return null;
      }
    })
    .filter(Boolean) as FileNode[];
}

function getLanguageFromFilename(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "tsx" || ext === "ts") return "typescript";
  if (ext === "css") return "css";
  if (ext === "js" || ext === "jsx") return "javascript";
  if (ext === "json") return "json";
  if (ext === "md") return "markdown";
  if (ext === "html") return "html";
  return "text";
}

export default function WorkspacePage() {
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real Generated Code Files State
  const [generatedFiles, setGeneratedFiles] = useState<any[]>([]);
  const [generatedFilesLoading, setGeneratedFilesLoading] = useState(true);
  const [fileSearchQuery, setFileSearchQuery] = useState("");
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [visiblePaths, setVisiblePaths] = useState<string[]>([]);
  const [previewFilePath, setPreviewFilePath] = useState<string | null>(null);

  // Real Preview Runner States
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewStatus, setPreviewStatus] = useState<"idle" | "compiling" | "ready" | "failed">("idle");
  const [previewIframeKey, setPreviewIframeKey] = useState(0);
  const previewLogsEventSourceRef = useRef<EventSource | null>(null);

  // GitHub Publishing State
  const [publishStatus, setPublishStatus] = useState<"idle" | "creating_repo" | "uploading_files" | "creating_commit" | "success">("idle");
  const [publishedRepoUrl, setPublishedRepoUrl] = useState<string | null>(null);

  // Vercel Deployment State
  const [vercelUrl, setVercelUrl] = useState<string | null>(null);

  // Project Versions States
  const [projectVersions, setProjectVersions] = useState<any[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);

  // Active File Editor Compare States
  const [activeFileCompareVersionId, setActiveFileCompareVersionId] = useState<string | null>(null);
  const [activeFileCompareSnapshot, setActiveFileCompareSnapshot] = useState<any | null>(null);
  const [isLoadingActiveFileCompare, setIsLoadingActiveFileCompare] = useState(false);

  const dynamicFileTree = React.useMemo(() => {
    return buildFileTree(generatedFiles);
  }, [generatedFiles]);

  const filteredFileTree = React.useMemo(() => {
    return filterFileTree(dynamicFileTree, fileSearchQuery);
  }, [dynamicFileTree, fileSearchQuery]);

  // Real Realtime AI Timeline Conversation States
  const [newMessageText, setNewMessageText] = useState("");
  const [messagesLoading, setMessagesLoading] = useState(true);

  // Fetch conversations from database
  async function fetchMessages(projId: string) {
    setMessagesLoading(true);
    try {
      const response = await fetch(`/api/projects/${projId}/messages`);
      if (response.ok) {
        const data = await response.json();
        const mapped = (data || []).map((dbMsg: any) => mapDbMessageToTimelineMessage(dbMsg));
        setTimelineMessages(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setMessagesLoading(false);
    }
  }

  // Handle user sending custom feedback chat message to pipeline
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !project) return;

    const textToSend = newMessageText.trim();
    setNewMessageText("");

    const tempId = `temp-user-${Date.now()}`;
    const optimisticMsg: TimelineMessage = {
      id: tempId,
      time: new Date().toLocaleTimeString(),
      agent: "user",
      name: "You (User)",
      text: textToSend,
      priority: "Medium",
      icon: User,
      iconColor: "text-primary"
    };

    setTimelineMessages(prev => [...prev, optimisticMsg]);

    setIsGeneratingProject(true);
    const eventSource = startProgressSource(project.id);

    try {
      const response = await fetch(`/api/projects/${project.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("sb-access-token") || ""}`
        },
        body: JSON.stringify({
          role: "user",
          content: textToSend
        })
      });

      if (!response.ok) {
        throw new Error("Failed to save message.");
      }

      const assistantMsg = await response.json();
      if (assistantMsg) {
        const mappedAssistant = mapDbMessageToTimelineMessage(assistantMsg);
        setTimelineMessages(prev => {
          const clean = prev.filter(m => m.id !== tempId);
          const realUser: TimelineMessage = {
            ...optimisticMsg,
            id: assistantMsg.id ? `u-${assistantMsg.id}` : tempId
          };
          return [...clean, realUser, mappedAssistant];
        });
      } else {
        await fetchMessages(project.id);
      }
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setTimelineMessages(prev => prev.filter(m => m.id !== tempId));
      alert(err.message || "Failed to send message to database.");
    } finally {
      eventSource.close();
      setIsGeneratingProject(false);
    }
  };

  // Supabase Real Artifact Explorer States
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [artifactsLoading, setArtifactsLoading] = useState(true);
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);

  // Fetch real database artifacts
  async function fetchArtifacts(projId: string) {
    setArtifactsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projId}/artifacts`);
      if (response.ok) {
        const data = await response.json();
        setArtifacts(data || []);
        if (data && data.length > 0) {
          setSelectedArtifactId(data[0].id);
          setActiveTab(data[0].filename);
        }
      }
    } catch (err) {
      console.error("Failed to load artifacts:", err);
    } finally {
      setArtifactsLoading(false);
    }
  }

  const startPreview = async (projId: string) => {
    if (previewLogsEventSourceRef.current) {
      previewLogsEventSourceRef.current.close();
    }
    
    setPreviewStatus("compiling");
    setTerminalLogs(prev => [...prev, "→ Requesting compilation sandbox initialization..."]);
    
    try {
      const response = await fetch(`/api/projects/${projId}/preview`, { method: "POST" });
      if (!response.ok) {
        throw new Error("Failed to start preview server");
      }
      const data = await response.json();
      if (data.success && data.url) {
        setPreviewUrl(data.url);
        
        // Connect to SSE log stream
        const eventSource = new EventSource(`/api/projects/${projId}/preview/logs`);
        previewLogsEventSourceRef.current = eventSource;

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "status") {
              setPreviewStatus(data.message);
              if (data.message === "ready") {
                setPreviewIframeKey(prev => prev + 1);
                setTerminalLogs(prev => [...prev, "✓ Compilation finished. App ready inside viewport!"]);
              }
            } else if (data.message) {
              setTerminalLogs(prev => [...prev, data.message.trim()]);
            }
          } catch (e) {
            // parsing error
          }
        };

        eventSource.onerror = (err) => {
          console.error("Preview log stream error:", err);
          eventSource.close();
        };
      }
    } catch (err: any) {
      console.error("Preview start failed:", err);
      setPreviewStatus("failed");
      setTerminalLogs(prev => [...prev, `✗ Preview bootstrap failed: ${err.message || "Unknown error"}`]);
    }
  };

  useEffect(() => {
    return () => {
      if (previewLogsEventSourceRef.current) {
        previewLogsEventSourceRef.current.close();
      }
    };
  }, []);

  const fetchGeneratedFiles = async (projId: string, currentStatus?: string) => {
    setGeneratedFilesLoading(true);
    try {
      const res = await fetch(`/api/projects/${projId}/generate-code`);
      if (res.ok) {
        const data = await res.json();
        setGeneratedFiles(data || []);

        const statusCheck = currentStatus || project?.status;
        if ((!data || data.length === 0) && (statusCheck === "Completed" || statusCheck === "completed")) {
          console.log("Triggering auto code generation...");
          const genRes = await fetch(`/api/projects/${projId}/generate-code`, { method: "POST" });
          if (genRes.ok) {
            const genData = await genRes.json();
            if (genData.success && genData.files) {
              setGeneratedFiles(genData.files);
              startPreview(projId);
            }
          }
        } else if (data && data.length > 0 && (statusCheck === "Completed" || statusCheck === "completed")) {
          startPreview(projId);
        }
      }
    } catch (err) {
      console.error("Failed to load generated code files:", err);
    } finally {
      setGeneratedFilesLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("id");

    if (!projectId) {
      setError("No project ID specified in URL.");
      setLoading(false);
      return;
    }

    async function fetchProject() {
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("sb-access-token") || ""}`
          }
        });
        if (response.status === 404) {
          setError("Project not found");
          return;
        }
        if (!response.ok) {
          throw new Error("Failed to load project details.");
        }
        const data = await response.json();
        if (data.success && data.project) {
          setProject(data.project);
          if (data.project.tech_stack?.github_url) {
            setPublishedRepoUrl(data.project.tech_stack.github_url);
            setPublishStatus("success");
          }
          if (data.project.tech_stack?.vercel_url) {
            setVercelUrl(data.project.tech_stack.vercel_url);
          }
          fetchArtifacts(projectId!);
          fetchMessages(projectId!);
          fetchGeneratedFiles(projectId!, data.project.status);
          fetchVersions(projectId!);
        } else {
          setError("Project not found");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, []);

  useEffect(() => {
    if (generatedFiles.length > 0) {
      const paths: string[] = [];
      generatedFiles.forEach(f => {
        const parts = f.path.split("/");
        let current = "";
        parts.forEach((part: string) => {
          current = current ? `${current}/${part}` : part;
          if (!paths.includes(current)) {
            paths.push(current);
          }
        });
      });
      setVisiblePaths(paths);

      // Auto-preview app/page.tsx or first file
      if (!previewFilePath) {
        const defaultFile = generatedFiles.find(f => f.path === "app/page.tsx") || generatedFiles[0];
        if (defaultFile) {
          setPreviewFilePath(defaultFile.path);
        }
      }
    }
  }, [generatedFiles, previewFilePath]);

  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [simulationKey, setSimulationKey] = useState(0);
  const [hoveredAgentId, setHoveredAgentId] = useState<string | null>(null);

  // Live File Generation States
  const [generationStep, setGenerationStep] = useState(0);
  const [isGeneratingProject, setIsGeneratingProject] = useState(false);
  const [statusMap, setStatusMap] = useState<{ [path: string]: "generating" | "generated" }>({});
  const [centerExpandedFolders, setCenterExpandedFolders] = useState<{ [path: string]: boolean }>({
    app: true
  });

  // Timeline Conversation States
  const [timelineMessages, setTimelineMessages] = useState<TimelineMessage[]>([]);
  const [isTimelinePaused, setIsTimelinePaused] = useState(false);
  const [timelineSearch, setTimelineSearch] = useState("");
  const [timelineFilter, setTimelineFilter] = useState("all");
  const [activeDecision, setActiveDecision] = useState<TimelineMessage | null>(null);

  const timelineEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll timeline
  useEffect(() => {
    if (!isTimelinePaused) {
      timelineEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [timelineMessages, isTimelinePaused]);

  // Preview & App Compilation States
  const [centerViewTab, setCenterViewTab] = useState<"preview" | "code">("preview");
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [buildStage, setBuildStage] = useState<number>(1);
  const [buildTimelineStep, setBuildTimelineStep] = useState<
    "planning" | "architecture" | "database" | "backend" | "frontend" | "testing" | "deployment"
  >("planning");

  // Interactive Live App State inside Stage 5
  const [previewPatients, setPreviewPatients] = useState([
    { id: 1, name: "Alice Johnson", time: "09:00 AM", status: "Checked In" },
    { id: 2, name: "Robert Miller", time: "10:30 AM", status: "Scheduled" }
  ]);
  const [previewPatientName, setPreviewPatientName] = useState("");

  // Cockpit Workspace Polish States
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [quickFileSearchOpen, setQuickFileSearchOpen] = useState(false);
  const [reviewerModalOpen, setReviewerModalOpen] = useState(false);
  const [deployDashboardOpen, setDeployDashboardOpen] = useState(false);
  const [deployStage, setDeployStage] = useState(0);
  const [commandSearch, setCommandSearch] = useState("");
  const [fileSearch, setFileSearch] = useState("");

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes everything
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
        setQuickFileSearchOpen(false);
        setReviewerModalOpen(false);
        setDeployDashboardOpen(false);
        setActiveDecision(null);
      }

      // Ctrl+K / Cmd+K Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }

      // Ctrl+P / Cmd+P Quick File Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setQuickFileSearchOpen(prev => !prev);
      }

      // Ctrl+B / Cmd+B Toggle Sidebar Tree View
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setSidebarCollapsed(prev => !prev);
      }

      // Ctrl+/ / Cmd+/ Focus AI Prompt Search
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        const searchInput = document.getElementById("timeline-search-input") || document.getElementById("ai-prompt-input");
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const addPreviewPatient = () => {
    if (!previewPatientName.trim()) return;
    setPreviewPatients(prev => [
      ...prev,
      { id: Date.now(), name: previewPatientName, time: "11:45 AM", status: "Scheduled" }
    ]);
    setPreviewPatientName("");
  };

  const toggleCenterFolder = (folderPath: string) => {
    setCenterExpandedFolders(prev => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }));
  };

  const getTimelineStep = (idx: number): "planning" | "architecture" | "database" | "backend" | "frontend" | "testing" | "deployment" => {
    if (idx < 3) return "planning";
    if (idx < 6) return "architecture";
    if (idx < 9) return "database";
    if (idx < 13) return "backend";
    if (idx < 17) return "frontend";
    if (idx < 21) return "testing";
    return "deployment";
  };

  const getBuildStage = (idx: number): number => {
    if (idx < 6) return 1; // Stage 1: Skeleton
    if (idx < 10) return 2; // Stage 2: Navbar
    if (idx < 14) return 3; // Stage 3: Hero
    if (idx < 21) return 4; // Stage 4: Cards
    return 5; // Stage 5: Finished!
  };

  const startProgressSource = (projId: string, onFinish?: () => void) => {
    const eventSource = new EventSource(`/api/projects/${projId}/progress`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { agentName, status, progress, output, error } = data;

        setProject((prev: any) => prev ? { ...prev, status: `${agentName} (${progress}%)` } : null);

        if (agentName === "CEO" || agentName === "Product Manager") {
          setBuildTimelineStep("planning");
        } else if (agentName === "Architect") {
          setBuildTimelineStep("architecture");
        } else if (agentName === "Frontend") {
          setBuildTimelineStep("frontend");
        } else if (agentName === "Backend") {
          setBuildTimelineStep("backend");
        } else if (agentName === "QA") {
          setBuildTimelineStep("testing");
        } else if (agentName === "Reviewer") {
          setBuildTimelineStep("deployment");
        }

        setTeam(prevTeam => {
          return prevTeam.map(member => {
            const isMatch = member.role.toLowerCase() === agentName.toLowerCase() ||
              (member.role === "PM" && agentName === "Product Manager");
            if (isMatch) {
              return {
                ...member,
                status: status === "completed" ? "Completed" : status === "failed" ? "Waiting" : "Working",
                progress: status === "completed" ? 100 : progress,
                thinking: status === "running",
                thoughts: output || member.thoughts
              };
            }
            return member;
          });
        });

        const logPrefix = status === "completed" ? "✓" : status === "failed" ? "✗" : "→";
        const statusText = status === "completed" ? "finished successfully" : status === "failed" ? `failed: ${error || ""}` : "processing task...";
        setTerminalLogs(prev => [
          ...prev,
          `${logPrefix} [AGENT] ${agentName} ${statusText}. (Progress: ${progress}%)`
        ]);

        if (status === "completed" && output) {
          const agentConfig = INITIAL_TEAM.find(a => a.role.toLowerCase() === agentName.toLowerCase() || (a.role === "PM" && agentName === "Product Manager")) || INITIAL_TEAM[0];
          const newMsg: TimelineMessage = {
            id: `msg-${Date.now()}-${agentName}`,
            time: new Date().toLocaleTimeString(),
            agent: agentName,
            name: agentConfig.name,
            text: output.substring(0, 300) + (output.length > 300 ? "..." : ""),
            priority: "Medium",
            icon: agentConfig.icon,
            iconColor: agentConfig.iconColor
          };

          setTimelineMessages(prev => {
            if (prev.some(m => m.text === newMsg.text || (m.agent === newMsg.agent && m.text.substring(0, 20) === newMsg.text.substring(0, 20)))) {
              return prev;
            }
            return [...prev, newMsg];
          });
        }

        if (progress >= 100 && status === "completed") {
          eventSource.close();
          setIsGeneratingProject(false);
          setProject((prev: any) => prev ? { ...prev, status: "Completed" } : null);
          setBuildStage(5);
          fetchArtifacts(projId);
          setGeneratedFilesLoading(true);
          fetch(`/api/projects/${projId}/generate-code`, { method: "POST" })
            .then(res => res.json())
            .then(data => {
              if (data.success && data.files) {
                setGeneratedFiles(data.files);
                startPreview(projId);
              }
            })
            .catch(e => console.error("Auto generation error:", e))
            .finally(() => setGeneratedFilesLoading(false));
          runGenerationSimulation();
          onFinish?.();
        }

        if (status === "failed") {
          eventSource.close();
          setIsGeneratingProject(false);
          setProject((prev: any) => prev ? { ...prev, status: "failed" } : null);
        }

      } catch (err) {
        console.error("Failed to parse message event:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("Realtime progress stream dropped:", err);
      eventSource.close();
      setIsGeneratingProject(false);
      setProject((prev: any) => prev ? { ...prev, status: "failed" } : null);
    };

    return eventSource;
  };

  const runGenerationPipeline = () => {
    if (!project || isGeneratingProject) return;
    setIsGeneratingProject(true);

    setProject((prev: any) => prev ? { ...prev, status: "Running" } : null);
    setGenerationStep(0);
    setVisiblePaths([]);
    setStatusMap({});
    setPreviewFilePath(null);
    setCenterExpandedFolders({ app: true });
    setBuildStage(1);
    setBuildTimelineStep("planning");
    setPreviewPatients([
      { id: 1, name: "Alice Johnson", time: "09:00 AM", status: "Checked In" },
      { id: 2, name: "Robert Miller", time: "10:30 AM", status: "Scheduled" }
    ]);
    setTimelineMessages([]);
    setTerminalLogs([
      "System OS Initialized. Secure workspace sandbox online.",
      "Connecting to realtime AI Agent pipeline stream...",
    ]);

    // Fire off the run pipeline request asynchronously
    fetch(`/api/projects/${project.id}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("sb-access-token") || ""}`
      }
    }).catch(err => {
      console.error("POST run failed:", err);
    });

    startProgressSource(project.id);
  };

  const runGenerationSimulation = () => {
    if (isGeneratingProject) return;
    
    setIsGeneratingProject(true);
    setGenerationStep(0);
    setVisiblePaths([]);
    setStatusMap({});
    setPreviewFilePath(null);
    setCenterExpandedFolders({ app: true });
    
    // Reset browser compilation stages
    setBuildStage(1);
    setBuildTimelineStep("planning");
    setPreviewPatients([
      { id: 1, name: "Alice Johnson", time: "09:00 AM", status: "Checked In" },
      { id: 2, name: "Robert Miller", time: "10:30 AM", status: "Scheduled" }
    ]);
    
    // Reset timeline logs
    setTimelineMessages([]);

    let stepIdx = 0;
    
    const interval = setInterval(() => {
      if (stepIdx >= GENERATION_STEPS.length) {
        clearInterval(interval);
        setIsGeneratingProject(false);
        setBuildStage(5);
        setBuildTimelineStep("deployment");
        setReviewerModalOpen(true); // Launch Reviewer AI
        return;
      }

      const step = GENERATION_STEPS[stepIdx];
      
      // Update build stage and timeline highlight
      setBuildTimelineStep(getTimelineStep(stepIdx));
      setBuildStage(getBuildStage(stepIdx));

      // Sync messages streaming
      const messageMap: { [step: number]: number } = {
        0: 0,
        2: 1,
        4: 2,
        6: 3,
        9: 4,
        11: 5,
        13: 6,
        16: 7,
        19: 8,
        22: 9
      };

      if (messageMap[stepIdx] !== undefined) {
        const msgIdx = messageMap[stepIdx];
        const msg = MOCK_CONVERSATIONS[msgIdx];
        
        setTimelineMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }

      // Add folder or file
      setVisiblePaths(prev => {
        if (prev.includes(step.path)) return prev;
        return [...prev, step.path];
      });

      if (step.type === "folder") {
        setCenterExpandedFolders(prev => ({ ...prev, [step.path]: true }));
        stepIdx += 1;
        setGenerationStep(stepIdx);
      } else {
        // file starts generating
        setStatusMap(prev => ({ ...prev, [step.path]: "generating" }));
        setPreviewFilePath(step.path);

        setTimeout(() => {
          setStatusMap(prev => ({ ...prev, [step.path]: "generated" }));
          stepIdx += 1;
          setGenerationStep(stepIdx);
        }, 400); // 400ms generation per file
      }

    }, 850); // 850ms interval between items
  };

  const renderCockpitTree = (nodes: FileNode[]) => {
    return (
      <div className="space-y-1.5 pl-1 font-mono text-[11px]">
        {nodes.map(node => {
          const isPathVisible = visiblePaths.includes(node.path);
          if (!isPathVisible) return null;

          if (node.isFolder) {
            const isExpanded = centerExpandedFolders[node.path];
            return (
              <motion.div
                key={node.path}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1"
              >
                <button
                  onClick={() => toggleCenterFolder(node.path)}
                  className="w-full flex items-center space-x-2 py-1 px-1.5 rounded hover:bg-white/4 text-zinc-350 hover:text-white transition-colors cursor-pointer text-left font-bold"
                >
                  {isExpanded ? <ChevronDown className="h-3.5 w-3.5 text-zinc-550" /> : <ChevronRight className="h-3.5 w-3.5 text-zinc-550" />}
                  {isExpanded ? <FolderOpen className="h-4 w-4 text-cyan-500" /> : <Folder className="h-4 w-4 text-cyan-600" />}
                  <span className="truncate">{node.name}/</span>
                </button>

                {isExpanded && node.children && (
                  <div className="pl-4 border-l border-white/5 ml-2.5">
                    {renderCockpitTree(node.children)}
                  </div>
                )}
              </motion.div>
            );
          } else {
            const isSelected = previewFilePath === node.path;
            const status = statusMap[node.path];
            const isGenerating = status === "generating";
            
            return (
              <motion.button
                key={node.path}
                onClick={() => setPreviewFilePath(node.path)}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`w-full flex items-center justify-between py-1 px-1.5 rounded transition-all text-left ${
                  isSelected
                    ? "bg-primary/10 border-l-2 border-primary text-white font-medium pl-1"
                    : "hover:bg-white/4 text-zinc-400 hover:text-white"
                } cursor-pointer`}
              >
                <div className="flex items-center space-x-2 truncate">
                  {getFileIcon(node.name)}
                  <span className="truncate">{node.name}</span>
                </div>

                <div className="flex items-center space-x-2 font-mono text-[9px] flex-shrink-0 scale-90 select-none">
                  {isGenerating ? (
                    <span className="flex items-center gap-1.5 text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded animate-pulse">
                      <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                      <span>⚡ Generating...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-success bg-success/10 border border-success/20 px-1.5 py-0.5 rounded font-bold">
                      <Check className="h-2.5 w-2.5" />
                      <span>✓ Generated</span>
                    </span>
                  )}
                </div>
              </motion.button>
            );
          }
        })}
      </div>
    );
  };

  // Initialize team simulation
  useEffect(() => {
    const baseTeam = INITIAL_TEAM.map(member => {
      let initialTask = "Waiting...";
      if (member.role === "CEO") initialTask = "Awaiting vision brief...";
      if (member.role === "Product Manager") initialTask = "Awaiting business logic...";
      if (member.role === "Architect") initialTask = "Awaiting PRD documents...";
      if (member.role === "Database") initialTask = "Awaiting database layout...";
      if (member.role === "Frontend") initialTask = "Waiting for architecture...";
      if (member.role === "Backend") initialTask = "Awaiting service endpoints...";
      
      return {
        ...member,
        status: "Waiting" as const,
        progress: 0,
        thinking: false,
        elapsed: 0,
        task: initialTask
      };
    });
    setTeam(baseTeam);

    let tick = 0;
    const interval = setInterval(() => {
      tick += 1;
      
      setTeam(prevTeam => {
        if (prevTeam.length === 0) return prevTeam;
        return prevTeam.map(member => {
          // CEO Simulation
          if (member.role === "CEO") {
            if (tick >= 1 && tick < 5) {
              const progress = Math.min(tick * 25, 100);
              const status = progress === 100 ? "Reviewing" : "Working";
              return {
                ...member,
                status: status as any,
                progress,
                thinking: progress < 100,
                task: "Understanding business requirements...",
                elapsed: tick
              };
            } else if (tick >= 5) {
              return {
                ...member,
                status: "Completed" as const,
                progress: 100,
                thinking: false,
                task: "Understanding business requirements...",
                elapsed: 8
              };
            }
          }

          // PM Simulation
          if (member.role === "Product Manager") {
            if (tick >= 5) {
              const elapsed = tick - 5;
              const progress = Math.min(elapsed * 15, 72);
              return {
                ...member,
                status: "Working" as const,
                progress,
                thinking: true,
                task: "Generating Product Requirements...",
                elapsed
              };
            }
          }

          // Architect Simulation
          if (member.role === "Architect") {
            if (tick >= 6) {
              const elapsed = tick - 6;
              const progress = Math.min(elapsed * 10, 43);
              return {
                ...member,
                status: "Working" as const,
                progress,
                thinking: true,
                task: "Designing system architecture...",
                elapsed
              };
            }
          }

          // Backend Simulation
          if (member.role === "Backend") {
            if (tick >= 8) {
              const elapsed = tick - 8;
              const progress = Math.min(elapsed * 5, 15);
              return {
                ...member,
                status: "Working" as const,
                progress,
                thinking: true,
                task: "Preparing API contracts...",
                elapsed
              };
            }
          }

          // Database Simulation
          if (member.role === "Database") {
            if (tick >= 9) {
              const elapsed = tick - 9;
              const progress = Math.min(elapsed * 3, 8);
              return {
                ...member,
                status: "Working" as const,
                progress,
                thinking: true,
                task: "Creating schema...",
                elapsed
              };
            }
          }

          // Frontend remains waiting for architecture
          if (member.role === "Frontend") {
            if (tick >= 6) {
              return {
                ...member,
                status: "Waiting" as const,
                task: "Waiting for architecture...",
                progress: 0,
                thinking: false
              };
            }
          }

          // Others remain waiting
          return member;
        });
      });

      if (tick >= 25) {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [simulationKey]);

  // Running elapsed timer for working agents
  useEffect(() => {
    const timer = setInterval(() => {
      setTeam(prevTeam => {
        if (prevTeam.length === 0) return prevTeam;
        return prevTeam.map(member => {
          if (member.status === "Working" || member.status === "Reviewing") {
            return {
              ...member,
              elapsed: member.elapsed + 1
            };
          }
          return member;
        });
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const restartSimulation = () => {
    setSimulationKey(prev => prev + 1);
  };

  // Navigation / Sidebar tabs
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<string>("explorer");
  const [expandedFolders, setExpandedFolders] = useState<{ [path: string]: boolean }>({
    app: true,
    components: false,
    lib: false,
    api: false,
    database: false
  });

  // Editor Multi-Tab State
  const [openTabs, setOpenTabs] = useState<string[]>(["overview"]);
  const [activeTab, setActiveTab] = useState<string>("overview");



  // Project prompt info (retrieved/mocked from local context)
  const promptText = project?.prompt || "Build a clinic management SaaS portal with real-time patient queue, appointment schedules, Relational PostgreSQL db structure, secure routing verification and deployments.";
  
  // Terminal simulator logs
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "System OS Initialized. Workspace sandbox online.",
    "✓ Creating folder structure...",
    "✓ Mapping database entities...",
    "✓ Installing dependencies... (next, react, fastapi, prisma, tailwindcss)",
    "✓ Compiling core layout blueprints...",
    "✓ Running validation test suites...",
    "✓ Workspace ready."
  ]);
  const [isDeploying, setIsDeploying] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Preview browser view states
  const [previewOpen, setPreviewOpen] = useState(false);
  const [demoPatients, setDemoPatients] = useState([
    { id: 1, name: "Alice Johnson", time: "09:00 AM", status: "Checked In" },
    { id: 2, name: "Robert Miller", time: "10:30 AM", status: "Scheduled" }
  ]);
  const [demoInput, setDemoInput] = useState("");

  // Share system notice
  const [shareNotice, setShareNotice] = useState(false);

  // Auto-scroll logs
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  // Folder toggle handler
  const toggleFolder = (folderPath: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }));
  };

  // Tab interaction handlers
  const openFileTab = (filePath: string) => {
    if (!openTabs.includes(filePath)) {
      setOpenTabs([...openTabs, filePath]);
    }
    setActiveTab(filePath);
  };

  const closeFileTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabId === "overview") return; // cannot close home overview
    const newTabs = openTabs.filter(t => t !== tabId);
    setOpenTabs(newTabs);
    if (activeTab === tabId) {
      setActiveTab(newTabs[newTabs.length - 1] || "overview");
    }
  };

  const handleDeployReal = async () => {
    if (isDeploying) return;
    if (!publishedRepoUrl) {
      alert("Please publish the project to GitHub first before deploying.");
      setTerminalLogs(prev => [...prev, "✗ Deployment cancelled: Project must be published to GitHub first."]);
      return;
    }

    setIsDeploying(true);
    setDeployDashboardOpen(true);
    setDeployStage(0);
    setTerminalLogs(prev => [
      ...prev,
      "",
      "→ Initializing production Vercel cloud run deployment...",
      `→ Repository target: ${publishedRepoUrl}`
    ]);

    try {
      const response = await fetch(`/api/projects/${project.id}/deploy`, { method: "POST" });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Deployment trigger failed");
      }
      
      const triggerData = await response.json();
      const deployId = triggerData.deploymentId;
      const initialUrl = triggerData.deploymentUrl;
      setVercelUrl(initialUrl);
      setTerminalLogs(prev => [...prev, `✓ Vercel build session registered: ${deployId}`, `→ Assigned Endpoint: ${initialUrl}`]);

      // Start status polling loop
      let lastLogCount = 0;
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/projects/${project.id}/deploy`);
          if (!statusRes.ok) return;
          const statusData = await statusRes.json();
          
          const currentStatus = statusData.status;
          const currentUrl = statusData.deploymentUrl;
          const currentLogs = statusData.logs || [];
          
          if (currentUrl) setVercelUrl(currentUrl);

          // Append new logs to the terminal cockpit
          if (currentLogs.length > lastLogCount) {
            const newLogs = currentLogs.slice(lastLogCount);
            setTerminalLogs(prev => [...prev, ...newLogs]);
            lastLogCount = currentLogs.length;
          }

          // Advance stepper stages based on Vercel deployment status
          if (currentStatus === "queued") {
            setDeployStage(0);
          } else if (currentStatus === "building") {
            setDeployStage(prev => (prev < 5 ? prev + 1 : 5));
          } else if (currentStatus === "ready") {
            setDeployStage(6);
            setIsDeploying(false);
            setTerminalLogs(prev => [
              ...prev,
              "✓ Vercel deployment successful!",
              `[DEPLOY] Live URL: ${currentUrl}`,
              "✓ Ready."
            ]);
            
            // Also update local project tech_stack object
            setProject((prevProj: any) => {
              if (!prevProj) return null;
              return {
                ...prevProj,
                tech_stack: {
                  ...(prevProj.tech_stack || {}),
                  vercel_url: currentUrl,
                  vercel_status: "ready"
                }
              };
            });

            clearInterval(pollInterval);
          } else if (currentStatus === "error" || currentStatus === "failed") {
            setDeployStage(0);
            setIsDeploying(false);
            setTerminalLogs(prev => [...prev, "✗ Vercel build failed. Review log trace in terminal output."]);
            alert("Vercel build failed. Review log trace in terminal output.");
            clearInterval(pollInterval);
          }
        } catch (pollErr) {
          console.error("Vercel polling error:", pollErr);
        }
      }, 2500);
      
    } catch (err: any) {
      console.error("Vercel deployment failed:", err);
      setIsDeploying(false);
      setDeployDashboardOpen(false);
      setTerminalLogs(prev => [...prev, `✗ Deploy failed: ${err.message || "Unknown error"}`]);
      alert(`Deploy failed: ${err.message || "Unknown error"}`);
    }
  };

  // Find active file node
  const findFileNode = (nodes: FileNode[], path: string): FileNode | null => {
    for (const node of nodes) {
      if (node.path === path) return node;
      if (node.children) {
        const found = findFileNode(node.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  const activeFileNode = activeTab !== "overview" ? findFileNode(FILE_TREE, activeTab) : null;
  const activeArtifact = artifacts.find(a => a.filename === activeTab);

  // Custom code syntax renderer mockup
  const renderSyntaxHighlightedCode = (code: string) => {
    const lines = code.split("\n");
    return (
      <div className="font-mono text-[11px] leading-relaxed text-zinc-350 select-text pr-4">
        {lines.map((line, idx) => {
          // Simplistic coloring rules for visual aesthetics
          let lineContent: React.ReactNode = line;
          
          if (line.trim().startsWith("//") || line.trim().startsWith("#") || line.trim().startsWith("--")) {
            lineContent = <span className="text-zinc-550 italic">{line}</span>;
          } else {
            // keywords
            const regexKeywords = /(import|export|from|default|function|const|let|return|async|await|class|def|from|import|CREATE|TABLE|PRIMARY|KEY|IF|NOT|EXISTS|VARCHAR|INT|TIMESTAMP|SERIAL)/g;
            // string literals
            const regexStrings = /(["'`][^"'`]*["'`])/g;
            
            // basic highlight replacements
            let highlighted = line;
            // Replace strings
            highlighted = highlighted.replace(regexStrings, '##STR_START##$1##STR_END##');
            // Replace keywords
            highlighted = highlighted.replace(regexKeywords, '##KEY_START##$1##KEY_END##');

            // Render JSX parts
            const parts = highlighted.split(/(##(?:STR|KEY)_(?:START|END)##)/);
            let state: "normal" | "string" | "keyword" = "normal";
            
            lineContent = parts.map((part, i) => {
              if (part === "##STR_START##") { state = "string"; return null; }
              if (part === "##STR_END##") { state = "normal"; return null; }
              if (part === "##KEY_START##") { state = "keyword"; return null; }
              if (part === "##KEY_END##") { state = "normal"; return null; }

              if (state === "string") return <span key={i} className="text-amber-350">{part}</span>;
              if (state === "keyword") return <span key={i} className="text-cyan-400 font-bold">{part}</span>;
              return <span key={i}>{part}</span>;
            });
          }

          return (
            <div key={idx} className="flex hover:bg-white/2 transition-colors">
              <span className="w-9 text-zinc-650 text-right select-none pr-3 font-mono text-[10px] leading-relaxed">{idx + 1}</span>
              <span className="flex-grow whitespace-pre">{lineContent}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Tree View Renderer component helper
  const renderTreeNodes = (nodes: FileNode[]) => {
    return (
      <div className="space-y-1 pl-1">
        {nodes.map(node => {
          if (node.isFolder) {
            const isExpanded = expandedFolders[node.path];
            return (
              <div key={node.path} className="space-y-1">
                <button
                  onClick={() => toggleFolder(node.path)}
                  className="w-full flex items-center space-x-1.5 py-1 px-1.5 rounded hover:bg-white/2 text-zinc-350 hover:text-white transition-colors cursor-pointer text-left text-xs font-semibold"
                >
                  {isExpanded ? <ChevronDown className="h-3 w-3 text-zinc-550" /> : <ChevronRight className="h-3 w-3 text-zinc-550" />}
                  {isExpanded ? <FolderOpen className="h-3.5 w-3.5 text-cyan-500" /> : <Folder className="h-3.5 w-3.5 text-cyan-600" />}
                  <span className="truncate">{node.name}/</span>
                </button>

                {isExpanded && node.children && (
                  <div className="pl-3.5 border-l border-white/5 ml-2.5">
                    {renderTreeNodes(node.children)}
                  </div>
                )}
              </div>
            );
          } else {
            const isTabActive = activeTab === node.path;
            return (
              <button
                key={node.path}
                onClick={() => openFileTab(node.path)}
                className={`w-full flex items-center space-x-2 py-1 px-1.5 rounded transition-colors text-left text-xs ${
                  isTabActive
                    ? "bg-primary/10 border-l border-primary text-white font-medium pl-1"
                    : "hover:bg-white/2 text-zinc-400 hover:text-white"
                } cursor-pointer`}
              >
                {getFileIcon(node.name)}
                <span className="truncate">{node.name}</span>
              </button>
            );
          }
        })}
      </div>
    );
  };
  // Helper trigger for Share notice copy link
  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareNotice(true);
    setTimeout(() => setShareNotice(false), 2000);
  };

  const handleDownloadZip = async () => {
    if (isDownloadingZip) return;
    setIsDownloadingZip(true);
    setTerminalLogs(prev => [...prev, "→ Preparing project ZIP archive for export..."]);
    try {
      const response = await fetch(`/api/projects/${project.id}/download`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Download failed");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeTitle = project.title.replace(/[^a-zA-Z0-9]/g, "_");
      a.download = `${safeTitle}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setTerminalLogs(prev => [...prev, "✓ Project ZIP exported successfully!"]);
    } catch (err: any) {
      console.error("Download error:", err);
      setTerminalLogs(prev => [...prev, `✗ Export failed: ${err.message || "Unknown error"}`]);
      alert(`Export failed: ${err.message || "Unknown error"}`);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const handlePublishGithub = async () => {
    if (publishStatus !== "idle" && publishStatus !== "success") return;
    setPublishStatus("creating_repo");
    setTerminalLogs(prev => [...prev, "→ Initializing GitHub OAuth repository build..."]);
    
    // Simulate progression for smooth user visual guide
    const statusTimeout1 = setTimeout(() => {
      setPublishStatus("uploading_files");
      setTerminalLogs(prev => [...prev, "→ Writing code files to GitHub blob tree..."]);
    }, 1500);

    const statusTimeout2 = setTimeout(() => {
      setPublishStatus("creating_commit");
      setTerminalLogs(prev => [...prev, "→ Packaging git commit reference heads..."]);
    }, 3000);

    try {
      const response = await fetch(`/api/projects/${project.id}/publish`, { method: "POST" });
      clearTimeout(statusTimeout1);
      clearTimeout(statusTimeout2);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "GitHub publishing failed");
      }
      
      const data = await response.json();
      if (data.success && data.repositoryUrl) {
        setPublishStatus("success");
        setPublishedRepoUrl(data.repositoryUrl);
        setTerminalLogs(prev => [
          ...prev,
          `✓ GitHub repository created successfully: ${data.repositoryUrl}`,
          `✓ Commit created: ${data.commitSha.slice(0, 7)} on branch ${data.branch}`
        ]);
        
        // Update local project tech_stack object
        setProject((prev: any) => {
          if (!prev) return null;
          return {
            ...prev,
            tech_stack: {
              ...(prev.tech_stack || {}),
              github_url: data.repositoryUrl
            }
          };
        });
      }
    } catch (err: any) {
      clearTimeout(statusTimeout1);
      clearTimeout(statusTimeout2);
      console.error("GitHub publish error:", err);
      setPublishStatus("idle");
      setTerminalLogs(prev => [...prev, `✗ GitHub publishing failed: ${err.message || "Unknown error"}`]);
      alert(`GitHub publishing failed: ${err.message || "Unknown error"}`);
    }
  };

  // Version comparison states
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareLeft, setCompareLeft] = useState<string | null>(null);
  const [compareRight, setCompareRight] = useState<string | null>(null);
  const [leftSnapshot, setLeftSnapshot] = useState<any | null>(null);
  const [rightSnapshot, setRightSnapshot] = useState<any | null>(null);
  const [isLoadingCompare, setIsLoadingCompare] = useState(false);
  const [selectedCompareFile, setSelectedCompareFile] = useState<string | null>(null);

  const fetchVersions = async (projId: string) => {
    setIsLoadingVersions(true);
    try {
      const res = await fetch(`/api/projects/${projId}/versions`);
      if (res.ok) {
        const data = await res.json();
        setProjectVersions(data || []);
      }
    } catch (err) {
      console.error("Failed to load versions:", err);
    } finally {
      setIsLoadingVersions(false);
    }
  };

  const handleRestoreVersion = async (versionId: string, verNum: number) => {
    const confirmRestore = confirm(`Are you sure you want to restore the workspace to Version ${verNum}? This will overwrite all current files and conversation history.`);
    if (!confirmRestore) return;

    setTerminalLogs(prev => [...prev, `→ Restoring workspace back to Version ${verNum}...`]);
    try {
      const res = await fetch(`/api/projects/${project.id}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId })
      });

      if (!res.ok) {
        throw new Error("Restore failed");
      }

      setTerminalLogs(prev => [...prev, `✓ Successfully rollbacked workspace to Version ${verNum}!`, "→ Reloading active resources..."]);
      
      // Re-fetch project datasets to sync the frontend
      fetchArtifacts(project.id);
      fetchMessages(project.id);
      fetchGeneratedFiles(project.id, project.status);
      fetchVersions(project.id);
      
      alert(`Workspace rollbacked to Version ${verNum} successfully!`);
    } catch (err: any) {
      console.error(err);
      alert(`Failed to restore version: ${err.message || "Unknown error"}`);
    }
  };

  const handleDeleteVersion = async (versionId: string, verNum: number) => {
    const confirmDel = confirm(`Are you sure you want to delete Version ${verNum} from history?`);
    if (!confirmDel) return;

    try {
      const res = await fetch(`/api/projects/${project.id}/versions?versionId=${versionId}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error("Deletion failed");
      }

      setProjectVersions(prev => prev.filter(v => v.id !== versionId));
      setTerminalLogs(prev => [...prev, `✓ Deleted Version ${verNum} from history logs.`]);
    } catch (err: any) {
      console.error(err);
      alert(`Failed to delete version: ${err.message || "Unknown error"}`);
    }
  };

  useEffect(() => {
    if (!compareOpen) return;
    
    async function loadLeft() {
      if (!compareLeft) {
        setLeftSnapshot(null);
        return;
      }
      setIsLoadingCompare(true);
      try {
        const res = await fetch(`/api/projects/${project.id}/restore?versionId=${compareLeft}`);
        if (res.ok) {
          const data = await res.json();
          setLeftSnapshot(data.version);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingCompare(false);
      }
    }
    loadLeft();
  }, [compareLeft, compareOpen]);

  useEffect(() => {
    if (!compareOpen) return;
    
    async function loadRight() {
      if (!compareRight) {
        setRightSnapshot(null);
        return;
      }
      setIsLoadingCompare(true);
      try {
        const res = await fetch(`/api/projects/${project.id}/restore?versionId=${compareRight}`);
        if (res.ok) {
          const data = await res.json();
          setRightSnapshot(data.version);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingCompare(false);
      }
    }
    loadRight();
  }, [compareRight, compareOpen]);

  const comparedFilesList = React.useMemo(() => {
    if (!leftSnapshot || !rightSnapshot) return [];

    const leftFiles = leftSnapshot.files || [];
    const rightFiles = rightSnapshot.files || [];

    const leftMap = new Map<string, string>(leftFiles.map((f: any) => [f.path as string, f.content as string]));
    const rightMap = new Map<string, string>(rightFiles.map((f: any) => [f.path as string, f.content as string]));

    const allPaths = Array.from(new Set<string>([...leftMap.keys(), ...rightMap.keys()]));

    return allPaths.map((path: string) => {
      const leftContent = leftMap.get(path);
      const rightContent = rightMap.get(path);

      let status: "added" | "deleted" | "modified" | "unchanged" = "unchanged";
      if (leftContent === undefined && rightContent !== undefined) {
        status = "added";
      } else if (leftContent !== undefined && rightContent === undefined) {
        status = "deleted";
      } else if (leftContent !== rightContent) {
        status = "modified";
      }

      return {
        path,
        leftContent: leftContent || "",
        rightContent: rightContent || "",
        status
      };
    });
  }, [leftSnapshot, rightSnapshot]);

  const activeCompareFile = comparedFilesList.find(f => f.path === selectedCompareFile) || comparedFilesList[0];

  // Load target active file comparison snapshot when ID changes
  useEffect(() => {
    if (!activeFileCompareVersionId) {
      setActiveFileCompareSnapshot(null);
      return;
    }
    
    async function loadSnapshot() {
      setIsLoadingActiveFileCompare(true);
      try {
        const res = await fetch(`/api/projects/${project.id}/restore?versionId=${activeFileCompareVersionId}`);
        if (res.ok) {
          const data = await res.json();
          setActiveFileCompareSnapshot(data.version);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingActiveFileCompare(false);
      }
    }
    loadSnapshot();
  }, [activeFileCompareVersionId]);

  const baseCompareFileContent = React.useMemo(() => {
    if (!activeFileCompareSnapshot || !activeFileNode) return null;
    const files = activeFileCompareSnapshot.files || [];
    const matched = files.find((f: any) => f.path === activeFileNode.path);
    return matched ? matched.content : "";
  }, [activeFileCompareSnapshot, activeFileNode]);

  const computeLineDiff = (oldStr: string, newStr: string) => {
    interface DiffLine {
      type: "added" | "removed" | "modified" | "unchanged";
      leftNum?: number;
      rightNum?: number;
      leftContent?: string;
      rightContent?: string;
    }

    const oldLines = oldStr.split("\n");
    const newLines = newStr.split("\n");

    const dp: number[][] = Array.from({ length: oldLines.length + 1 }, () =>
      Array(newLines.length + 1).fill(0)
    );

    for (let i = 1; i <= oldLines.length; i++) {
      for (let j = 1; j <= newLines.length; j++) {
        if (oldLines[i - 1] === newLines[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    const result: DiffLine[] = [];
    let i = oldLines.length;
    let j = newLines.length;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
        result.unshift({
          type: "unchanged",
          leftNum: i,
          rightNum: j,
          leftContent: oldLines[i - 1],
          rightContent: newLines[j - 1]
        });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        result.unshift({
          type: "added",
          rightNum: j,
          rightContent: newLines[j - 1]
        });
        j--;
      } else {
        result.unshift({
          type: "removed",
          leftNum: i,
          leftContent: oldLines[i - 1]
        });
        i--;
      }
    }

    const finalResult: DiffLine[] = [];
    for (let k = 0; k < result.length; k++) {
      const current = result[k];
      const next = result[k + 1];

      if (current.type === "removed" && next && next.type === "added") {
        finalResult.push({
          type: "modified",
          leftNum: current.leftNum,
          rightNum: next.rightNum,
          leftContent: current.leftContent,
          rightContent: next.rightContent
        });
        k++;
      } else {
        finalResult.push(current);
      }
    }

    return finalResult;
  };

  const renderSideBySideDiff = (baseCode: string, currentCode: string) => {
    const diffLines = computeLineDiff(baseCode, currentCode);

    return (
      <div className="font-mono text-[11px] leading-relaxed text-zinc-350 select-text w-full">
        {/* Split grid header */}
        <div className="flex border-b border-white/5 pb-2 mb-2 text-zinc-550 select-none text-[9px] font-bold uppercase tracking-wider">
          <div className="w-1/2 pr-3 flex justify-between">
            <span>Base Version (Left)</span>
            <span>Lines</span>
          </div>
          <div className="w-1/2 pl-3 flex justify-between">
            <span>Lines</span>
            <span>Current Version (Right)</span>
          </div>
        </div>

        {/* Diff lines list */}
        <div className="divide-y divide-white/2 max-h-[500px] overflow-y-auto custom-scrollbar">
          {diffLines.map((line, idx) => {
            let rowBg = "";
            let leftBg = "";
            let rightBg = "";

            if (line.type === "added") {
              rowBg = "bg-emerald-950/15";
              rightBg = "bg-emerald-500/10 text-emerald-400 font-bold";
            } else if (line.type === "removed") {
              rowBg = "bg-red-950/15";
              leftBg = "bg-red-500/10 text-red-400 font-bold";
            } else if (line.type === "modified") {
              rowBg = "bg-amber-950/15";
              leftBg = "bg-amber-500/10 text-amber-400";
              rightBg = "bg-amber-500/10 text-amber-300 font-bold";
            }

            return (
              <div key={idx} className={`flex items-stretch hover:bg-white/2 transition-colors ${rowBg}`}>
                {/* Left (Base File Pane) */}
                <div className="w-1/2 pr-3 border-r border-white/5 flex items-stretch py-0.5">
                  <span className="w-9 text-zinc-650 text-right pr-2 select-none font-mono text-[9px] flex-shrink-0">
                    {line.leftNum || ""}
                  </span>
                  <span className={`flex-grow whitespace-pre overflow-x-auto custom-scrollbar leading-relaxed ${leftBg}`}>
                    {line.leftContent !== undefined ? line.leftContent : ""}
                  </span>
                </div>

                {/* Right (Current File Pane) */}
                <div className="w-1/2 pl-3 flex items-stretch py-0.5">
                  <span className="w-9 text-zinc-650 text-right pr-2 select-none font-mono text-[9px] flex-shrink-0">
                    {line.rightNum || ""}
                  </span>
                  <span className={`flex-grow whitespace-pre overflow-x-auto custom-scrollbar leading-relaxed ${rightBg}`}>
                    {line.rightContent !== undefined ? line.rightContent : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-white">
        <PremiumBackground />
        <div className="space-y-4 text-center z-10 select-none">
          <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-widest animate-pulse">
              Synchronizing Workspace...
            </h3>
            <p className="text-[10px] text-zinc-500 max-w-xs leading-relaxed font-mono">
              Loading project metadata from secure database sandbox.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-white">
        <PremiumBackground />
        <div className="space-y-4 text-center z-10 max-w-sm px-6">
          <div className="h-12 w-12 rounded-2xl border border-rose-500/20 bg-rose-550/5 flex items-center justify-center mx-auto text-rose-400">
            <X className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Project Not Found
            </h3>
            <p className="text-xs text-zinc-500 leading-normal">
              {error === "Project not found" 
                ? "The requested project could not be found in the database. Please verify the URL or create a new project." 
                : error}
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="py-2 px-5 rounded-xl bg-primary hover:bg-primary/95 text-[#050505] text-xs font-bold transition-all hover:scale-102 cursor-pointer shadow-md shadow-primary/5"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-[#050505] text-white overflow-hidden relative selection:bg-primary/20">
      <PremiumBackground />

      {/* 1. TOP UTILITY HEADER BAR */}
      <header className="h-12 border-b border-white/5 bg-[#0B0B0F]/90 backdrop-blur-md px-4 flex items-center justify-between z-20 flex-shrink-0 select-none">
        
        {/* Left Section: Logo & Project Name */}
        <div className="flex items-center space-x-3.5">
          <div className="flex h-6.5 w-6.5 items-center justify-center rounded-lg border border-white/5 bg-[#050505] shadow-[0_0_12px_rgba(79,124,255,0.05)]">
            <div className="h-2 w-2 rounded-sm bg-primary" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-extrabold text-white">{project?.title || "Clinic CRM Portal"}</span>
            <div className="flex items-center space-x-1 py-0.5 px-2 rounded-full border border-white/5 bg-white/2 text-[9px] font-bold text-zinc-400 font-mono scale-90">
              <CircleDot className="h-3 w-3 text-primary animate-pulse mr-1" />
              <span>{project?.status || "planning"}</span>
            </div>
          </div>
        </div>

        {/* Center Section: Navigation Path Info */}
        <div className="text-[10px] font-mono text-zinc-500 hidden sm:flex items-center space-x-1 border border-white/5 bg-white/1 px-3 py-1 rounded-lg">
          <span>workspace</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-zinc-400 font-bold">{activeTab === "overview" ? "project-overview.json" : activeTab}</span>
        </div>

        {/* Right Section: Action Controls */}
        <div className="flex items-center space-x-2.5">
          
          {/* Preview app trigger */}
          <button
            onClick={() => setPreviewOpen(true)}
            className="py-1.5 px-3 rounded-lg border border-white/5 bg-[#050505] hover:bg-white/5 hover:border-zinc-700 text-[10px] font-bold text-white transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <PlayCircle className="h-3.5 w-3.5 text-success" />
            <span className="hidden md:inline">Preview App</span>
          </button>

          {/* Deploy simulation trigger */}
          <button
            onClick={handleDeployReal}
            disabled={isDeploying}
            className={`py-1.5 px-3 rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1.5 ${
              isDeploying
                ? "bg-zinc-800 border border-transparent text-zinc-500 cursor-not-allowed"
                : "bg-primary hover:bg-primary/95 text-[#050505] hover:scale-102 cursor-pointer shadow-md shadow-primary/5"
            }`}
          >
            {isDeploying ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CloudLightning className="h-3.5 w-3.5" />
            )}
            <span>{isDeploying ? "Deploying..." : "Deploy"}</span>
          </button>

          {/* GitHub mock trigger */}
          <a
            href={publishedRepoUrl || "https://github.com"}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg border border-white/5 bg-[#050505] hover:bg-white/5 text-zinc-450 hover:text-white transition-colors cursor-pointer"
            title={publishedRepoUrl ? "Open GitHub Repository" : "GitHub Repository"}
          >
            <Github className="h-4 w-4" />
          </a>

          {/* Share trigger */}
          <button
            onClick={handleShareClick}
            className="py-1.5 px-3 rounded-lg border border-white/5 bg-[#050505] hover:bg-white/5 hover:border-zinc-700 text-[10px] font-bold text-zinc-350 hover:text-white transition-all flex items-center space-x-1.5 cursor-pointer"
            title="Copy Workspace Link"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Share</span>
          </button>

          {/* Download ZIP button */}
          <button
            onClick={handleDownloadZip}
            disabled={isDownloadingZip}
            className="py-1.5 px-3 rounded-lg border border-white/5 bg-[#050505] hover:bg-white/5 hover:border-zinc-700 text-[10px] font-bold text-zinc-350 hover:text-white transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download Project ZIP"
          >
            {isDownloadingZip ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            ) : (
              <Download className="h-3.5 w-3.5 text-primary" />
            )}
            <span className="hidden md:inline">{isDownloadingZip ? "Downloading..." : "Download"}</span>
          </button>

          {/* GitHub Publish button */}
          {publishStatus === "success" && publishedRepoUrl ? (
            <a
              href={publishedRepoUrl}
              target="_blank"
              rel="noreferrer"
              className="py-1.5 px-3 rounded-lg border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 text-[10px] font-bold text-emerald-400 transition-all flex items-center space-x-1.5 cursor-pointer"
              title="Open GitHub Repository"
            >
              <Github className="h-3.5 w-3.5 text-emerald-400" />
              <span>Open Repository</span>
            </a>
          ) : (
            <button
              onClick={handlePublishGithub}
              disabled={publishStatus !== "idle"}
              className="py-1.5 px-3 rounded-lg border border-white/5 bg-[#050505] hover:bg-white/5 hover:border-zinc-700 text-[10px] font-bold text-zinc-350 hover:text-white transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Publish to GitHub"
            >
              {publishStatus === "idle" ? (
                <Github className="h-3.5 w-3.5 text-primary" />
              ) : (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              )}
              <span>
                {publishStatus === "idle" && "Publish"}
                {publishStatus === "creating_repo" && "Creating Repository..."}
                {publishStatus === "uploading_files" && "Uploading Files..."}
                {publishStatus === "creating_commit" && "Creating Commit..."}
              </span>
            </button>
          )}

        </div>
      </header>

      {/* 2. CORE WORKSPACE COLUMN DIVISIONS */}
      <div className="flex-grow flex w-full overflow-hidden relative z-10">
        
        {/* Leftmost Sidebar Navigation Icons (Activity Bar) */}
        <nav className="w-12 border-r border-white/5 bg-[#0B0B0F]/90 backdrop-blur-md flex flex-col items-center justify-between py-3 flex-shrink-0 select-none">
          <div className="flex flex-col space-y-4 items-center w-full">
            {[
              { id: "explorer", icon: Files, label: "Explorer" },
              { id: "git", icon: GitBranch, label: "Source Control" },
              { id: "deploy", icon: CloudLightning, label: "Deployments" },
              { id: "agents", icon: Cpu, label: "AI Team" },
              { id: "history", icon: History, label: "Activity Logs" },
              { id: "settings", icon: Settings, label: "Settings" }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeSidebarTab === tab.id && !sidebarCollapsed;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (activeSidebarTab === tab.id) {
                      setSidebarCollapsed(!sidebarCollapsed);
                    } else {
                      setActiveSidebarTab(tab.id);
                      setSidebarCollapsed(false);
                    }
                  }}
                  className={`p-2 rounded-lg transition-all relative group cursor-pointer ${
                    isActive
                      ? "text-primary bg-primary/10 border-l-2 border-primary rounded-l-none"
                      : "text-zinc-500 hover:text-white hover:bg-white/2"
                  }`}
                  title={tab.label}
                >
                  <Icon className="h-4.5 w-4.5" />
                  
                  {/* Tooltip */}
                  <span className="absolute left-14 top-1/2 transform -translate-y-1/2 scale-0 group-hover:scale-100 transition-all origin-left text-[9px] font-bold bg-[#0B0B0F] border border-white/10 text-white px-2 py-1 rounded shadow-xl whitespace-nowrap z-50">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="h-6 w-6 rounded-full bg-secondary/15 border border-secondary/30 flex items-center justify-center text-[9px] font-bold text-secondary cursor-pointer select-none">
            U
          </div>
        </nav>

        {/* Left Side Panel (Explorer tree view pane) */}
        <AnimatePresence initial={false}>
          {!sidebarCollapsed && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-r border-white/5 bg-[#0B0B0F]/90 backdrop-blur-md flex flex-col flex-shrink-0 text-left overflow-hidden z-10 select-none"
            >
              
              {/* Active Tab Panel Header */}
              <div className="h-10 px-4 flex items-center justify-between border-b border-white/5 flex-shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
                  {activeSidebarTab === "explorer" && "File Explorer"}
                  {activeSidebarTab === "git" && "Source Control"}
                  {activeSidebarTab === "deploy" && "Deployments"}
                  {activeSidebarTab === "agents" && "AI Team Config"}
                  {activeSidebarTab === "history" && "Version History"}
                  {activeSidebarTab === "settings" && "Workspace Config"}
                </span>
                
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="p-1 rounded hover:bg-white/5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Panel Content Router */}
              <div className="flex-grow p-3 overflow-y-auto custom-scrollbar">
                
                {/* 1. File Explorer Content */}
                {activeSidebarTab === "explorer" && (
                  <div className="space-y-4">
                    
                    {/* Workspace Root Node */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold text-zinc-550 uppercase tracking-widest px-1">
                        <span>Project Files</span>
                      </div>
                      
                      <div className="space-y-1">
                        {artifactsLoading ? (
                          <div className="space-y-2.5 p-1 animate-pulse">
                            <div className="h-6.5 bg-white/5 border border-white/5 rounded-lg w-full" />
                            <div className="h-6.5 bg-white/5 border border-white/5 rounded-lg w-11/12" />
                            <div className="h-6.5 bg-white/5 border border-white/5 rounded-lg w-10/12" />
                          </div>
                        ) : artifacts.length === 0 ? (
                          <div className="py-8 px-2 text-center text-zinc-555 text-xs italic select-none">
                            No artifacts yet
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {artifacts.map(art => {
                              const isActive = activeTab === art.filename;
                              return (
                                <button
                                  key={art.id}
                                  onClick={() => {
                                    setActiveTab(art.filename);
                                    setSelectedArtifactId(art.id);
                                  }}
                                  className={`w-full flex items-center space-x-2 py-1.5 px-2 rounded-lg transition-all text-left text-xs ${
                                    isActive
                                      ? "bg-primary/10 border-l-2 border-primary text-white font-medium pl-1.5 shadow-[0_0_12px_rgba(79,124,255,0.05)]"
                                      : "hover:bg-white/2 text-zinc-400 hover:text-white"
                                  } cursor-pointer`}
                                >
                                  {getFileIcon(art.filename)}
                                  <span className="truncate">{art.filename}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Editor Active Open Tabs list */}
                    <div className="border-t border-white/5 pt-3 space-y-2">
                      <span className="text-[9px] font-mono font-bold text-zinc-550 uppercase tracking-widest px-1 block">Open Editors</span>
                      <div className="space-y-1">
                        {openTabs.map(tabPath => {
                          const isOverview = tabPath === "overview";
                          const name = isOverview ? "project-overview.json" : tabPath.split("/").pop() || "";
                          const isActive = activeTab === tabPath;
                          return (
                            <div
                              key={tabPath}
                              onClick={() => setActiveTab(tabPath)}
                              className={`flex items-center justify-between py-1 px-1.5 rounded text-xs transition-colors cursor-pointer ${
                                isActive ? "bg-white/4 text-white font-medium" : "text-zinc-500 hover:bg-white/2 hover:text-zinc-300"
                              }`}
                            >
                              <div className="flex items-center space-x-2 truncate">
                                {isOverview ? <FolderOpen className="h-3.5 w-3.5 text-primary" /> : getFileIcon(name)}
                                <span className="truncate">{name}</span>
                              </div>
                              {!isOverview && (
                                <button
                                  onClick={(e) => closeFileTab(tabPath, e)}
                                  className="p-0.5 rounded hover:bg-white/10 text-zinc-500 hover:text-white"
                                >
                                  <X className="h-2.5 w-2.5" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. Source Control Content */}
                {activeSidebarTab === "git" && (
                  <div className="space-y-4 text-xs font-sans text-zinc-400 p-1">
                    <p className="text-[11px] leading-relaxed">No uncommitted changes detected. Codebase is clean and synchronized with branch <code className="text-zinc-200">main</code>.</p>
                    <div className="border border-white/5 bg-[#050505] p-3 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                        <span>Latest Commit</span>
                        <span>10m ago</span>
                      </div>
                      <h4 className="font-bold text-white text-[11px]">feat: compile core Relational PostgreSQL schemas</h4>
                      <p className="text-[10px] text-zinc-500">Sha: <code className="font-mono bg-white/5 px-1 py-0.5 rounded">e1882bd</code></p>
                    </div>
                  </div>
                )}

                {/* 3. Deployments list content */}
                {activeSidebarTab === "deploy" && (
                  <div className="space-y-3 font-sans text-zinc-400">
                    <div className="p-3 border border-white/5 bg-[#050505] rounded-xl text-left space-y-2 relative overflow-hidden">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="flex items-center gap-1.5 text-success">
                          <span className="h-1.5 w-1.5 rounded-full bg-success" />
                          Production
                        </span>
                        <span>Active</span>
                      </div>
                      <h4 className="text-xs font-bold text-white leading-tight">Revision v1.0.4</h4>
                      <p className="text-[10px] text-zinc-500 leading-normal font-mono">Deployed by DevOps Agent via Cloud Run Balancer.</p>
                      <a
                        href="https://clinic-portal-ai.run.app"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline pt-1.5"
                      >
                        Visit Service <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}

                {/* 4. AI Team Settings content */}
                {activeSidebarTab === "agents" && (
                  <div className="space-y-4 text-zinc-400 text-xs">
                    <p>Configure agent execution models, model temperature overrides, and token generation boundaries.</p>
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">LLM Engine</label>
                      <select className="w-full bg-[#050505] border border-white/5 rounded-lg p-2 text-xs text-white outline-none">
                        <option>Gemini 3.5 Flash (Medium)</option>
                        <option>Gemini 3.5 Pro (Large)</option>
                        <option>Anthropic Claude 3.5 Sonnet</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 5. Version History */}
                {activeSidebarTab === "history" && (
                  <div className="space-y-4 font-sans text-xs text-zinc-400">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block font-bold">
                        Snapshots Timeline
                      </span>
                      <button
                        onClick={() => {
                          setCompareLeft(null);
                          setCompareRight(null);
                          setCompareOpen(true);
                        }}
                        className="py-1 px-2.5 rounded bg-zinc-900 border border-white/5 hover:bg-white/5 text-[9px] font-bold text-cyan-400 hover:text-white transition-colors cursor-pointer"
                      >
                        Compare Diff
                      </button>
                    </div>

                    {isLoadingVersions ? (
                      <div className="space-y-3 py-4 text-center">
                        <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary" />
                        <span className="text-[10px] font-mono text-zinc-650 block">Loading timeline history...</span>
                      </div>
                    ) : projectVersions.length === 0 ? (
                      <div className="py-8 text-center text-zinc-650 font-mono text-[10px]">
                        No versions saved yet. Version snapshots are captured automatically during code generation runs.
                      </div>
                    ) : (
                      <div className="relative pl-3.5 border-l border-white/10 space-y-4 ml-2">
                        {projectVersions.map((ver) => {
                          return (
                            <div key={ver.id} className="relative group">
                              {/* Timeline bullet node */}
                              <span className="absolute -left-[20.5px] top-1 h-2 w-2 rounded-full border border-zinc-950 bg-primary group-hover:scale-125 transition-transform animate-pulse" />
                              
                              <div className="space-y-1">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-bold text-white text-[11px] font-mono">
                                    Version {ver.version}
                                  </h4>
                                  <span className="text-[8px] text-zinc-650 font-mono">
                                    {new Date(ver.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-zinc-400 text-[10px] leading-relaxed">
                                  {ver.summary || "No summary provided"}
                                </p>

                                {/* Action Buttons */}
                                <div className="pt-1.5 flex items-center space-x-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleRestoreVersion(ver.id, ver.version)}
                                    className="text-[9px] font-bold text-cyan-400 hover:underline cursor-pointer"
                                  >
                                    Restore
                                  </button>
                                  <span className="text-zinc-750">|</span>
                                  <button
                                    onClick={() => {
                                      setCompareLeft(ver.id);
                                      setCompareOpen(true);
                                    }}
                                    className="text-[9px] font-bold text-zinc-450 hover:text-white cursor-pointer"
                                  >
                                    Compare
                                  </button>
                                  <span className="text-zinc-750">|</span>
                                  <button
                                    onClick={() => handleDeleteVersion(ver.id, ver.version)}
                                    className="text-[9px] font-bold text-red-400 hover:underline cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 6. General Settings */}
                {activeSidebarTab === "settings" && (
                  <div className="space-y-4 text-xs text-zinc-400">
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">Editor Theme</span>
                      <button className="w-full text-left p-2 rounded-lg bg-zinc-900 border border-white/5 text-white flex justify-between items-center">
                        <span>Cyber Dark</span>
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Center Section: Main Tabbed Editor Area + Bottom Terminal Console */}
        <section className="flex-grow flex flex-col min-w-0 bg-[#050505] overflow-hidden relative">
          
          {/* Tab Bar container */}
          <div className="h-10 border-b border-white/5 bg-[#0B0B0F]/50 flex items-center justify-between flex-shrink-0 px-2 overflow-x-auto select-none scrollbar-none">
            
            {/* Tabs List */}
            <div className="flex items-center space-x-1.5">
              {openTabs.map(tabPath => {
                const isOverview = tabPath === "overview";
                const name = isOverview ? "project-overview.json" : tabPath.split("/").pop() || "";
                const isActive = activeTab === tabPath;
                return (
                  <button
                    key={tabPath}
                    onClick={() => setActiveTab(tabPath)}
                    className={`h-8 px-3.5 rounded-t-lg text-xs font-semibold flex items-center space-x-2 transition-all relative border-t-2 ${
                      isActive
                        ? "bg-[#050505] text-white border-primary border-b-2 border-b-transparent"
                        : "text-zinc-500 hover:text-zinc-350 bg-[#0B0B0F]/20 border-transparent hover:bg-white/1"
                    } cursor-pointer`}
                  >
                    {isOverview ? <Sparkles className="h-3.5 w-3.5 text-primary" /> : getFileIcon(name)}
                    <span>{name}</span>
                    {!isOverview && (
                      <X
                        className="h-2.5 w-2.5 hover:bg-white/10 rounded p-0.5 text-zinc-550 hover:text-white"
                        onClick={(e) => closeFileTab(tabPath, e)}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Actions right of tabs bar */}
            <div className="flex items-center space-x-1.5 pr-2">
              <span className="text-[10px] text-zinc-650 font-mono uppercase bg-white/2 border border-white/5 px-2 py-0.5 rounded">
                Edit Mock Mode
              </span>
            </div>

          </div>

          {/* Active Tab View Body */}
          <div className="flex-grow overflow-y-auto p-6 text-left relative custom-scrollbar bg-[#050505]/40">
            
            {activeTab === "overview" ? (
              <div className="flex flex-col h-full space-y-4">
                
                {/* Header info & Tabs selection */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3.5 flex-shrink-0 select-none">
                  <div className="text-left flex items-center space-x-6">
                    <div>
                      <h2 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                        <span>Project Structure & Preview</span>
                      </h2>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        Watch the application compile and evolve in real-time.
                      </p>
                    </div>

                    {/* Tabs switch */}
                    <div className="flex bg-[#0B0B0F] border border-white/5 rounded-lg p-0.5 text-[9px] font-mono">
                      <button
                        onClick={() => setCenterViewTab("preview")}
                        className={`px-3 py-1 rounded-md transition-all font-bold cursor-pointer ${
                          centerViewTab === "preview"
                            ? "bg-primary text-[#050505]"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => setCenterViewTab("code")}
                        className={`px-3 py-1 rounded-md transition-all font-bold cursor-pointer ${
                          centerViewTab === "code"
                            ? "bg-primary text-[#050505]"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        Generated Code
                      </button>
                    </div>
                  </div>

                  {/* Actions: Start Generation */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={runGenerationPipeline}
                      disabled={isGeneratingProject}
                      className={`py-1.5 px-4 rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1.5 ${
                        isGeneratingProject
                          ? "bg-zinc-800 text-zinc-500 border border-transparent cursor-not-allowed"
                          : "bg-primary hover:bg-primary/95 text-[#050505] hover:scale-102 cursor-pointer shadow-md shadow-primary/5"
                      }`}
                    >
                      {isGeneratingProject ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <PlayCircle className="h-3.5 w-3.5" />
                      )}
                      <span>{isGeneratingProject ? "Generating..." : visiblePaths.length > 0 ? "Restart Pipeline" : "Start Generation Pipeline"}</span>
                    </button>
                  </div>
                </div>

                {/* Main dynamic section based on tabs */}
                <div className="flex-grow min-h-0 overflow-hidden flex flex-col">
                  {centerViewTab === "preview" ? (
                    
                    /* TAB 1: BROWSER PREVIEW APP COCKPIT */
                    <div className="flex-grow flex flex-col items-center justify-start bg-[#070709] border border-white/5 rounded-2xl overflow-hidden min-h-0 relative select-none">
                      
                      {/* BROWSER CHROME TOOLBAR */}
                      <div className="w-full h-11 border-b border-white/5 bg-[#0B0B0F] px-4 flex items-center justify-between flex-shrink-0">
                        
                        {/* Colored dots */}
                        <div className="flex items-center space-x-1.5 w-[80px]">
                          <div className="h-2 w-2 rounded-full bg-rose-500/80" />
                          <div className="h-2 w-2 rounded-full bg-amber-500/80" />
                          <div className="h-2 w-2 rounded-full bg-emerald-500/80" />
                        </div>

                        {/* URL input address bar */}
                        <div className="flex-grow max-w-md mx-4 flex items-center space-x-2 bg-[#050505] border border-white/5 px-3 py-1 rounded-lg">
                          <button
                            onClick={() => {
                              if (previewUrl) {
                                setPreviewIframeKey(prev => prev + 1);
                                setTerminalLogs(prev => [...prev, "→ Reloading preview iframe..."]);
                              } else {
                                runGenerationSimulation();
                              }
                            }}
                            title="Refresh Sandbox App"
                            className="text-zinc-550 hover:text-white transition-colors cursor-pointer"
                          >
                            <RefreshCw className="h-3 w-3" />
                          </button>
                          <input
                            type="text"
                            readOnly
                            value={previewUrl || "https://clinic-portal-ai.run.app"}
                            className="w-full bg-transparent outline-none border-none text-[10px] text-zinc-400 font-mono select-all text-center leading-none"
                          />
                        </div>

                        {/* Viewport resizing toggles */}
                        <div className="flex items-center bg-[#050505] border border-white/5 rounded-md p-0.5 justify-between">
                          {[
                            { mode: "desktop", label: "Desktop", icon: Monitor },
                            { mode: "tablet", label: "Tablet", icon: Tablet },
                            { mode: "mobile", label: "Mobile", icon: Smartphone }
                          ].map(device => {
                            const Icon = device.icon;
                            const isSelected = viewportMode === device.mode;
                            return (
                              <button
                                key={device.mode}
                                onClick={() => setViewportMode(device.mode as any)}
                                title={`Switch to ${device.label} layout`}
                                className={`p-1.5 rounded transition-all cursor-pointer ${
                                  isSelected ? "bg-primary text-[#050505]" : "text-zinc-500 hover:text-white"
                                }`}
                              >
                                <Icon className="h-3 w-3" />
                              </button>
                            );
                          })}
                        </div>

                      </div>

                      {/* BROWSER BODY WORKSPACE */}
                      <div className="w-full flex-grow p-4 flex justify-center items-start overflow-y-auto custom-scrollbar select-text bg-[#070709] min-h-[300px]">
                        <motion.div
                          layout
                          animate={{
                            width:
                              viewportMode === "desktop"
                                ? "100%"
                                : viewportMode === "tablet"
                                ? "640px"
                                : "340px"
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className={`bg-[#050505] border border-white/5 rounded-xl shadow-2xl overflow-hidden flex flex-col min-h-[360px] max-w-full ${
                            viewportMode === "mobile" ? "h-[500px]" : "h-auto"
                          }`}
                        >
                          {previewStatus === "ready" && previewUrl ? (
                            <iframe
                              key={previewIframeKey}
                              src={previewUrl}
                              className="w-full h-full min-h-[360px] flex-grow border-0 bg-white"
                              sandbox="allow-scripts allow-same-origin allow-forms"
                            />
                          ) : previewStatus === "compiling" ? (
                            <div className="flex-grow flex flex-col items-center justify-center p-8 space-y-4 text-center select-none font-mono">
                              <Loader2 className="h-8 w-8 text-primary animate-spin" />
                              <div className="space-y-1">
                                <h4 className="text-xs font-bold text-white uppercase tracking-widest animate-pulse">Compiling Preview Sandbox...</h4>
                                <p className="text-[9px] text-zinc-550 max-w-xs leading-relaxed">
                                  Running npm install and bootstrapping Next.js hot-reload dev server. Watch logs below.
                                </p>
                              </div>
                            </div>
                          ) : previewStatus === "failed" ? (
                            <div className="flex-grow flex flex-col items-center justify-center p-8 space-y-4 text-center select-none font-mono text-left">
                              <X className="h-8 w-8 text-rose-500 mx-auto mb-2" />
                              <div className="space-y-1 text-center">
                                <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest">Compilation Failed</h4>
                                <p className="text-[9px] text-zinc-550 max-w-xs leading-relaxed mx-auto">
                                  The package install or Next.js startup failed. Please inspect logs in the cockpit terminal console.
                                </p>
                              </div>
                            </div>
                          ) : (
                            <>
                              {/* Stage 1: Loading skeleton */}
                              {buildStage === 1 && (
                                <div className="space-y-6 p-6 animate-pulse w-full">
                                  <div className="h-5 bg-zinc-800 rounded w-1/4" />
                                  <div className="space-y-3">
                                    <div className="h-4 bg-zinc-800 rounded w-3/4" />
                                    <div className="h-4 bg-zinc-800 rounded w-1/2" />
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                    <div className="h-28 bg-[#0B0B0F]/80 border border-white/5 rounded-2xl" />
                                    <div className="h-28 bg-[#0B0B0F]/80 border border-white/5 rounded-2xl" />
                                  </div>
                                </div>
                              )}

                              {/* Stage 2: Navbar appears */}
                              {buildStage === 2 && (
                                <div className="w-full flex flex-col h-full bg-[#050505] text-white text-left font-sans select-none">
                                  <div className="h-12 border-b border-white/5 bg-[#0B0B0F] px-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <div className="h-5 w-5 rounded bg-cyan-400 flex items-center justify-center font-bold text-[10px] text-[#050505]">H</div>
                                      <span className="font-bold text-[11px] text-white">HealthPortal AI</span>
                                    </div>
                                    <div className="flex space-x-3 text-[8px] text-zinc-400 font-bold uppercase tracking-wider">
                                      <span>Overview</span>
                                      <span>Schedules</span>
                                      <span>Patients</span>
                                    </div>
                                    <span className="text-[8px] px-2 py-0.5 rounded border border-white/5 bg-[#050505] text-zinc-450 font-bold">Connected</span>
                                  </div>
                                  <div className="flex-grow space-y-6 p-6 animate-pulse">
                                    <div className="h-5 bg-zinc-800 rounded w-1/3 mt-2" />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div className="h-24 bg-[#0B0B0F]/80 border border-white/5 rounded-2xl" />
                                      <div className="h-24 bg-[#0B0B0F]/80 border border-white/5 rounded-2xl" />
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Stage 3: Hero section appears */}
                              {buildStage === 3 && (
                                <div className="w-full flex flex-col h-full bg-[#050505] text-white text-left font-sans select-none">
                                  <div className="h-12 border-b border-white/5 bg-[#0B0B0F] px-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <div className="h-5 w-5 rounded bg-cyan-400 flex items-center justify-center font-bold text-[10px] text-[#050505]">H</div>
                                      <span className="font-bold text-[11px] text-white">HealthPortal AI</span>
                                    </div>
                                    <div className="flex space-x-3 text-[8px] text-zinc-400 font-bold uppercase tracking-wider">
                                      <span>Overview</span>
                                      <span>Schedules</span>
                                      <span>Patients</span>
                                    </div>
                                    <span className="text-[8px] px-2 py-0.5 rounded border border-white/5 bg-[#050505] text-zinc-450 font-bold">Connected</span>
                                  </div>
                                  <div className="p-6 space-y-6 flex-grow">
                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="space-y-2 border-b border-white/5 pb-4"
                                    >
                                      <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                                        Clinic Core Management Dashboard
                                      </h1>
                                      <p className="text-zinc-400 text-[10px] leading-relaxed max-w-lg">
                                        Autonomous patient tracking scheduling, relational health schemas, and security-hardened authentication rules.
                                      </p>
                                    </motion.div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
                                      <div className="h-20 bg-[#0B0B0F]/80 border border-white/5 rounded-2xl" />
                                      <div className="h-20 bg-[#0B0B0F]/80 border border-white/5 rounded-2xl" />
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Stage 4: Cards list animates in */}
                              {buildStage === 4 && (
                                <div className="w-full flex flex-col h-full bg-[#050505] text-white text-left font-sans select-none">
                                  <div className="h-12 border-b border-white/5 bg-[#0B0B0F] px-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <div className="h-5 w-5 rounded bg-cyan-400 flex items-center justify-center font-bold text-[10px] text-[#050505]">H</div>
                                      <span className="font-bold text-[11px] text-white">HealthPortal AI</span>
                                    </div>
                                    <div className="flex space-x-3 text-[8px] text-zinc-400 font-bold uppercase tracking-wider">
                                      <span>Overview</span>
                                      <span>Schedules</span>
                                      <span>Patients</span>
                                    </div>
                                    <span className="text-[8px] px-2 py-0.5 rounded border border-white/5 bg-[#050505] text-zinc-450 font-bold">Connected</span>
                                  </div>
                                  <div className="p-6 space-y-5 flex-grow">
                                    <div className="space-y-2 border-b border-white/5 pb-4">
                                      <h1 className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                                        Clinic Core Management Dashboard
                                      </h1>
                                      <p className="text-zinc-400 text-[10px] leading-relaxed">
                                        Autonomous patient tracking scheduling, relational health schemas, and security-hardened authentication rules.
                                      </p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div className="p-4 bg-[#0B0B0F] border border-white/5 rounded-xl space-y-3">
                                        <h3 className="text-[10px] font-bold text-white">Register Patient</h3>
                                        <div className="flex gap-2">
                                          <input
                                            type="text"
                                            disabled
                                            placeholder="Patient Full Name"
                                            className="flex-grow p-1.5 text-[9px] bg-[#050505] border border-white/5 rounded-md text-zinc-500 cursor-not-allowed"
                                          />
                                          <button disabled className="px-3 py-1 bg-zinc-800 text-zinc-650 text-[9px] font-bold rounded-md cursor-not-allowed">Add</button>
                                        </div>
                                      </div>
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="p-4 bg-[#0B0B0F] border border-white/5 rounded-xl space-y-3"
                                      >
                                        <h3 className="text-[10px] font-bold text-white">Active Queue</h3>
                                        <div className="space-y-1.5">
                                          {previewPatients.map(p => (
                                            <div key={p.id} className="flex justify-between items-center p-2 bg-[#050505] border border-white/5 rounded-lg text-[9px]">
                                              <span>{p.name}</span>
                                              <span className="text-[8px] font-mono text-zinc-500">{p.time}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </motion.div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Stage 5: Fully interactive application */}
                              {buildStage === 5 && (
                                <div className="w-full flex flex-col h-full bg-[#050505] text-white text-left font-sans select-none">
                                  <div className="h-12 border-b border-white/5 bg-[#0B0B0F] px-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <div className="h-5 w-5 rounded bg-cyan-400 flex items-center justify-center font-bold text-[10px] text-[#050505]">H</div>
                                      <span className="font-bold text-[11px] text-white">HealthPortal AI</span>
                                    </div>
                                    <div className="flex space-x-3 text-[8px] text-zinc-400 font-bold uppercase tracking-wider">
                                      <span className="hover:text-white cursor-pointer transition-colors">Overview</span>
                                      <span className="hover:text-white cursor-pointer transition-colors">Schedules</span>
                                      <span className="hover:text-white cursor-pointer transition-colors">Patients</span>
                                    </div>
                                    <span className="text-[8px] px-2 py-0.5 rounded border border-white/5 bg-[#050505] text-zinc-350 hover:text-white transition-all font-bold cursor-pointer font-sans leading-none">Connected</span>
                                  </div>
                                  <div className="p-6 space-y-5 flex-grow">
                                    <div className="space-y-2 border-b border-white/5 pb-4">
                                      <h1 className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                                        Clinic Core Management Dashboard
                                      </h1>
                                      <p className="text-zinc-400 text-[10px] leading-relaxed">
                                        Autonomous patient tracking scheduling, relational health schemas, and security-hardened authentication rules.
                                      </p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      
                                      {/* Interactive Form */}
                                      <div className="p-4 bg-[#0B0B0F] border border-white/5 rounded-xl space-y-3 text-left">
                                        <h3 className="text-[10px] font-bold text-white">Register Patient</h3>
                                        <div className="flex gap-2">
                                          <input
                                            type="text"
                                            value={previewPatientName}
                                            onChange={(e) => setPreviewPatientName(e.target.value)}
                                            placeholder="Patient Full Name"
                                            className="flex-grow p-1.5 text-[9px] bg-[#050505] border border-white/5 rounded-md text-white outline-none focus:border-cyan-400 text-left font-sans"
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter") addPreviewPatient();
                                            }}
                                          />
                                          <button
                                            onClick={addPreviewPatient}
                                            className="px-3 py-1 bg-cyan-400 hover:bg-cyan-350 text-[#050505] text-[9px] font-bold rounded-md cursor-pointer transition-transform active:scale-95 flex-shrink-0"
                                          >
                                            Add
                                          </button>
                                        </div>
                                      </div>

                                      {/* Active Queue list */}
                                      <div className="p-4 bg-[#0B0B0F] border border-white/5 rounded-xl space-y-3 text-left">
                                        <h3 className="text-[10px] font-bold text-white flex justify-between items-center">
                                          <span>Active Queue</span>
                                          <span className="font-mono text-[9px] text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-800/35 px-1.5 py-0.2 rounded-full">
                                            {previewPatients.length} Patients
                                          </span>
                                        </h3>
                                        <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar pr-1">
                                          <AnimatePresence initial={false}>
                                            {previewPatients.map(p => (
                                              <motion.div
                                                key={p.id}
                                                initial={{ opacity: 0, height: 0, y: -5 }}
                                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="flex justify-between items-center p-2 bg-[#050505] border border-white/5 rounded-lg text-[9px]"
                                              >
                                                <span>{p.name}</span>
                                                <div className="flex items-center space-x-2 text-zinc-500 font-mono text-[8px]">
                                                  <span>{p.time}</span>
                                                  <span className="px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 font-sans font-bold scale-90 select-none">
                                                    {p.status}
                                                  </span>
                                                </div>
                                              </motion.div>
                                            ))}
                                          </AnimatePresence>
                                        </div>
                                      </div>

                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </motion.div>
                      </div>

                    </div>
                  ) : (
                    
                    /* TAB 2: CODE TREE GENERATED SANDBOX (PREVIOUS CODE PREVIEW VIEW) */
                    <div className="flex-grow grid grid-cols-12 gap-5 min-h-0">
                      
                      {/* Left visual tree */}
                      <div className="col-span-5 border border-white/5 bg-[#0B0B0F]/45 rounded-2xl p-4 flex flex-col text-left min-h-0 overflow-y-auto custom-scrollbar">
                        <h3 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-3.5 select-none">
                          Project Structure Tree
                        </h3>
                        
                        {/* Search Input */}
                        <div className="mb-3.5 relative select-none">
                          <input
                            type="text"
                            placeholder="Search files..."
                            value={fileSearchQuery}
                            onChange={(e) => setFileSearchQuery(e.target.value)}
                            className="w-full py-1.5 pl-8 pr-3 bg-black/45 border border-white/5 rounded-lg text-[10px] text-zinc-350 outline-none focus:border-primary font-mono transition-colors"
                          />
                          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-550" />
                          {fileSearchQuery && (
                            <button
                              onClick={() => setFileSearchQuery("")}
                              className="absolute right-2.5 top-2.5 text-zinc-550 hover:text-white"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-2 flex-grow min-h-0">
                          <div className="flex items-center space-x-2 py-1 px-1.5 font-bold text-white text-xs select-none">
                            <FolderOpen className="h-4.5 w-4.5 text-primary" />
                            <span>Project Root</span>
                          </div>

                          {generatedFilesLoading ? (
                            <div className="space-y-2.5 pl-4 animate-pulse">
                              {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="h-6 bg-white/5 border border-white/5 rounded-lg w-full" />
                              ))}
                            </div>
                          ) : filteredFileTree.length === 0 ? (
                            <div className="pl-6 py-8 text-zinc-550 text-xs italic select-none flex flex-col items-center justify-center space-y-3">
                              <span>{fileSearchQuery ? "No matching files found." : "Empty directory. Generation pipeline not initialized."}</span>
                              {!fileSearchQuery && (
                                <button
                                  onClick={runGenerationPipeline}
                                  className="text-[10px] text-primary hover:underline font-bold"
                                >
                                  Click to start compiling files →
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="pl-4 border-l border-white/5 ml-3">
                              {renderCockpitTree(filteredFileTree)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right code preview */}
                      <div className="col-span-7 border border-white/5 bg-[#0B0B0F]/45 rounded-2xl p-4 flex flex-col min-h-0 overflow-hidden select-text">
                        <h3 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-3.5 select-none text-left">
                          Code Blueprint Preview
                        </h3>
                        <div className="flex-grow bg-[#050505] border border-white/5 rounded-xl overflow-y-auto p-4 custom-scrollbar text-left font-mono relative">
                          {previewFilePath ? (
                            (() => {
                              const activeNode = findFileNode(dynamicFileTree, previewFilePath);
                              if (!activeNode || !activeNode.content) return <span className="text-zinc-650 italic text-[11px]">Compiling buffer...</span>;
                              return (
                                <div className="space-y-3 select-text pr-2">
                                  <div className="flex items-center justify-between pb-2 border-b border-white/5 select-none text-[9px] text-zinc-550">
                                    <div className="flex items-center space-x-2">
                                      {getFileIcon(activeNode.name)}
                                      <span className="font-bold">{activeNode.path}</span>
                                    </div>
                                    <span>{activeNode.language?.toUpperCase() || "SOURCE"}</span>
                                  </div>
                                  <div className="pt-2 select-text">
                                    {renderSyntaxHighlightedCode(activeNode.content)}
                                  </div>
                                </div>
                              );
                            })()
                          ) : (
                            <div className="h-full w-full flex flex-col items-center justify-center text-zinc-550 text-xs italic select-none space-y-2">
                              <Cpu className="h-8 w-8 text-zinc-600 animate-float" />
                              <span>Awaiting source file preview...</span>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  )}
                </div>

                {/* BUILD PROGRESS TIMELINE */}
                <div className="border-t border-white/5 pt-4 flex-shrink-0 select-none">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-550">Compilation Pipeline Steps</span>
                    <div className="flex items-center space-x-1.5 text-[10px] text-zinc-400 font-mono">
                      <span>Stage:</span>
                      <strong className="text-primary font-bold">{buildTimelineStep.toUpperCase()}</strong>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between font-mono text-[9px] bg-[#0B0B0F]/45 border border-white/5 px-4 py-2.5 rounded-xl">
                    {[
                      { id: "planning", label: "Planning" },
                      { id: "architecture", label: "Architecture" },
                      { id: "database", label: "Database" },
                      { id: "backend", label: "Backend" },
                      { id: "frontend", label: "Frontend" },
                      { id: "testing", label: "Testing" },
                      { id: "deployment", label: "Deployment" }
                    ].map((stage, idx, arr) => {
                      const stagesList = ["planning", "architecture", "database", "backend", "frontend", "testing", "deployment"];
                      const currentIndex = stagesList.indexOf(buildTimelineStep);
                      const isCompleted = idx < currentIndex;
                      const isActive = idx === currentIndex;

                      return (
                        <React.Fragment key={stage.id}>
                          <div className="flex items-center space-x-2">
                            <span className={`h-4 w-4 rounded-full border flex items-center justify-center text-[8px] font-bold transition-all ${
                              isCompleted
                                ? "bg-success/10 border-success text-success"
                                : isActive
                                ? "bg-primary/20 border-primary text-primary animate-pulse"
                                : "bg-white/2 border-white/5 text-zinc-600"
                            }`}>
                              {isCompleted ? "✓" : idx + 1}
                            </span>
                            <span className={`transition-colors font-bold ${
                              isCompleted ? "text-success" : isActive ? "text-primary" : "text-zinc-550"
                            }`}>
                              {stage.label}
                            </span>
                          </div>
                          {idx < arr.length - 1 && (
                            <div className={`flex-grow h-0.5 mx-2 max-w-[40px] transition-colors ${
                              isCompleted ? "bg-success/50" : isActive ? "bg-primary/50" : "bg-white/5"
                            }`} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* 2. SPECIFIC FILE CODE VIEWER VIEW */
              <div className="h-full w-full select-text max-w-4xl mx-auto">
                {activeArtifact ? (
                  <div className="space-y-4 select-text">
                    
                    {/* File info bar */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/5 select-none">
                      <div className="flex items-center space-x-2">
                        {getFileIcon(activeArtifact.filename)}
                        <h2 className="text-xs font-bold text-white font-mono">{activeArtifact.filename}</h2>
                      </div>
                      <div className="text-[9px] text-zinc-550 font-mono space-x-2.5">
                        <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">DATABASE ARTIFACT</span>
                        <span>•</span>
                        <span>{activeArtifact.type.toUpperCase()}</span>
                        <span>•</span>
                        <span>{new Blob([activeArtifact.content || ""]).size} Bytes</span>
                      </div>
                    </div>

                    {/* Markdown rendering preview */}
                    <div className="bg-[#050505]/80 border border-white/5 rounded-2xl py-4 overflow-x-auto shadow-inner select-text">
                      <MarkdownPreview content={activeArtifact.content} />
                    </div>

                  </div>
                ) : activeFileNode ? (
                  <div className="space-y-4 select-text">
                    
                    {/* File info bar */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/5 select-none">
                      <div className="flex items-center space-x-2">
                        {getFileIcon(activeFileNode.name)}
                        <h2 className="text-xs font-bold text-white font-mono">{activeFileNode.path}</h2>
                      </div>
                      <div className="text-[9px] text-zinc-550 font-mono flex items-center space-x-2.5">
                        <span>{activeFileNode.language?.toUpperCase() || "PLAINTEXT"}</span>
                        <span>•</span>
                        <span>{activeFileNode.content?.split("\n").length} Lines</span>
                        <span>•</span>
                        {/* Compare Version Dropdown Selector */}
                        <div className="flex items-center space-x-1.5 bg-zinc-950 px-2 py-0.5 rounded border border-white/5 text-[9px] text-zinc-400">
                          <span className="text-zinc-650 select-none font-bold">Compare vs:</span>
                          <select
                            value={activeFileCompareVersionId || ""}
                            onChange={(e) => setActiveFileCompareVersionId(e.target.value || null)}
                            className="bg-transparent border-none text-white outline-none font-mono text-[9px] cursor-pointer"
                          >
                            <option value="">(None - Edit Mode)</option>
                            {projectVersions.map(v => (
                              <option key={v.id} value={v.id}>Version {v.version} ({v.summary.slice(0, 15)}...)</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Rendering the code with simulated highlights / side-by-side diff */}
                    <div className="bg-[#050505]/80 border border-white/5 rounded-2xl py-4 overflow-x-auto shadow-inner select-text">
                      {isLoadingActiveFileCompare ? (
                        <div className="p-8 text-center flex flex-col items-center justify-center space-y-3 font-mono text-[10px] text-zinc-650 select-none">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <span>Fetching version snapshot details...</span>
                        </div>
                      ) : activeFileCompareVersionId && baseCompareFileContent !== null ? (
                        renderSideBySideDiff(baseCompareFileContent, activeFileNode.content || "")
                      ) : activeFileNode.content ? (
                        renderSyntaxHighlightedCode(activeFileNode.content)
                      ) : (
                        <div className="text-zinc-650 italic text-xs font-mono p-4">No content readable.</div>
                      )}
                    </div>

                  </div>
                ) : (
                  <div className="text-zinc-500 italic text-xs">File not found in explorer.</div>
                )}
              </div>
            )}

          </div>

          {/* 3. BOTTOM PANEL: Terminal logs */}
          <footer className="h-44 border-t border-white/5 bg-[#0B0B0F]/90 backdrop-blur-md flex flex-col justify-between flex-shrink-0 font-mono text-[10px] relative z-10">
            
            {/* Terminal header */}
            <div className="h-7 px-4 flex items-center justify-between border-b border-white/5 select-none">
              <div className="flex items-center space-x-2 text-zinc-400">
                <TerminalSquare className="h-3.5 w-3.5 text-zinc-550" />
                <span className="font-bold uppercase tracking-wider text-[8px]">console terminal logs</span>
              </div>
              <div className="flex items-center space-x-3 text-zinc-550">
                <span>user@buildai-os:~</span>
                {isDeploying && (
                  <span className="text-primary font-bold animate-pulse scale-90 px-1 py-0.2 rounded bg-primary/10 border border-primary/20">
                    Running Build...
                  </span>
                )}
              </div>
            </div>

            {/* Scrolling console logs block */}
            <div className="flex-grow p-4 overflow-y-auto text-left space-y-1.5 pr-2 select-text custom-scrollbar">
              {terminalLogs.map((log, idx) => {
                let colorClass = "text-zinc-450";
                let prefix = ">>";
                
                if (log.startsWith("✓") || log.includes("successful")) {
                  colorClass = "text-success font-semibold";
                  prefix = "";
                } else if (log.startsWith("[DEPLOY]")) {
                  colorClass = "text-primary";
                  prefix = "";
                }

                return (
                  <div key={idx} className={`leading-relaxed pl-1 border-l border-zinc-800 ${colorClass}`}>
                    {prefix && <span className="text-zinc-650 mr-2 select-none">{prefix}</span>}
                    {log}
                  </div>
                );
              })}
              <div ref={terminalEndRef} />
            </div>

          </footer>

        </section>

                 {/* 4. RIGHT PANEL: AI Engineering Collaborative Timeline */}
        <aside className="w-[280px] border-l border-white/5 bg-[#0B0B0F]/80 backdrop-blur-md p-4 flex flex-col flex-shrink-0 text-left overflow-hidden relative select-none">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-white/5 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">AI Collab Timeline</span>
            </div>
            
            {/* Pause/Play stream selector */}
            <button
              onClick={() => setIsTimelinePaused(prev => !prev)}
              title={isTimelinePaused ? "Resume message stream" : "Pause message stream"}
              className={`p-1 rounded transition-colors cursor-pointer flex items-center justify-center border ${
                isTimelinePaused
                  ? "bg-amber-950/40 border-amber-800/30 text-amber-400 hover:bg-amber-900/40"
                  : "bg-white/2 border-white/5 text-zinc-550 hover:text-white"
              }`}
            >
              {isTimelinePaused ? <Play className="h-3 w-3 fill-current" /> : <Pause className="h-3 w-3 fill-current" />}
            </button>
          </div>

          {/* Filtering & Search panel */}
          <div className="space-y-2 mt-3 pb-3 border-b border-white/5 flex-shrink-0">
            
            {/* Search inputs */}
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-zinc-550 pointer-events-none" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={timelineSearch}
                onChange={e => setTimelineSearch(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 bg-[#050505] border border-white/5 rounded-lg text-[10px] text-white outline-none focus:border-primary transition-all font-mono"
              />
              {timelineSearch && (
                <button
                  onClick={() => setTimelineSearch("")}
                  className="absolute right-2 text-zinc-500 hover:text-white text-[9px] cursor-pointer font-bold leading-none px-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Agent filters */}
            <div className="flex items-center space-x-1.5 select-none">
              <span className="text-[8px] font-mono text-zinc-550 uppercase">Agent:</span>
              <select
                value={timelineFilter}
                onChange={e => setTimelineFilter(e.target.value)}
                className="flex-grow bg-[#050505] border border-white/5 rounded-md px-1.5 py-1 text-[9px] text-zinc-400 font-mono outline-none cursor-pointer focus:border-primary transition-all"
              >
                <option value="all">All Collaborators</option>
                <option value="CEO">CEO (Aegis)</option>
                <option value="Product Manager">PM (Scribe)</option>
                <option value="Architect">Architect (Nexus)</option>
                <option value="Database">Database (Schema)</option>
                <option value="Backend">Backend (Core)</option>
                <option value="Frontend">Frontend (Pixel)</option>
                <option value="QA">QA (Spec)</option>
                <option value="Security">Security (Sentinel)</option>
                <option value="DevOps">DevOps (Orbit)</option>
                <option value="Reviewer">Reviewer (Judge)</option>
              </select>
            </div>

          </div>

          {/* Chat Messages Timeline Stream */}
          <div className="flex-grow overflow-y-auto py-3.5 space-y-3.5 custom-scrollbar pr-0.5 min-h-0">
            {(() => {
              const filteredMessages = timelineMessages.filter(msg => {
                const matchesSearch = msg.text.toLowerCase().includes(timelineSearch.toLowerCase()) ||
                                      msg.agent.toLowerCase().includes(timelineSearch.toLowerCase());
                const matchesAgent = timelineFilter === "all" || msg.agent === timelineFilter;
                return matchesSearch && matchesAgent;
              });

              if (filteredMessages.length === 0) {
                return (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-550 text-[10px] italic py-10 text-center select-none space-y-1.5">
                    <span>No conversation logs.</span>
                    <span>Initialize generation pipeline or reset search keywords.</span>
                  </div>
                );
              }

              return filteredMessages.map((msg) => {
                const AgentIcon = msg.icon;
                
                return (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, x: 10, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="p-3 rounded-xl border border-white/5 bg-[#050505]/40 hover:bg-[#0B0B0F]/90 transition-all flex items-start space-x-3 text-left relative"
                  >
                    {/* Slack-like Avatar */}
                    <div className={`h-7 w-7 rounded-lg bg-zinc-950 border border-white/5 flex items-center justify-center flex-shrink-0 ${msg.iconColor}`}>
                      <AgentIcon className="h-4 w-4" />
                    </div>

                    {/* Slack-like Content Area */}
                    <div className="flex-grow min-w-0 space-y-1">
                      {/* Name, Role & Time row */}
                      <div className="flex items-baseline space-x-2 select-none">
                        <span className="text-white font-extrabold text-[10px]">
                          {msg.name}
                        </span>
                        {msg.agent !== "user" && (
                          <span className="text-[7px] font-bold uppercase tracking-wider font-mono text-cyan-400 bg-cyan-500/10 px-1 rounded-sm border border-cyan-500/20 leading-none">
                            {msg.agent}
                          </span>
                        )}
                        <span className="text-[7.5px] text-zinc-550 font-mono">
                          {msg.time}
                        </span>
                      </div>

                      {/* Message Text Body */}
                      <div className="text-[10px] text-zinc-300 leading-normal break-words whitespace-pre-wrap select-text">
                        {renderHighlightedText(msg.text)}
                      </div>

                      {/* Collapsible/sleek reasoning attachments */}
                      {msg.reasoning && (
                        <div className="mt-1.5 pl-3 border-l-2 border-primary/40 bg-white/2 py-1 px-2 rounded-r text-[9px] text-zinc-400 italic">
                          <span className="font-bold font-mono text-[7.5px] uppercase tracking-wider text-zinc-550 block mb-0.5 select-none">
                            Thought process / Reasoning
                          </span>
                          {msg.reasoning}
                        </div>
                      )}

                      {/* Decision Details block */}
                      {msg.decision && (
                        <button
                          onClick={() => setActiveDecision(msg)}
                          className="mt-2 block text-[8px] text-primary font-bold hover:underline font-mono"
                        >
                          Show Decision Details ↗
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              });
            })()}
            <div ref={timelineEndRef} />
          </div>

          {/* Persistent chat input section */}
          <div className="border-t border-white/5 pt-3 mt-1.5 flex-shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                placeholder="Send message to database..."
                value={newMessageText}
                onChange={e => setNewMessageText(e.target.value)}
                className="flex-grow py-1.5 px-3 bg-[#050505] border border-white/5 rounded-xl text-[10px] text-white outline-none focus:border-primary transition-all font-mono"
              />
              <button
                type="submit"
                disabled={!newMessageText.trim()}
                className="py-1.5 px-3 bg-primary hover:bg-primary/95 text-[#050505] text-[10px] font-bold rounded-xl disabled:bg-zinc-800 disabled:text-zinc-550 transition-all font-mono cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>

        </aside>
      </div>

      {/* Mock browser preview modal popup */}
      <AnimatePresence>
        {previewOpen && (
          <div className="fixed inset-0 z-[10000] bg-black/75 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-4xl h-[520px] bg-[#050505] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative"
            >
              
              {/* Mock Browser Header */}
              <div className="h-10 bg-[#0B0B0F] border-b border-white/5 px-4 flex items-center justify-between select-none">
                {/* Dots */}
                <div className="flex items-center space-x-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-warning" />
                  <div className="h-2.5 w-2.5 rounded-full bg-success" />
                </div>
                {/* Navigation url bar */}
                <div className="w-1/2 bg-[#050505] border border-white/5 text-[9px] font-mono text-zinc-500 py-1 rounded-md text-center select-text">
                  https://clinic-portal-ai.run.app
                </div>
                {/* Close modal */}
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="p-1 rounded hover:bg-white/5 text-zinc-550 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Mock Browser Viewport (Healthcare Patient Registration app) */}
              <div className="flex-grow bg-[#050505] text-white flex flex-col overflow-y-auto relative font-sans">
                
                {/* Simulated App Header */}
                <header className="h-12 border-b border-white/5 bg-[#0B0B0F]/90 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-50">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 rounded-md bg-cyan-400 flex items-center justify-center font-black text-[10px] text-[#050505]">H</div>
                    <span className="font-bold text-[10px] text-white">HealthPortal AI</span>
                  </div>
                  <nav className="flex space-x-4 text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                    <span className="text-white">Overview</span>
                    <span>Schedules</span>
                    <span>Patients</span>
                  </nav>
                </header>
                
                {/* Simulated Content Dashboard */}
                <div className="p-6 space-y-6 text-left">
                  
                  {/* Hero */}
                  <div className="space-y-2 border-b border-white/5 pb-4">
                    <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                      Clinic Core Patient Management Dashboard
                    </h1>
                    <p className="text-zinc-400 text-[10px] leading-relaxed max-w-xl">
                      Live simulated sandbox preview running on Next.js frontend code layers. Test functionality by adding patient items directly.
                    </p>
                  </div>

                  {/* Visual metrics cards */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Active patients queue", value: demoPatients.length },
                      { label: "Doctors on duty", value: 4 },
                      { label: "Vulnerability checks status", value: "PASSED", color: "text-success font-bold" }
                    ].map((metric, idx) => (
                      <div key={idx} className="p-3 border border-white/5 bg-[#0B0B0F] rounded-xl text-left">
                        <span className="text-[8px] font-mono text-zinc-550 uppercase tracking-wider block leading-none mb-1.5">{metric.label}</span>
                        <span className={`text-base font-extrabold tracking-tight font-mono text-white ${metric.color || ""}`}>
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Form & List columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Add Form */}
                    <div className="p-4 border border-white/5 bg-[#0B0B0F]/70 rounded-xl space-y-3">
                      <h3 className="text-xs font-bold text-white">Register Patient</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">Patient Name</label>
                          <input
                            type="text"
                            value={demoInput}
                            onChange={(e) => setDemoInput(e.target.value)}
                            placeholder="Patient Full Name"
                            className="w-full p-2 text-xs bg-[#050505] border border-white/5 rounded-lg text-white outline-none focus:border-cyan-400 select-text"
                          />
                        </div>
                        <button
                          onClick={() => {
                            if (!demoInput.trim()) return;
                            setDemoPatients([
                              ...demoPatients,
                              { id: Date.now(), name: demoInput, time: "11:45 AM", status: "Scheduled" }
                            ]);
                            setDemoInput("");
                          }}
                          className="w-full py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-350 text-[#050505] text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Register Patient
                        </button>
                      </div>
                    </div>

                    {/* Patients List queue */}
                    <div className="p-4 border border-white/5 bg-[#0B0B0F]/70 rounded-xl space-y-3">
                      <h3 className="text-xs font-bold text-white">Active Queue</h3>
                      <div className="space-y-2">
                        {demoPatients.map(patient => (
                          <div key={patient.id} className="flex justify-between items-center p-2 bg-[#050505] border border-white/5 rounded-lg text-[10px]">
                            <span>{patient.name}</span>
                            <div className="flex items-center space-x-2 text-zinc-500 font-mono">
                              <span>{patient.time}</span>
                              <span className="px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 font-bold scale-90 font-sans">{patient.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. DECISION DETAILS SIDE DRAWER */}
      <AnimatePresence>
        {activeDecision && activeDecision.decision && (
          <>
            {/* Backdrop click indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDecision(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[11000] cursor-pointer"
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="fixed inset-y-0 right-0 z-[11005] w-[420px] bg-[#07070A]/95 border-l border-white/10 shadow-2xl flex flex-col select-text"
            >
              
              {/* Drawer Header */}
              <div className="h-14 border-b border-white/5 bg-[#050505] px-6 flex items-center justify-between select-none flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                    Architectural Decision Log
                  </span>
                </div>
                <button
                  onClick={() => setActiveDecision(null)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-550 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Body Scroll */}
              <div className="flex-grow p-6 space-y-6 overflow-y-auto custom-scrollbar text-xs leading-relaxed text-left min-h-0">
                
                {/* Agent Owner Signature Card */}
                <div className="flex items-center space-x-3 pb-4 border-b border-white/5 select-none">
                  <div className={`p-2 rounded-xl bg-[#050505] border border-white/5 ${activeDecision.iconColor}`}>
                    {React.createElement(activeDecision.icon, { className: "h-5 w-5" })}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-extrabold text-[12px]">{activeDecision.agent}</span>
                    <span className="text-[9px] text-zinc-500 font-mono">Owner Token ID: {activeDecision.name}</span>
                  </div>
                </div>

                {/* Core Question */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block leading-none">Decision Topic</span>
                  <h4 className="text-white font-bold text-[14px] leading-snug">{activeDecision.decision.question}</h4>
                </div>

                {/* Answer box */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block leading-none">Resolution Blueprint</span>
                  <p className="text-zinc-200 bg-[#050505] border border-white/5 p-4 rounded-2xl italic font-sans font-medium text-[11.5px] leading-relaxed shadow-inner">
                    "{activeDecision.decision.answer}"
                  </p>
                </div>

                {/* Detailed Reasoning */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block leading-none">Reasoning & Justification</span>
                  <p className="text-zinc-400 font-sans leading-relaxed text-[11px]">
                    {activeDecision.decision.reasoning}
                  </p>
                </div>

                {/* Alternatives rejected */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block leading-none">Alternatives Rejected</span>
                  <p className="text-zinc-450 font-sans leading-relaxed text-[11px] bg-red-950/5 border border-red-900/10 p-3.5 rounded-xl text-red-350">
                    {activeDecision.decision.alternatives}
                  </p>
                </div>

                {/* Trade-offs & Risks */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block leading-none">Trade-offs & Constraints</span>
                  <p className="text-zinc-400 font-sans leading-relaxed text-[11px]">
                    {activeDecision.decision.tradeoffs}
                  </p>
                </div>

                {/* Gauge Info Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  
                  {/* Confidence Gauge */}
                  <div className="p-3.5 rounded-xl border border-white/5 bg-[#050505]/40 space-y-2">
                    <span className="text-[8px] font-mono text-zinc-555 uppercase tracking-widest block leading-none">Confidence</span>
                    <div className="flex items-end space-x-2">
                      <span className="text-emerald-400 font-extrabold text-[15px] leading-none">{activeDecision.decision.confidence}%</span>
                      <span className="text-[8px] text-zinc-555 pb-0.5 leading-none">High certainty</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 animate-pulse" style={{ width: `${activeDecision.decision.confidence}%` }} />
                    </div>
                  </div>

                  {/* Impact scale */}
                  <div className="p-3.5 rounded-xl border border-white/5 bg-[#050505]/40 space-y-2">
                    <span className="text-[8px] font-mono text-zinc-555 uppercase tracking-widest block leading-none">System Impact</span>
                    <p className="text-primary font-bold text-[9.5px] leading-normal">{activeDecision.decision.impact}</p>
                  </div>

                </div>

                {/* Dependencies list */}
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono text-zinc-555 uppercase tracking-widest block leading-none">Dependencies</span>
                    <span className="text-zinc-400 font-mono text-[10px] font-bold block leading-normal">{activeDecision.decision.dependencies}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono text-zinc-555 uppercase tracking-widest block leading-none">Future Enhancements</span>
                    <span className="text-zinc-400 font-mono text-[10px] font-bold block leading-normal">{activeDecision.decision.futureImprovements}</span>
                  </div>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="h-14 border-t border-white/5 bg-[#050505] px-6 flex items-center justify-end select-none flex-shrink-0">
                <button
                  onClick={() => setActiveDecision(null)}
                  className="px-4.5 py-1.5 rounded-lg border border-white/5 bg-white/2 hover:bg-white/5 text-[10px] font-bold text-zinc-350 hover:text-white transition-all cursor-pointer"
                >
                  Close Drawer
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 6. Spotlight Command Palette */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <div className="fixed inset-0 z-[12000] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 p-6 select-none">
            
            {/* Click backdrop to close */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setCommandPaletteOpen(false)} />

            <motion.div
              initial={{ scale: 0.96, y: -8, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: -8, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="w-full max-w-lg bg-[#07070A]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative z-10"
            >
              {/* Search Box */}
              <div className="relative flex items-center h-12 border-b border-white/5 bg-[#050505] px-4">
                <Search className="h-4.5 w-4.5 text-zinc-550 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Type a command or search actions..."
                  value={commandSearch}
                  onChange={e => setCommandSearch(e.target.value)}
                  className="w-full bg-transparent text-white text-[12px] font-mono outline-none placeholder-zinc-555"
                  autoFocus
                />
                <span className="text-[8px] font-mono text-zinc-650 bg-white/2 border border-white/5 px-1.5 py-0.5 rounded select-none uppercase">
                  Ctrl+K
                </span>
              </div>

              {/* Commands List */}
              <div className="p-2 max-h-[300px] overflow-y-auto custom-scrollbar space-y-0.5 min-h-[150px]">
                {(() => {
                  const commandsList = [
                    {
                      id: "run-pipeline",
                      label: "Start AI Project Generation",
                      shortcut: "Alt+R",
                      action: () => {
                        runGenerationPipeline();
                        setCommandPaletteOpen(false);
                      }
                    },
                    {
                      id: "deploy-app",
                      label: "Production Deploy to Cloud Run",
                      shortcut: "Alt+D",
                      action: () => {
                        handleDeployReal();
                        setCommandPaletteOpen(false);
                      }
                    },
                    {
                      id: "search-files",
                      label: "Find Files by Name...",
                      shortcut: "Ctrl+P",
                      action: () => {
                        setCommandPaletteOpen(false);
                        setQuickFileSearchOpen(true);
                      }
                    },
                    {
                      id: "toggle-tree",
                      label: "Toggle left File Explorer panel",
                      shortcut: "Ctrl+B",
                      action: () => {
                        setSidebarCollapsed(prev => !prev);
                        setCommandPaletteOpen(false);
                      }
                    },
                    {
                      id: "focus-ai-timeline",
                      label: "Focus AI Collaborative Chat Search",
                      shortcut: "Ctrl+/",
                      action: () => {
                        setCommandPaletteOpen(false);
                        const searchInput = document.getElementById("timeline-search-input");
                        searchInput?.focus();
                      }
                    },
                    {
                      id: "theme-config",
                      label: "Open Settings / Workspace Config",
                      shortcut: "Alt+S",
                      action: () => {
                        setActiveSidebarTab("settings");
                        setSidebarCollapsed(false);
                        setCommandPaletteOpen(false);
                      }
                    }
                  ];

                  const filteredCommands = commandsList.filter(cmd =>
                    cmd.label.toLowerCase().includes(commandSearch.toLowerCase())
                  );

                  if (filteredCommands.length === 0) {
                    return (
                      <div className="py-10 text-center text-zinc-555 text-[10px] italic">
                        No matching commands found.
                      </div>
                    );
                  }

                  return filteredCommands.map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-zinc-355 hover:text-white hover:bg-white/3 flex items-center justify-between text-[11px] transition-colors cursor-pointer"
                    >
                      <span className="font-medium">{cmd.label}</span>
                      <span className="text-[9px] font-mono text-zinc-555">{cmd.shortcut}</span>
                    </button>
                  ));
                })()}
              </div>

              {/* Footer */}
              <div className="h-8 bg-[#050505] px-4 border-t border-white/5 flex items-center justify-between text-[8px] text-zinc-555 font-mono select-none">
                <span>↑↓ Navigation</span>
                <span>Enter to execute</span>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. Quick File Search Palette */}
      <AnimatePresence>
        {quickFileSearchOpen && (
          <div className="fixed inset-0 z-[12000] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 p-6 select-none">
            
            {/* Click backdrop to close */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setQuickFileSearchOpen(false)} />

            <motion.div
              initial={{ scale: 0.96, y: -8, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: -8, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="w-full max-w-lg bg-[#07070A]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative z-10"
            >
              {/* Search Box */}
              <div className="relative flex items-center h-12 border-b border-white/5 bg-[#050505] px-4">
                <Search className="h-4.5 w-4.5 text-zinc-550 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search generated file names..."
                  value={fileSearch}
                  onChange={e => setFileSearch(e.target.value)}
                  className="w-full bg-transparent text-white text-[12px] font-mono outline-none placeholder-zinc-555"
                  autoFocus
                />
                <span className="text-[8px] font-mono text-zinc-650 bg-white/2 border border-white/5 px-1.5 py-0.5 rounded select-none uppercase">
                  Ctrl+P
                </span>
              </div>

              {/* Files List */}
              <div className="p-2 max-h-[300px] overflow-y-auto custom-scrollbar space-y-0.5 min-h-[150px]">
                {(() => {
                  const filteredSearchFiles = GENERATION_STEPS.filter(step => {
                    if (step.type !== "file") return false;
                    return step.name.toLowerCase().includes(fileSearch.toLowerCase()) ||
                           step.path.toLowerCase().includes(fileSearch.toLowerCase());
                  });

                  if (filteredSearchFiles.length === 0) {
                    return (
                      <div className="py-10 text-center text-zinc-555 text-[10px] italic">
                        No generated files match keyword.
                      </div>
                    );
                  }

                  return filteredSearchFiles.map((file) => (
                    <button
                      key={file.path}
                      onClick={() => {
                        const node = findFileNode(FILE_TREE, file.path);
                        if (node) {
                          setCenterViewTab("code");
                          if (!openTabs.includes(file.path)) {
                            setOpenTabs(prev => [...prev, file.path]);
                          }
                          setActiveTab(file.path);
                        }
                        setQuickFileSearchOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-zinc-350 hover:text-white hover:bg-white/3 flex items-center justify-between text-[11px] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        {getFileIcon(file.name)}
                        <span className="font-mono text-xs">{file.name}</span>
                      </div>
                      <span className="text-[8px] font-mono text-zinc-555">{file.path}</span>
                    </button>
                  ));
                })()}
              </div>

              {/* Footer */}
              <div className="h-8 bg-[#050505] px-4 border-t border-white/5 flex items-center justify-between text-[8px] text-zinc-555 font-mono select-none">
                <span>Select file to open in code editor view</span>
                <span>esc to close</span>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. Reviewer AI Codebase Audit Report */}
      <AnimatePresence>
        {reviewerModalOpen && (
          <div className="fixed inset-0 z-[12000] bg-black/75 backdrop-blur-md flex items-center justify-center p-6 select-none">
            
            {/* Click backdrop to close */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setReviewerModalOpen(false)} />

            <motion.div
              initial={{ scale: 0.94, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 12, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-[#07070A]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative z-10 text-left"
            >
              {/* Header */}
              <div className="h-14 border-b border-white/5 bg-[#050505] px-6 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-2.5">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                    Reviewer AI Quality Audit Report
                  </span>
                </div>
                <button
                  onClick={() => setReviewerModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-550 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Audit Content */}
              <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar max-h-[420px] min-h-0">
                
                {/* Overall grade ribbon */}
                <div className="flex items-center justify-between bg-primary/5 border border-primary/20 p-4 rounded-xl">
                  <div className="space-y-1 text-left">
                    <h3 className="text-white font-bold text-sm">Code Quality Assessment</h3>
                    <p className="text-[10px] text-zinc-450 leading-relaxed font-mono">
                      Evaluation completed with 98% pass rate based on strict static schemas.
                    </p>
                  </div>
                  <div className="h-14 w-14 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-emerald-950/20 text-emerald-400 font-extrabold text-2xl shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    A+
                  </div>
                </div>

                {/* Grid Scores */}
                <div className="space-y-2">
                  <span className="text-[8px] font-mono text-zinc-550 uppercase tracking-widest block leading-none">Metric Evaluations</span>
                  <div className="grid grid-cols-2 gap-3.5">
                    {[
                      { label: "Architecture", val: 96, col: "text-indigo-400" },
                      { label: "Code Quality", val: 98, col: "text-emerald-400" },
                      { label: "Performance", val: 99, col: "text-cyan-400" },
                      { label: "Security", val: 95, col: "text-amber-400" },
                      { label: "Accessibility", val: 92, col: "text-rose-400" },
                      { label: "Maintainability", val: 97, col: "text-purple-400" }
                    ].map(metric => (
                      <div key={metric.label} className="p-3 rounded-lg border border-white/3 bg-[#050505]/40 space-y-1 text-left">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-zinc-450">{metric.label}</span>
                          <strong className={metric.col}>{metric.val}/100</strong>
                        </div>
                        <div className="w-full h-1 bg-white/2 rounded-full overflow-hidden">
                          <div className={`h-full ${metric.col.replace("text-", "bg-")}`} style={{ width: `${metric.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions List */}
                <div className="space-y-2">
                  <span className="text-[8px] font-mono text-zinc-555 uppercase tracking-widest block leading-none">Optimization Suggestions</span>
                  <div className="space-y-2">
                    {[
                      "Implement static cache headers on backend routes for 12ms speedups.",
                      "Use edge container scaling triggers to reduce baseline cold-start latency.",
                      "Enable bundle compression algorithms (Gzip/Brotli) to shrink client overhead."
                    ].map((s, idx) => (
                      <div key={idx} className="flex items-start space-x-2.5 text-[10px] text-zinc-400 leading-normal">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="h-14 border-t border-white/5 bg-[#050505] px-6 flex items-center justify-between flex-shrink-0">
                <span className="text-[8px] font-mono text-zinc-555">Reviewed by Reviewer AI (Judge)</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setReviewerModalOpen(false);
                      handleDeployReal();
                    }}
                    className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/95 text-[10px] font-bold text-white transition-all cursor-pointer text-center select-none"
                  >
                    Proceed to Deployment
                  </button>
                  <button
                    onClick={() => setReviewerModalOpen(false)}
                    className="px-4 py-1.5 rounded-lg border border-white/5 bg-white/2 hover:bg-white/5 text-[10px] font-bold text-zinc-355 hover:text-white transition-all cursor-pointer select-none"
                  >
                    Acknowledge
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. DevOps Deploy Cockpit Dashboard */}
      <AnimatePresence>
        {deployDashboardOpen && (
          <div className="fixed inset-0 z-[12000] bg-black/75 backdrop-blur-md flex items-center justify-center p-6 select-none">
            
            {/* Backdrop click blocker */}
            <div className="absolute inset-0" onClick={() => {
              if (deployStage === 6) setDeployDashboardOpen(false);
            }} />

            <motion.div
              initial={{ scale: 0.94, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 12, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-xl bg-[#07070A]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative z-10 text-left"
            >
              {/* Header */}
              <div className="h-14 border-b border-white/5 bg-[#050505] px-6 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-2.5">
                  <CloudLightning className="h-4.5 w-4.5 text-primary animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                    Production Cloud Run Deployment
                  </span>
                </div>
                {deployStage === 6 && (
                  <button
                    onClick={() => setDeployDashboardOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Progress Cockpit content */}
              <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar max-h-[420px] min-h-0 text-left">
                
                {/* Stepper tracker progress */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-zinc-500">Pipeline Execution</span>
                    <strong className="text-primary uppercase">
                      {deployStage === 6 ? "Deployment Live" : `Executing Stage ${deployStage + 1} / 7`}
                    </strong>
                  </div>
                  
                  {/* Bullet progress chain */}
                  <div className="flex items-center justify-between bg-[#050505] border border-white/5 px-4 py-3 rounded-xl">
                    {[
                      "Prepare",
                      "Bundle",
                      "Test",
                      "Optimize",
                      "Upload",
                      "Deploy",
                      "Live"
                    ].map((stepLabel, idx) => {
                      const isDone = idx < deployStage;
                      const isActive = idx === deployStage;

                      return (
                        <React.Fragment key={stepLabel}>
                          <div className="flex flex-col items-center space-y-1.5">
                            <span className={`h-5 w-5 rounded-full border text-[8px] font-extrabold flex items-center justify-center transition-all ${
                              isDone
                                ? "bg-success/15 border-success text-success"
                                : isActive
                                ? "bg-primary/20 border-primary text-primary animate-pulse shadow-[0_0_8px_rgba(79,124,255,0.4)]"
                                : "bg-white/2 border-white/5 text-zinc-650"
                            }`}>
                              {isDone ? "✓" : idx + 1}
                            </span>
                            <span className={`text-[8px] font-mono font-bold uppercase tracking-wider ${
                              isDone ? "text-success" : isActive ? "text-primary" : "text-zinc-600"
                            }`}>
                              {stepLabel}
                            </span>
                          </div>
                          
                          {idx < 6 && (
                            <div className={`flex-grow h-0.5 mx-1 transition-all ${
                              idx < deployStage ? "bg-success" : idx === deployStage ? "bg-primary/50" : "bg-white/5"
                            }`} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* Display deployed stats on complete */}
                {deployStage === 6 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Destination url banner */}
                    <div className="bg-[#050505] border border-white/5 p-4 rounded-xl flex items-center justify-between select-text">
                      <div className="text-left space-y-0.5">
                        <span className="text-[7px] font-mono text-zinc-555 uppercase tracking-widest block leading-none">Production Endpoint URL</span>
                        <a
                          href={vercelUrl || "https://clinic-portal-ai.run.app"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 font-mono text-xs font-bold hover:underline flex items-center gap-1"
                        >
                          {vercelUrl || "https://clinic-portal-ai.run.app"} <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(vercelUrl || "https://clinic-portal-ai.run.app");
                        }}
                        className="px-3 py-1 rounded border border-white/5 hover:bg-white/5 text-zinc-400 hover:text-white text-[9px] font-mono transition-all cursor-pointer"
                      >
                        Copy Link
                      </button>
                    </div>

                    {/* Audit Scores Grid */}
                    <div className="grid grid-cols-4 gap-3 select-none">
                      {[
                        { label: "Performance", score: 99, col: "text-emerald-400 border-emerald-500/25" },
                        { label: "Accessibility", score: 98, col: "text-cyan-400 border-cyan-500/25" },
                        { label: "Best Practices", score: 100, col: "text-indigo-400 border-indigo-500/25" },
                        { label: "SEO Status", score: 100, col: "text-purple-400 border-purple-500/25" }
                      ].map(metric => (
                        <div key={metric.label} className={`p-2 rounded-xl border bg-[#050505]/40 text-center flex flex-col items-center justify-center space-y-1 ${metric.col}`}>
                          <span className="text-[7px] font-mono text-zinc-555 uppercase tracking-widest">{metric.label}</span>
                          <strong className="text-[15px] font-mono leading-none">{metric.score}</strong>
                        </div>
                      ))}
                    </div>

                    {/* Sizing & Deploy timings */}
                    <div className="grid grid-cols-3 gap-3 font-mono text-[9px] text-zinc-450 select-none bg-[#050505]/30 p-3 rounded-xl border border-white/5 text-center">
                      <div>
                        <span className="text-zinc-555 block mb-0.5 uppercase tracking-wider text-[7.5px]">Avg Latency</span>
                        <strong className="text-white text-xs">99ms</strong>
                      </div>
                      <div>
                        <span className="text-zinc-555 block mb-0.5 uppercase tracking-wider text-[7.5px]">Bundle Size</span>
                        <strong className="text-white text-xs">72.4 KB (gzip)</strong>
                      </div>
                      <div>
                        <span className="text-zinc-555 block mb-0.5 uppercase tracking-wider text-[7.5px]">Compile Time</span>
                        <strong className="text-white text-xs">6.4 seconds</strong>
                      </div>
                    </div>

                  </motion.div>
                )}

              </div>

              {/* Footer */}
              <div className="h-14 border-t border-white/5 bg-[#050505] px-6 flex items-center justify-between flex-shrink-0">
                <span className="text-[8px] font-mono text-zinc-555 uppercase">DevOps Sandbox Node</span>
                {deployStage === 6 ? (
                  <a
                    href={vercelUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setDeployDashboardOpen(false)}
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-450 text-[10px] font-bold text-[#050505] transition-all cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)] flex items-center"
                  >
                    Open Live Website
                  </a>
                ) : (
                  <div className="flex items-center space-x-2 text-[10px] text-zinc-400 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                    <span>Uploading build assets...</span>
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 10. Version Compare Dialog Modal Overlay */}
      <AnimatePresence>
        {compareOpen && (
          <div className="fixed inset-0 z-[12000] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 select-none">
            
            {/* Backdrop click blocker */}
            <div className="absolute inset-0" onClick={() => setCompareOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-4xl h-[80vh] bg-[#07070A]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative z-10 text-left"
            >
              {/* Header */}
              <div className="h-14 border-b border-white/5 bg-[#050505] px-6 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-2.5">
                  <History className="h-4.5 w-4.5 text-primary" />
                  <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                    Workspace Snapshots Compare
                  </span>
                </div>
                <button
                  onClick={() => setCompareOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Selectors Bar */}
              <div className="bg-[#050505]/40 border-b border-white/5 p-4 flex flex-col sm:flex-row gap-4 items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <div className="space-y-1">
                    <label className="text-[8px] font-mono text-zinc-550 uppercase block leading-none">Version A (Left Base)</label>
                    <select
                      value={compareLeft || ""}
                      onChange={(e) => {
                        setCompareLeft(e.target.value || null);
                        setSelectedCompareFile(null);
                      }}
                      className="bg-zinc-950 border border-white/5 rounded px-2.5 py-1 text-[10px] font-mono text-white outline-none focus:border-primary cursor-pointer w-48"
                    >
                      <option value="">Select version...</option>
                      {projectVersions.map(v => (
                        <option key={v.id} value={v.id}>Version {v.version} ({v.summary.slice(0, 20)}...)</option>
                      ))}
                    </select>
                  </div>

                  <span className="text-zinc-750 pt-3">➡</span>

                  <div className="space-y-1">
                    <label className="text-[8px] font-mono text-zinc-555 uppercase block leading-none">Version B (Right Target)</label>
                    <select
                      value={compareRight || ""}
                      onChange={(e) => {
                        setCompareRight(e.target.value || null);
                        setSelectedCompareFile(null);
                      }}
                      className="bg-zinc-950 border border-white/5 rounded px-2.5 py-1 text-[10px] font-mono text-white outline-none focus:border-primary cursor-pointer w-48"
                    >
                      <option value="">Select version...</option>
                      {projectVersions.map(v => (
                        <option key={v.id} value={v.id}>Version {v.version} ({v.summary.slice(0, 20)}...)</option>
                      ))}
                    </select>
                  </div>
                </div>

                {leftSnapshot && rightSnapshot && (
                  <div className="flex items-center space-x-2 text-[9px] font-mono text-zinc-500">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                      {comparedFilesList.filter(f => f.status === "added").length} Added
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">
                      {comparedFilesList.filter(f => f.status === "modified").length} Modified
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">
                      {comparedFilesList.filter(f => f.status === "deleted").length} Deleted
                    </span>
                  </div>
                )}
              </div>

              {/* Main Comparison Split Content */}
              <div className="flex-grow flex min-h-0">
                {isLoadingCompare ? (
                  <div className="flex-grow flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-[10px] font-mono text-zinc-550">Resolving snapshot files data...</span>
                  </div>
                ) : !leftSnapshot || !rightSnapshot ? (
                  <div className="flex-grow flex flex-col items-center justify-center text-center p-6 text-zinc-600 font-mono text-[10px] space-y-2 select-none">
                    <History className="h-8 w-8 text-zinc-800" />
                    <span>Please select both Version A and Version B snapshots in the selectors above to run compare.</span>
                  </div>
                ) : (
                  <>
                    {/* Left File List Panel */}
                    <div className="w-1/4 border-r border-white/5 bg-[#050505]/20 flex flex-col min-h-0 overflow-y-auto custom-scrollbar p-3 space-y-1 flex-shrink-0">
                      <span className="text-[8px] font-mono text-zinc-600 uppercase font-bold tracking-wider block mb-2 select-none">Files List</span>
                      {comparedFilesList.map(file => {
                        const isSelected = selectedCompareFile === file.path || (!selectedCompareFile && file.path === activeCompareFile?.path);
                        return (
                          <button
                            key={file.path}
                            onClick={() => setSelectedCompareFile(file.path)}
                            className={`w-full text-left py-1.5 px-2 rounded-lg font-mono text-[9px] flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? "bg-white/5 border border-white/10 text-white"
                                : "hover:bg-white/2 border border-transparent text-zinc-450 hover:text-white"
                            }`}
                          >
                            <span className="truncate pr-2">{file.path.split("/").pop()}</span>
                            {file.status === "added" && <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded">ADD</span>}
                            {file.status === "deleted" && <span className="text-[8px] font-bold text-red-400 bg-red-500/10 px-1 rounded">DEL</span>}
                            {file.status === "modified" && <span className="text-[8px] font-bold text-amber-400 bg-amber-500/10 px-1 rounded">MOD</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Right File Diff Code Editor Panel */}
                    <div className="flex-grow flex flex-col min-h-0 bg-[#050505]/45 overflow-hidden">
                      {activeCompareFile ? (
                        <div className="flex-grow flex flex-col min-h-0">
                          {/* File Path Header */}
                          <div className="h-9 px-4 border-b border-white/5 flex items-center justify-between flex-shrink-0 bg-[#050505]/70 select-none">
                            <span className="text-[9px] font-mono text-zinc-400">{activeCompareFile.path}</span>
                            <span className="text-[8px] font-mono uppercase text-zinc-500">
                              {activeCompareFile.status}
                            </span>
                          </div>

                          {/* Code Viewers Split */}
                          <div className="flex-grow flex min-h-0 overflow-y-auto custom-scrollbar font-mono text-[10px] leading-relaxed p-4 select-text">
                            <div className="w-1/2 pr-3 border-r border-white/5">
                              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block mb-2 select-none font-bold">Version A Content</span>
                              {activeCompareFile.leftContent ? (
                                <pre className="whitespace-pre-wrap break-all text-zinc-400">{activeCompareFile.leftContent}</pre>
                              ) : (
                                <div className="h-32 flex items-center justify-center text-zinc-650 italic select-none">File does not exist in Version A</div>
                              )}
                            </div>
                            <div className="w-1/2 pl-3">
                              <span className="text-[8px] font-mono text-zinc-550 uppercase tracking-wider block mb-2 select-none font-bold">Version B Content</span>
                              {activeCompareFile.rightContent ? (
                                <pre className="whitespace-pre-wrap break-all text-zinc-200">{activeCompareFile.rightContent}</pre>
                              ) : (
                                <div className="h-32 flex items-center justify-center text-zinc-650 italic select-none">File does not exist in Version B</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-grow flex items-center justify-center text-zinc-650 font-mono text-[10px]">No file selected</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Share Link Toast Notice */}
      <AnimatePresence>
        {shareNotice && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 z-[10005] bg-[#0B0B0F] border border-success/30 px-4 py-2.5 rounded-xl shadow-2xl flex items-center space-x-2"
          >
            <Check className="h-4 w-4 text-success" />
            <span className="text-xs text-white">Link copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
