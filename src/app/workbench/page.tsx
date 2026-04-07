"use client";

import * as React from "react";
import Link from "next/link";
import {
  type Client,
  type WorkflowTask,
  type TaskStatus,
  getClients,
  updateTaskStatus,
  getClient,
  saveClient,
} from "@/lib/client-store";

// ============================================================
// Types
// ============================================================

interface FlatTask {
  clientId: string;
  clientName: string;
  stageId: string;
  stageName: string;
  stageNumber: number;
  stream?: string;
  task: WorkflowTask;
}

type GroupMode = "flat" | "client" | "stage" | "stream";

// ============================================================
// Icons
// ============================================================

function BotIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="4" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="5" cy="7.5" r="1" fill="currentColor" />
      <circle cx="9" cy="7.5" r="1" fill="currentColor" />
      <path d="M7 2V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="7" cy="1.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 13C2 10.2386 4.23858 8 7 8C9.76142 8 12 10.2386 12 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="10" y="8" width="28" height="34" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M18 8V6C18 4.89543 18.8954 4 20 4H28C29.1046 4 30 4.89543 30 6V8" stroke="currentColor" strokeWidth="2" />
      <path d="M18 20H30M18 26H26M18 32H28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ============================================================
// Status helpers
// ============================================================

const taskStatusStyles: Record<TaskStatus, string> = {
  Pending: "bg-navy-800 text-navy-300 ring-navy-700",
  "In Progress": "bg-accent-600/20 text-accent-300 ring-accent-500/30",
  Review: "bg-amber-500/20 text-amber-300 ring-amber-500/30",
  Done: "bg-emerald-500/20 text-emerald-300 ring-emerald-500/30",
};

const TASK_CYCLE: TaskStatus[] = ["Pending", "In Progress", "Review", "Done"];

const stageBorderColors: Record<number, string> = {
  1: "border-l-sky-500",
  2: "border-l-violet-500",
  3: "border-l-amber-500",
  4: "border-l-pink-500",
  5: "border-l-emerald-500",
  6: "border-l-orange-500",
  7: "border-l-cyan-500",
};

function nextStatus(current: TaskStatus): TaskStatus {
  const idx = TASK_CYCLE.indexOf(current);
  return TASK_CYCLE[(idx + 1) % TASK_CYCLE.length];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isOverdue(dueDate: string, status: TaskStatus): boolean {
  if (status === "Done") return false;
  return new Date(dueDate) < new Date(new Date().toISOString().slice(0, 10));
}

function flattenTasks(clients: Client[]): FlatTask[] {
  const result: FlatTask[] = [];
  for (const client of clients) {
    for (const stage of client.stages) {
      for (const task of stage.tasks) {
        result.push({
          clientId: client.id,
          clientName: client.businessName,
          stageId: stage.id,
          stageName: stage.name,
          stageNumber: stage.stage,
          stream: task.stream,
          task,
        });
      }
    }
  }
  return result;
}

// ============================================================
// Edit Panel
// ============================================================

function EditPanel({ ft, onClose, onSave }: { ft: FlatTask; onClose: () => void; onSave: () => void }) {
  const [status, setStatus] = React.useState<TaskStatus>(ft.task.status);
  const [notes, setNotes] = React.useState(ft.task.notes || "");
  const [assigneeName, setAssigneeName] = React.useState(ft.task.assigneeName);

  function save() {
    updateTaskStatus(ft.clientId, ft.stageId, ft.task.id, status);
    const client = getClient(ft.clientId);
    if (client) {
      for (const stage of client.stages) {
        if (stage.id === ft.stageId) {
          for (const task of stage.tasks) {
            if (task.id === ft.task.id) {
              task.notes = notes || undefined;
              task.assigneeName = assigneeName;
            }
          }
        }
      }
      saveClient(client);
    }
    onSave();
  }

  return (
    <div className="rounded-xl border border-accent-500/30 bg-navy-900/60 p-5 mt-2 mb-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm font-semibold text-white">Edit Task</h3>
        <button type="button" onClick={onClose} className="text-navy-500 hover:text-white transition-colors"><XIcon /></button>
      </div>
      <div className="space-y-3">
        <div><label className="block text-xs font-display font-medium text-navy-400 mb-1">Task</label><p className="text-sm text-navy-100">{ft.task.name}</p></div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-display font-medium text-navy-400 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} className="w-full rounded-lg border border-navy-700 bg-navy-900/50 px-2.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-500">
              {TASK_CYCLE.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-display font-medium text-navy-400 mb-1">Assignee</label>
            <input type="text" value={assigneeName} onChange={(e) => setAssigneeName(e.target.value)} className="w-full rounded-lg border border-navy-700 bg-navy-900/50 px-2.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-500" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-display font-medium text-navy-400 mb-1">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full rounded-lg border border-navy-700 bg-navy-900/50 px-2.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-500 placeholder:text-navy-600" placeholder="Add notes…" />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-lg text-xs font-display font-medium text-navy-400 hover:text-white hover:bg-navy-800 transition-colors">Cancel</button>
          <button type="button" onClick={save} className="px-4 py-1.5 rounded-lg text-xs font-display font-semibold bg-accent-600 text-white hover:bg-accent-500 transition-colors">Save</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Task Row
// ============================================================

function TaskRow({ ft, editing, onEdit, onCycle }: { ft: FlatTask; editing: boolean; onEdit: () => void; onCycle: () => void }) {
  const borderClass = stageBorderColors[ft.stageNumber] || "border-l-navy-700";
  const overdue = isOverdue(ft.task.dueDate, ft.task.status);
  return (
    <tr
      className={`border-b border-navy-800/30 hover:bg-navy-900/40 transition-colors cursor-pointer border-l-2 ${borderClass} ${overdue ? "bg-red-950/10" : ""}`}
      onClick={onEdit}
    >
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onCycle(); }}
          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono ring-1 hover:opacity-80 transition-opacity ${taskStatusStyles[ft.task.status]}`}
          title={`Click to change to "${nextStatus(ft.task.status)}"`}
        >
          {ft.task.status}
        </button>
      </td>
      <td className="px-4 py-3">
        <span className={ft.task.status === "Done" ? "text-navy-500 line-through text-sm" : "text-navy-100 text-sm"}>
          {ft.task.name}
        </span>
      </td>
      <td className="px-4 py-3">
        <Link href={`/clients/${ft.clientId}`} onClick={(e) => e.stopPropagation()} className="text-accent-400 hover:text-accent-300 text-xs font-mono">
          {ft.clientName}
        </Link>
      </td>
      <td className="px-4 py-3"><span className="text-xs text-navy-400 font-mono">{ft.stageNumber}. {ft.stageName}</span></td>
      <td className="px-4 py-3">
        {ft.stream && <span className="text-[10px] text-navy-500 font-mono">{ft.stream}</span>}
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 text-xs text-navy-400">
          {ft.task.assigneeType === "Agent" ? <BotIcon /> : <PersonIcon />}
          <span className="font-mono max-w-[110px] truncate">{ft.task.assigneeName}</span>
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs font-mono ${overdue ? "text-red-400" : "text-navy-500"}`}>{formatDate(ft.task.dueDate)}</span>
      </td>
    </tr>
  );
}

// ============================================================
// Main Page
// ============================================================

export default function WorkbenchPage() {
  const [clients, setClients] = React.useState<Client[]>([]);
  const [loaded, setLoaded] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // Filters
  const [filterClient, setFilterClient] = React.useState("All");
  const [filterStage, setFilterStage] = React.useState("All");
  const [filterStream, setFilterStream] = React.useState("All");
  const [filterStatus, setFilterStatus] = React.useState("All");
  const [filterAssignee, setFilterAssignee] = React.useState("All");
  const [filterAssigneeName, setFilterAssigneeName] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("dueDate");
  const [groupMode, setGroupMode] = React.useState<GroupMode>("flat");

  React.useEffect(() => { setClients(getClients()); setLoaded(true); }, []);

  function reload() { setClients(getClients()); setEditingId(null); }

  const allFlat = React.useMemo(() => flattenTasks(clients), [clients]);

  // Unique values for filters
  const clientNames = React.useMemo(() => [...new Set(allFlat.map((f) => f.clientName))].sort(), [allFlat]);
  const stageNames = React.useMemo(() => {
    const seen = new Map<number, string>();
    allFlat.forEach((f) => seen.set(f.stageNumber, f.stageName));
    return Array.from(seen.entries()).sort((a, b) => a[0] - b[0]);
  }, [allFlat]);
  const streamNames = React.useMemo(() => [...new Set(allFlat.map((f) => f.stream).filter(Boolean))].sort() as string[], [allFlat]);
  const assigneeNames = React.useMemo(() => [...new Set(allFlat.map((f) => f.task.assigneeName))].sort(), [allFlat]);

  // Filter + sort
  const filtered = React.useMemo(() => {
    let result = allFlat;
    if (filterClient !== "All") result = result.filter((f) => f.clientName === filterClient);
    if (filterStage !== "All") result = result.filter((f) => String(f.stageNumber) === filterStage);
    if (filterStream !== "All") result = result.filter((f) => f.stream === filterStream);
    if (filterStatus !== "All") result = result.filter((f) => f.task.status === filterStatus);
    if (filterAssignee !== "All") result = result.filter((f) => f.task.assigneeType === filterAssignee);
    if (filterAssigneeName !== "All") result = result.filter((f) => f.task.assigneeName === filterAssigneeName);

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "dueDate": return a.task.dueDate.localeCompare(b.task.dueDate);
        case "client": return a.clientName.localeCompare(b.clientName);
        case "stage": return a.stageNumber - b.stageNumber;
        case "status": {
          const order = { Pending: 0, "In Progress": 1, Review: 2, Done: 3 };
          return (order[a.task.status] ?? 0) - (order[b.task.status] ?? 0);
        }
        default: return 0;
      }
    });
    return result;
  }, [allFlat, filterClient, filterStage, filterStream, filterStatus, filterAssignee, filterAssigneeName, sortBy]);

  // Stats
  const stats = React.useMemo(() => {
    const total = allFlat.length;
    const needsReview = allFlat.filter((f) => f.task.status === "Review").length;
    const overdue = allFlat.filter((f) => isOverdue(f.task.dueDate, f.task.status)).length;
    const agentAssigned = allFlat.filter((f) => f.task.assigneeType === "Agent").length;
    const humanAssigned = total - agentAssigned;
    return { total, needsReview, overdue, agentAssigned, humanAssigned };
  }, [allFlat]);

  // Needs Review and Overdue sections
  const reviewTasks = React.useMemo(() => filtered.filter((f) => f.task.status === "Review"), [filtered]);
  const overdueTasks = React.useMemo(() => filtered.filter((f) => isOverdue(f.task.dueDate, f.task.status)), [filtered]);

  // Grouped data
  const groups = React.useMemo((): [string, FlatTask[]][] => {
    if (groupMode === "flat") return [["", filtered]];
    const map: Record<string, FlatTask[]> = {};
    for (const ft of filtered) {
      let key = "";
      if (groupMode === "client") key = ft.clientName;
      else if (groupMode === "stage") key = `${ft.stageNumber}. ${ft.stageName}`;
      else if (groupMode === "stream") key = ft.stream || "No Stream";
      if (!map[key]) map[key] = [];
      map[key].push(ft);
    }
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered, groupMode]);

  function cycleTask(ft: FlatTask) {
    updateTaskStatus(ft.clientId, ft.stageId, ft.task.id, nextStatus(ft.task.status));
    reload();
  }

  if (!loaded) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-navy-500 font-mono text-sm">Loading…</div>
      </div>
    );
  }

  const selectClass = "rounded-lg border border-navy-700 bg-navy-900/50 px-2.5 py-2 text-xs text-navy-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent appearance-none";

  // Empty state
  if (clients.length === 0) {
    return (
      <div className="min-h-screen bg-navy-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">Workbench</h1>
          <p className="text-navy-400 text-sm mb-12">Unified task view across all clients and stages.</p>
          <div className="rounded-2xl border border-navy-800/60 bg-navy-900/20 p-12 text-center">
            <div className="inline-flex items-center justify-center text-navy-600 mb-4"><ClipboardIcon /></div>
            <h2 className="font-display text-lg font-semibold text-navy-300 mb-2">No tasks yet</h2>
            <p className="text-navy-500 text-sm mb-6 max-w-sm mx-auto">Onboard your first client to populate the workbench with workflow tasks.</p>
            <Link href="/onboard" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-600 text-sm font-display font-semibold text-white hover:bg-accent-500 transition-colors">
              <PlusIcon /> Onboard Your First Client
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">Workbench</h1>
            <p className="text-navy-400 text-sm mt-1">All tasks across {clients.length} client{clients.length !== 1 ? "s" : ""}</p>
          </div>
          <Link href="/onboard" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent-600 text-sm font-display font-semibold text-white hover:bg-accent-500 transition-colors">
            <PlusIcon /> New Client
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Total Tasks", value: stats.total, color: "text-white" },
            { label: "Needs Review", value: stats.needsReview, color: stats.needsReview > 0 ? "text-amber-400" : "text-navy-400" },
            { label: "Overdue", value: stats.overdue, color: stats.overdue > 0 ? "text-red-400" : "text-navy-400" },
            { label: "Agent Tasks", value: stats.agentAssigned, color: "text-emerald-400" },
            { label: "Human Tasks", value: stats.humanAssigned, color: "text-accent-400" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-navy-800/60 bg-navy-900/20 px-4 py-3">
              <div className={`font-display text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-navy-500 font-mono mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Needs Review section */}
        {reviewTasks.length > 0 && (
          <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2">
              Needs Review ({reviewTasks.length})
            </h3>
            <div className="space-y-1">
              {reviewTasks.slice(0, 5).map((ft) => (
                <div key={`${ft.clientId}-${ft.task.id}`} className="flex items-center gap-3 text-sm">
                  <span className="text-amber-300">{ft.task.name}</span>
                  <span className="text-navy-500 text-xs font-mono">{ft.clientName}</span>
                  <span className="text-navy-600 text-xs font-mono">{ft.stageName}</span>
                </div>
              ))}
              {reviewTasks.length > 5 && <p className="text-xs text-navy-500 mt-1">+{reviewTasks.length - 5} more</p>}
            </div>
          </div>
        )}

        {/* Overdue section */}
        {overdueTasks.length > 0 && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <h3 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-2">
              Overdue ({overdueTasks.length})
            </h3>
            <div className="space-y-1">
              {overdueTasks.slice(0, 5).map((ft) => (
                <div key={`${ft.clientId}-${ft.task.id}`} className="flex items-center gap-3 text-sm">
                  <span className="text-red-300">{ft.task.name}</span>
                  <span className="text-navy-500 text-xs font-mono">{ft.clientName}</span>
                  <span className="text-navy-600 text-xs font-mono">Due {formatDate(ft.task.dueDate)}</span>
                </div>
              ))}
              {overdueTasks.length > 5 && <p className="text-xs text-navy-500 mt-1">+{overdueTasks.length - 5} more</p>}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-4 p-3 rounded-xl border border-navy-800/40 bg-navy-900/10">
          <span className="text-xs font-mono text-navy-500 mr-1">Filter:</span>
          <select value={filterClient} onChange={(e) => setFilterClient(e.target.value)} className={selectClass}>
            <option value="All">All Clients</option>
            {clientNames.map((n) => (<option key={n} value={n}>{n}</option>))}
          </select>
          <select value={filterStage} onChange={(e) => setFilterStage(e.target.value)} className={selectClass}>
            <option value="All">All Stages</option>
            {stageNames.map(([num, name]) => (<option key={num} value={String(num)}>{num}. {name}</option>))}
          </select>
          <select value={filterStream} onChange={(e) => setFilterStream(e.target.value)} className={selectClass}>
            <option value="All">All Streams</option>
            {streamNames.map((n) => (<option key={n} value={n}>{n}</option>))}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={selectClass}>
            <option value="All">All Statuses</option>
            {TASK_CYCLE.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
          <select value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)} className={selectClass}>
            <option value="All">Agent & Human</option>
            <option value="Agent">Agent Only</option>
            <option value="Human">Human Only</option>
          </select>
          <select value={filterAssigneeName} onChange={(e) => setFilterAssigneeName(e.target.value)} className={selectClass}>
            <option value="All">All Assignees</option>
            {assigneeNames.map((n) => (<option key={n} value={n}>{n}</option>))}
          </select>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs font-mono text-navy-500">Sort:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClass}>
              <option value="dueDate">Due Date</option>
              <option value="client">Client</option>
              <option value="stage">Stage</option>
              <option value="status">Status</option>
            </select>
            <span className="text-xs font-mono text-navy-500 ml-2">Group:</span>
            <select value={groupMode} onChange={(e) => setGroupMode(e.target.value as GroupMode)} className={selectClass}>
              <option value="flat">Flat List</option>
              <option value="client">By Client</option>
              <option value="stage">By Stage</option>
              <option value="stream">By Stream</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="text-xs text-navy-500 font-mono mb-3">
          Showing {filtered.length} of {allFlat.length} tasks
        </div>

        {/* Task table (desktop) */}
        <div className="hidden md:block">
          {groups.map(([groupLabel, tasks]) => (
            <div key={groupLabel || "__flat"} className="mb-4">
              {groupLabel && (
                <h3 className="text-xs font-mono font-bold text-accent-400 uppercase tracking-wider mb-2 px-1">
                  {groupLabel}
                  <span className="text-navy-600 font-normal ml-2">({tasks.length})</span>
                </h3>
              )}
              <div className="rounded-xl border border-navy-800/60 bg-navy-900/10 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy-800/60 text-left">
                      <th className="px-4 py-3 text-xs font-mono font-medium text-navy-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-xs font-mono font-medium text-navy-500 uppercase tracking-wider">Task</th>
                      <th className="px-4 py-3 text-xs font-mono font-medium text-navy-500 uppercase tracking-wider">Client</th>
                      <th className="px-4 py-3 text-xs font-mono font-medium text-navy-500 uppercase tracking-wider">Stage</th>
                      <th className="px-4 py-3 text-xs font-mono font-medium text-navy-500 uppercase tracking-wider">Stream</th>
                      <th className="px-4 py-3 text-xs font-mono font-medium text-navy-500 uppercase tracking-wider">Assignee</th>
                      <th className="px-4 py-3 text-xs font-mono font-medium text-navy-500 uppercase tracking-wider">Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((ft) => (
                      <React.Fragment key={`${ft.clientId}-${ft.task.id}`}>
                        <TaskRow
                          ft={ft}
                          editing={editingId === ft.task.id}
                          onEdit={() => setEditingId(editingId === ft.task.id ? null : ft.task.id)}
                          onCycle={() => cycleTask(ft)}
                        />
                        {editingId === ft.task.id && (
                          <tr><td colSpan={7} className="px-4"><EditPanel ft={ft} onClose={() => setEditingId(null)} onSave={reload} /></td></tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                {tasks.length === 0 && (
                  <div className="py-12 text-center text-navy-500 text-sm">No tasks match the current filters.</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Task cards (mobile) */}
        <div className="md:hidden space-y-2">
          {filtered.map((ft) => {
            const borderClass = stageBorderColors[ft.stageNumber] || "border-l-navy-700";
            const overdue = isOverdue(ft.task.dueDate, ft.task.status);
            return (
              <div key={`${ft.clientId}-${ft.task.id}`}>
                <div
                  className={`rounded-xl border border-navy-800/60 bg-navy-900/20 p-4 border-l-2 ${borderClass} ${overdue ? "border-red-900/40" : ""}`}
                  onClick={() => setEditingId(editingId === ft.task.id ? null : ft.task.id)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`text-sm ${ft.task.status === "Done" ? "text-navy-500 line-through" : "text-navy-100"}`}>{ft.task.name}</span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); cycleTask(ft); }}
                      className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono ring-1 ${taskStatusStyles[ft.task.status]}`}
                    >
                      {ft.task.status}
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-navy-500">
                    <Link href={`/clients/${ft.clientId}`} onClick={(e) => e.stopPropagation()} className="text-accent-400 hover:text-accent-300 font-mono">{ft.clientName}</Link>
                    <span>·</span><span className="font-mono">S{ft.stageNumber}</span>
                    {ft.stream && <><span>·</span><span className="font-mono">{ft.stream}</span></>}
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">{ft.task.assigneeType === "Agent" ? <BotIcon /> : <PersonIcon />}<span className="font-mono">{ft.task.assigneeName}</span></span>
                    <span>·</span><span className={`font-mono ${overdue ? "text-red-400" : ""}`}>{formatDate(ft.task.dueDate)}</span>
                  </div>
                </div>
                {editingId === ft.task.id && <EditPanel ft={ft} onClose={() => setEditingId(null)} onSave={reload} />}
              </div>
            );
          })}
          {filtered.length === 0 && <div className="py-12 text-center text-navy-500 text-sm">No tasks match the current filters.</div>}
        </div>
      </div>
    </div>
  );
}
