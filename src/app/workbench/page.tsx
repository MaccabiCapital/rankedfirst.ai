"use client";

import * as React from "react";
import Link from "next/link";
import { agents } from "@/lib/site-data";

// ============================================================
// Types
// ============================================================

type Priority = "High" | "Medium" | "Low";
type Status = "Pending" | "In Progress" | "Review" | "Done" | "Overdue";
type AssigneeType = "Agent" | "Human";

interface Task {
  id: string;
  name: string;
  description: string;
  client: string;
  dueDate: string; // ISO YYYY-MM-DD
  priority: Priority;
  status: Status;
  assigneeType: AssigneeType;
  assigneeName: string;
  notes?: string;
}

// ============================================================
// Demo Data
// ============================================================

const CLIENTS = [
  "Morrison Plumbing Buffalo",
  "Bright Smile Dental Vaughan",
  "Pacific Legal Group",
  "GreenLeaf HVAC Toronto",
  "Oakwood Chiropractic",
  "Summit Financial Advisors",
  "Riverstone Roofing Calgary",
];

// Reference today for relative dates
const today = new Date();
const d = (offsetDays: number): string => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + offsetDays);
  return dt.toISOString().slice(0, 10);
};

const DEMO_TASKS: Task[] = [
  {
    id: "t1",
    name: "Run monthly GBP audit",
    description: "Full profile audit — categories, attributes, photos, Q&A.",
    client: "Morrison Plumbing Buffalo",
    dueDate: d(3),
    priority: "High",
    status: "In Progress",
    assigneeType: "Agent",
    assigneeName: "GBP Optimization Agent",
    notes: "Focus on emergency-service attributes this month.",
  },
  {
    id: "t2",
    name: "Geogrid scan — 9×9 grid",
    description: "Weekly geogrid scan across service area.",
    client: "Morrison Plumbing Buffalo",
    dueDate: d(1),
    priority: "High",
    status: "In Progress",
    assigneeType: "Agent",
    assigneeName: "Geogrid Analysis Agent",
  },
  {
    id: "t3",
    name: "Review client proposal",
    description: "Review and finalize the Q2 strategy proposal before sending.",
    client: "Bright Smile Dental Vaughan",
    dueDate: d(-2),
    priority: "High",
    status: "Overdue",
    assigneeType: "Human",
    assigneeName: "Sarah Chen",
    notes: "Client is waiting. Needs exec sign-off.",
  },
  {
    id: "t4",
    name: "NAP audit — 20 directories",
    description: "Audit citation consistency and queue corrections.",
    client: "Bright Smile Dental Vaughan",
    dueDate: d(5),
    priority: "Medium",
    status: "Pending",
    assigneeType: "Agent",
    assigneeName: "Local Citations Agent",
  },
  {
    id: "t5",
    name: "Draft response to 3-star review",
    description: "Patient left critical review. Draft empathetic HIPAA-safe response.",
    client: "Bright Smile Dental Vaughan",
    dueDate: d(0),
    priority: "High",
    status: "Review",
    assigneeType: "Agent",
    assigneeName: "Review Management Agent",
  },
  {
    id: "t6",
    name: "AI visibility benchmark report",
    description: "Run baseline AI mention scan across ChatGPT, Gemini, Perplexity.",
    client: "Pacific Legal Group",
    dueDate: d(7),
    priority: "Medium",
    status: "Pending",
    assigneeType: "Agent",
    assigneeName: "AI Visibility Agent",
    notes: "New client onboarding — first AI scan.",
  },
  {
    id: "t7",
    name: "Onboarding call prep",
    description: "Prepare deck and agenda for Pacific Legal Group kickoff.",
    client: "Pacific Legal Group",
    dueDate: d(-1),
    priority: "High",
    status: "Done",
    assigneeType: "Human",
    assigneeName: "Marcus Webb",
  },
  {
    id: "t8",
    name: "Monthly client report",
    description: "Assemble and send monthly visibility report.",
    client: "Pacific Legal Group",
    dueDate: d(4),
    priority: "Medium",
    status: "Pending",
    assigneeType: "Agent",
    assigneeName: "Local Reporting Agent",
  },
  {
    id: "t9",
    name: "LSA market position check",
    description: "Audit LSA ranking and competitor activity in Toronto metro.",
    client: "GreenLeaf HVAC Toronto",
    dueDate: d(2),
    priority: "High",
    status: "In Progress",
    assigneeType: "Agent",
    assigneeName: "LSA Ads Agent",
  },
  {
    id: "t10",
    name: "Review velocity analysis",
    description: "Check review rate vs. target; flag if below threshold.",
    client: "GreenLeaf HVAC Toronto",
    dueDate: d(-3),
    priority: "Medium",
    status: "Overdue",
    assigneeType: "Agent",
    assigneeName: "Review Management Agent",
    notes: "Fell behind after agent config change last week.",
  },
  {
    id: "t11",
    name: "Update service area on GBP",
    description: "Client expanded service radius — update profile accordingly.",
    client: "GreenLeaf HVAC Toronto",
    dueDate: d(6),
    priority: "Low",
    status: "Pending",
    assigneeType: "Human",
    assigneeName: "Sarah Chen",
  },
  {
    id: "t12",
    name: "Geogrid baseline scan",
    description: "Initial 7×7 geogrid for new client onboarding.",
    client: "Oakwood Chiropractic",
    dueDate: d(3),
    priority: "High",
    status: "Pending",
    assigneeType: "Agent",
    assigneeName: "Geogrid Analysis Agent",
    notes: "Target keyword: 'chiropractor near me'.",
  },
  {
    id: "t13",
    name: "Competitor GBP comparison",
    description: "Benchmark Oakwood Chiropractic profile vs. top 3 competitors.",
    client: "Oakwood Chiropractic",
    dueDate: d(5),
    priority: "Medium",
    status: "Pending",
    assigneeType: "Agent",
    assigneeName: "GBP Optimization Agent",
  },
  {
    id: "t14",
    name: "Present Q1 results deck",
    description: "Client QBR — present geogrid improvements and ROI highlights.",
    client: "Summit Financial Advisors",
    dueDate: d(-5),
    priority: "High",
    status: "Done",
    assigneeType: "Human",
    assigneeName: "Marcus Webb",
  },
  {
    id: "t15",
    name: "AI mention spike investigation",
    description: "Unusual drop in AI mentions detected — investigate cause.",
    client: "Summit Financial Advisors",
    dueDate: d(1),
    priority: "High",
    status: "In Progress",
    assigneeType: "Agent",
    assigneeName: "AI Visibility Agent",
  },
  {
    id: "t16",
    name: "Citation cleanup — Yelp & BBB",
    description: "Correct address mismatch flagged in last NAP audit.",
    client: "Riverstone Roofing Calgary",
    dueDate: d(0),
    priority: "Medium",
    status: "Review",
    assigneeType: "Agent",
    assigneeName: "Local Citations Agent",
  },
  {
    id: "t17",
    name: "Upsell call — AI Visibility package",
    description: "Pitch AI Visibility upgrade based on benchmark data.",
    client: "Riverstone Roofing Calgary",
    dueDate: d(8),
    priority: "Low",
    status: "Pending",
    assigneeType: "Human",
    assigneeName: "Jordan Park",
    notes: "Send capabilities overview beforehand.",
  },
  {
    id: "t18",
    name: "Generate monthly report",
    description: "Automated monthly report — rankings, reviews, citations.",
    client: "Morrison Plumbing Buffalo",
    dueDate: d(4),
    priority: "Medium",
    status: "Pending",
    assigneeType: "Agent",
    assigneeName: "Local Reporting Agent",
  },
];

// ============================================================
// Helper utilities
// ============================================================

function isOverdue(task: Task): boolean {
  if (task.status === "Done") return false;
  return task.dueDate < today.toISOString().slice(0, 10);
}

function isDueThisWeek(task: Task): boolean {
  if (task.status === "Done") return false;
  const due = new Date(task.dueDate + "T00:00:00");
  const weekOut = new Date(today);
  weekOut.setDate(weekOut.getDate() + 7);
  return due >= today && due <= weekOut;
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[month - 1]} ${day}, ${year}`;
}

// ============================================================
// Icon components
// ============================================================

function BotIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="inline-block">
      <rect x="3" y="8" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 3v5M8.5 3h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="8.5" cy="14" r="1.5" fill="currentColor" />
      <circle cx="15.5" cy="14" r="1.5" fill="currentColor" />
      <path d="M9 18h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="inline-block">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M5 12l5 5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowsIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M8 7h13M8 12h9M8 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 7l3-3-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ============================================================
// Badge styles
// ============================================================

const priorityStyles: Record<Priority, string> = {
  High: "bg-red-500/15 text-red-400 border border-red-500/25",
  Medium: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  Low: "bg-navy-700 text-navy-300 border border-navy-600",
};

const statusStyles: Record<Status, string> = {
  Pending: "bg-navy-700 text-navy-300 border border-navy-600",
  "In Progress": "bg-accent-500/15 text-accent-400 border border-accent-500/25",
  Review: "bg-purple-500/15 text-purple-400 border border-purple-500/25",
  Done: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  Overdue: "bg-red-500/15 text-red-400 border border-red-500/25",
};

// ============================================================
// New Task Modal
// ============================================================

interface NewTaskModalProps {
  onClose: () => void;
  onCreate: (task: Task) => void;
}

function NewTaskModal({ onClose, onCreate }: NewTaskModalProps) {
  const agentNames = agents.map((a) => a.name);

  const [name, setName] = React.useState("");
  const [client, setClient] = React.useState(CLIENTS[0]);
  const [dueDate, setDueDate] = React.useState(d(7));
  const [priority, setPriority] = React.useState<Priority>("Medium");
  const [assigneeType, setAssigneeType] = React.useState<AssigneeType>("Agent");
  const [agentName, setAgentName] = React.useState(agentNames[0]);
  const [humanName, setHumanName] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Task name is required.";
    if (assigneeType === "Human" && !humanName.trim())
      errs.humanName = "Team member name is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleCreate() {
    if (!validate()) return;
    const now = new Date().toISOString().slice(0, 10);
    const taskDue = dueDate;
    let status: Status = "Pending";
    if (taskDue < now) status = "Overdue";
    onCreate({
      id: "t" + Date.now(),
      name: name.trim(),
      description: notes.trim() || name.trim(),
      client,
      dueDate,
      priority,
      status,
      assigneeType,
      assigneeName: assigneeType === "Agent" ? agentName : humanName.trim(),
      notes: notes.trim() || undefined,
    });
    onClose();
  }

  // Close on backdrop click
  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-lg bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-navy-800">
          <h2 className="font-display font-bold text-lg text-white">New Task</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-navy-400 hover:text-white hover:bg-navy-800 transition-all"
          >
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Task name */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-navy-400 mb-1.5">
              Task Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Run monthly GBP audit"
              className="w-full bg-navy-800 border border-navy-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-navy-500 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 transition"
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          {/* Client */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-navy-400 mb-1.5">
              Client
            </label>
            <select
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="w-full bg-navy-800 border border-navy-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 transition"
            >
              {CLIENTS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Due date + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-navy-400 mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-navy-800 border border-navy-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 transition [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-navy-400 mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-navy-800 border border-navy-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 transition"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          {/* Assignee type toggle */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-navy-400 mb-1.5">
              Assign To
            </label>
            <div className="flex gap-2">
              {(["Agent", "Human"] as AssigneeType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setAssigneeType(type)}
                  className={[
                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-display font-medium transition-all",
                    assigneeType === type
                      ? "bg-accent-500/15 border-accent-500/50 text-accent-400"
                      : "bg-navy-800 border-navy-700 text-navy-400 hover:text-navy-200 hover:border-navy-600",
                  ].join(" ")}
                >
                  {type === "Agent" ? <BotIcon /> : <PersonIcon />}
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Agent dropdown or human name */}
          {assigneeType === "Agent" ? (
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-navy-400 mb-1.5">
                Agent
              </label>
              <select
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full bg-navy-800 border border-navy-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 transition"
              >
                {agentNames.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-navy-400 mb-1.5">
                Team Member Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={humanName}
                onChange={(e) => setHumanName(e.target.value)}
                placeholder="e.g. Sarah Chen"
                className="w-full bg-navy-800 border border-navy-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-navy-500 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 transition"
              />
              {errors.humanName && <p className="text-xs text-red-400 mt-1">{errors.humanName}</p>}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-navy-400 mb-1.5">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Optional context or instructions…"
              className="w-full bg-navy-800 border border-navy-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-navy-500 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 transition resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-navy-800 bg-navy-950/40">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-display font-medium text-navy-300 hover:text-white hover:bg-navy-800 border border-navy-700 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-5 py-2 rounded-lg text-sm font-display font-semibold bg-accent-500 hover:bg-accent-400 text-white transition-all shadow-lg shadow-accent-500/20"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Reassign Modal
// ============================================================

interface ReassignModalProps {
  task: Task;
  onClose: () => void;
  onReassign: (taskId: string, assigneeType: AssigneeType, assigneeName: string) => void;
}

function ReassignModal({ task, onClose, onReassign }: ReassignModalProps) {
  const agentNames = agents.map((a) => a.name);
  const [assigneeType, setAssigneeType] = React.useState<AssigneeType>(task.assigneeType);
  const [agentName, setAgentName] = React.useState(
    task.assigneeType === "Agent" ? task.assigneeName : agentNames[0]
  );
  const [humanName, setHumanName] = React.useState(
    task.assigneeType === "Human" ? task.assigneeName : ""
  );
  const [error, setError] = React.useState("");

  function handleSave() {
    if (assigneeType === "Human" && !humanName.trim()) {
      setError("Team member name is required.");
      return;
    }
    onReassign(task.id, assigneeType, assigneeType === "Agent" ? agentName : humanName.trim());
    onClose();
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-sm bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-navy-800">
          <h2 className="font-display font-bold text-base text-white">Reassign Task</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-navy-400 hover:text-white hover:bg-navy-800 transition-all"
          >
            <XIcon />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-navy-300 font-mono leading-relaxed">
            <span className="text-white">{task.name}</span>
            <br />
            <span className="text-navy-500">{task.client}</span>
          </p>
          <div className="flex gap-2">
            {(["Agent", "Human"] as AssigneeType[]).map((type) => (
              <button
                key={type}
                onClick={() => setAssigneeType(type)}
                className={[
                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-display font-medium transition-all",
                  assigneeType === type
                    ? "bg-accent-500/15 border-accent-500/50 text-accent-400"
                    : "bg-navy-800 border-navy-700 text-navy-400 hover:text-navy-200 hover:border-navy-600",
                ].join(" ")}
              >
                {type === "Agent" ? <BotIcon /> : <PersonIcon />}
                {type}
              </button>
            ))}
          </div>
          {assigneeType === "Agent" ? (
            <select
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="w-full bg-navy-800 border border-navy-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 transition"
            >
              {agentNames.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          ) : (
            <div>
              <input
                type="text"
                value={humanName}
                onChange={(e) => { setHumanName(e.target.value); setError(""); }}
                placeholder="Team member name"
                className="w-full bg-navy-800 border border-navy-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-navy-500 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 transition"
              />
              {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-navy-800 bg-navy-950/40">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-display font-medium text-navy-300 hover:text-white hover:bg-navy-800 border border-navy-700 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg text-sm font-display font-semibold bg-accent-500 hover:bg-accent-400 text-white transition-all shadow-lg shadow-accent-500/20"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Task Row (desktop table row)
// ============================================================

interface TaskRowProps {
  task: Task;
  onMarkDone: (id: string) => void;
  onReassign: (task: Task) => void;
}

function TaskRow({ task, onMarkDone, onReassign }: TaskRowProps) {
  const overdue = isOverdue(task);
  const effectiveStatus: Status = overdue && task.status !== "Done" ? "Overdue" : task.status;

  return (
    <tr className="border-b border-navy-800/60 hover:bg-navy-800/30 transition-colors group">
      {/* Task name */}
      <td className="px-4 py-3.5 min-w-[180px]">
        <p className="text-sm font-display font-medium text-white leading-snug">{task.name}</p>
        {task.description !== task.name && (
          <p className="text-xs text-navy-500 mt-0.5 leading-relaxed line-clamp-1">{task.description}</p>
        )}
      </td>

      {/* Client */}
      <td className="px-4 py-3.5 min-w-[160px]">
        <span className="text-sm text-navy-300 font-mono">{task.client}</span>
      </td>

      {/* Due date */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <span className={[
          "text-sm font-mono",
          overdue && task.status !== "Done" ? "text-red-400 font-semibold" : "text-navy-300",
        ].join(" ")}>
          {formatDate(task.dueDate)}
          {overdue && task.status !== "Done" && (
            <span className="ml-1 text-xs">(!)</span>
          )}
        </span>
      </td>

      {/* Priority */}
      <td className="px-4 py-3.5">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-semibold ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-semibold ${statusStyles[effectiveStatus]}`}>
          {effectiveStatus}
        </span>
      </td>

      {/* Assigned to */}
      <td className="px-4 py-3.5 min-w-[170px]">
        <div className="flex items-center gap-1.5">
          {task.assigneeType === "Agent" ? (
            <span className="text-accent-400"><BotIcon /></span>
          ) : (
            <span className="text-navy-400"><PersonIcon /></span>
          )}
          <span className={`text-sm font-mono ${task.assigneeType === "Agent" ? "text-accent-300" : "text-navy-300"}`}>
            {task.assigneeName}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {task.status !== "Done" && (
            <button
              onClick={() => onMarkDone(task.id)}
              title="Mark Done"
              className="h-7 px-2.5 flex items-center gap-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-mono transition-all"
            >
              <CheckIcon />
              Done
            </button>
          )}
          <button
            onClick={() => onReassign(task)}
            title="Reassign"
            className="h-7 px-2.5 flex items-center gap-1.5 rounded-md bg-navy-700 border border-navy-600 text-navy-300 hover:text-white hover:bg-navy-600 text-xs font-mono transition-all"
          >
            <ArrowsIcon />
            Reassign
          </button>
        </div>
      </td>
    </tr>
  );
}

// ============================================================
// Task Card (mobile)
// ============================================================

interface TaskCardProps {
  task: Task;
  onMarkDone: (id: string) => void;
  onReassign: (task: Task) => void;
}

function TaskCard({ task, onMarkDone, onReassign }: TaskCardProps) {
  const overdue = isOverdue(task);
  const effectiveStatus: Status = overdue && task.status !== "Done" ? "Overdue" : task.status;

  return (
    <div className="bg-navy-900 border border-navy-800 rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-display font-semibold text-white leading-snug">{task.name}</p>
          <p className="text-xs font-mono text-navy-400 mt-0.5">{task.client}</p>
        </div>
        <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-semibold ${statusStyles[effectiveStatus]}`}>
          {effectiveStatus}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-semibold ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
        <span className={`text-xs font-mono ${overdue && task.status !== "Done" ? "text-red-400 font-semibold" : "text-navy-400"}`}>
          {formatDate(task.dueDate)}{overdue && task.status !== "Done" ? " (!)" : ""}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {task.assigneeType === "Agent" ? (
          <span className="text-accent-400"><BotIcon /></span>
        ) : (
          <span className="text-navy-400"><PersonIcon /></span>
        )}
        <span className={`text-xs font-mono ${task.assigneeType === "Agent" ? "text-accent-300" : "text-navy-300"}`}>
          {task.assigneeName}
        </span>
      </div>

      <div className="flex gap-2 pt-1">
        {task.status !== "Done" && (
          <button
            onClick={() => onMarkDone(task.id)}
            className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-mono transition-all"
          >
            <CheckIcon />
            Mark Done
          </button>
        )}
        <button
          onClick={() => onReassign(task)}
          className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-lg bg-navy-700 border border-navy-600 text-navy-300 hover:text-white hover:bg-navy-600 text-xs font-mono transition-all"
        >
          <ArrowsIcon />
          Reassign
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Main Page
// ============================================================

export default function WorkbenchPage() {
  const [tasks, setTasks] = React.useState<Task[]>(DEMO_TASKS);
  const [showNewModal, setShowNewModal] = React.useState(false);
  const [reassignTarget, setReassignTarget] = React.useState<Task | null>(null);

  // Filter/sort state
  const [filterClient, setFilterClient] = React.useState("All");
  const [filterStatus, setFilterStatus] = React.useState("All");
  const [filterAssignee, setFilterAssignee] = React.useState("All");
  const [sortBy, setSortBy] = React.useState<"dueDate" | "priority" | "client">("dueDate");

  // Computed stats (always from full task list)
  const totalTasks = tasks.length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const dueThisWeek = tasks.filter((t) => isDueThisWeek(t) || (isOverdue(t) && t.status !== "Done")).length;
  const agentAssigned = tasks.filter((t) => t.assigneeType === "Agent").length;

  const stats = [
    { label: "Total Tasks", value: totalTasks },
    { label: "In Progress", value: inProgress, accent: true },
    { label: "Due This Week", value: dueThisWeek, warn: true },
    { label: "Agent-Assigned", value: agentAssigned },
  ];

  // Derive all unique clients from tasks
  const allClients = ["All", ...Array.from(new Set(tasks.map((t) => t.client))).sort()];
  const allStatuses = ["All", "Pending", "In Progress", "Review", "Done", "Overdue"];
  const allAssigneeTypes = ["All", "Agent", "Human"];

  // Priority ordering for sort
  const priorityOrder: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };

  // Filtered + sorted tasks
  const filteredTasks = React.useMemo(() => {
    let result = [...tasks];

    if (filterClient !== "All") {
      result = result.filter((t) => t.client === filterClient);
    }

    if (filterStatus !== "All") {
      if (filterStatus === "Overdue") {
        result = result.filter((t) => isOverdue(t) && t.status !== "Done");
      } else {
        result = result.filter((t) => t.status === filterStatus && !(isOverdue(t) && t.status !== "Done"));
      }
    }

    if (filterAssignee !== "All") {
      result = result.filter((t) => t.assigneeType === filterAssignee);
    }

    if (sortBy === "dueDate") {
      result.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    } else if (sortBy === "priority") {
      result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else {
      result.sort((a, b) => a.client.localeCompare(b.client));
    }

    return result;
  }, [tasks, filterClient, filterStatus, filterAssignee, sortBy]);

  function handleMarkDone(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Done" } : t))
    );
  }

  function handleCreate(task: Task) {
    setTasks((prev) => [task, ...prev]);
  }

  function handleReassign(taskId: string, assigneeType: AssigneeType, assigneeName: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assigneeType, assigneeName } : t))
    );
  }

  return (
    <>
      {/* Modals */}
      {showNewModal && (
        <NewTaskModal onClose={() => setShowNewModal(false)} onCreate={handleCreate} />
      )}
      {reassignTarget && (
        <ReassignModal
          task={reassignTarget}
          onClose={() => setReassignTarget(null)}
          onReassign={handleReassign}
        />
      )}

      {/* Hero / Page Header */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-navy-800)_0%,_transparent_60%)] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8 font-mono">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-navy-200">Workbench</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="h-px w-6 bg-accent-500 inline-block" />
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">
                  Client Operations
                </span>
              </div>
              <h1 className="font-display font-bold text-4xl sm:text-5xl text-white leading-tight mb-4">
                Workbench
              </h1>
              <p className="text-base sm:text-lg text-navy-300 leading-relaxed">
                Manage all client tasks, assign to agents or team members, and track progress across your portfolio.
              </p>
            </div>
            <button
              onClick={() => setShowNewModal(true)}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-400 text-white text-sm font-display font-semibold shadow-lg shadow-accent-500/25 transition-all"
            >
              <PlusIcon />
              New Task
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-navy-800 bg-navy-900/40 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={[
                  "font-display font-bold text-3xl sm:text-4xl mb-1",
                  stat.accent ? "text-accent-400" : stat.warn ? "text-amber-400" : "text-white",
                ].join(" ")}>
                  {stat.value}
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-navy-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter / Controls Bar */}
      <section className="py-5 border-b border-navy-800/60 bg-navy-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            {/* Client filter */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-navy-500 px-0.5">Client</label>
              <select
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="bg-navy-800 border border-navy-700 text-sm text-navy-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 transition min-w-[180px]"
              >
                {allClients.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Status filter */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-navy-500 px-0.5">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-navy-800 border border-navy-700 text-sm text-navy-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 transition"
              >
                {allStatuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Assignee type filter */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-navy-500 px-0.5">Assignee</label>
              <select
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                className="bg-navy-800 border border-navy-700 text-sm text-navy-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 transition"
              >
                {allAssigneeTypes.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-navy-500 px-0.5">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "dueDate" | "priority" | "client")}
                className="bg-navy-800 border border-navy-700 text-sm text-navy-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 transition"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="client">Client</option>
              </select>
            </div>

            {/* Spacer + New Task button (duplicated for convenience in filter bar) */}
            <div className="flex-1 flex justify-end items-end pb-0.5">
              <button
                onClick={() => setShowNewModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-500 hover:bg-accent-400 text-white text-sm font-display font-semibold shadow-md shadow-accent-500/20 transition-all"
              >
                <PlusIcon />
                New Task
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Task List */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-20 text-navy-500">
              <p className="text-2xl font-display font-bold text-navy-400 mb-2">No tasks found</p>
              <p className="text-sm font-mono">Adjust your filters or create a new task.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <div className="rounded-xl border border-navy-800 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-navy-900/70 border-b border-navy-800">
                        <th className="px-4 py-3 text-xs font-mono font-semibold uppercase tracking-widest text-navy-500">Task</th>
                        <th className="px-4 py-3 text-xs font-mono font-semibold uppercase tracking-widest text-navy-500">Client</th>
                        <th className="px-4 py-3 text-xs font-mono font-semibold uppercase tracking-widest text-navy-500">Due</th>
                        <th className="px-4 py-3 text-xs font-mono font-semibold uppercase tracking-widest text-navy-500">Priority</th>
                        <th className="px-4 py-3 text-xs font-mono font-semibold uppercase tracking-widest text-navy-500">Status</th>
                        <th className="px-4 py-3 text-xs font-mono font-semibold uppercase tracking-widest text-navy-500">Assigned To</th>
                        <th className="px-4 py-3 text-xs font-mono font-semibold uppercase tracking-widest text-navy-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks.map((task) => (
                        <TaskRow
                          key={task.id}
                          task={task}
                          onMarkDone={handleMarkDone}
                          onReassign={setReassignTarget}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs font-mono text-navy-600 mt-3 text-right">
                  {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} shown
                </p>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                <p className="text-xs font-mono text-navy-500 mb-4">
                  {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} shown
                </p>
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onMarkDone={handleMarkDone}
                    onReassign={setReassignTarget}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
