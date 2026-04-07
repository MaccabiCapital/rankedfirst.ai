"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  type Client,
  type WorkflowStage,
  type WorkflowTask,
  type TaskStatus,
  type GrowthRecord,
  getClient,
  saveClient,
  updateTaskStatus,
  updateGrowthRecord,
} from "@/lib/client-store";

// ---- Icons ----

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 5.5L7 9.5L11 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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

function ExternalLink() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M5 2H2.5C2.22386 2 2 2.22386 2 2.5V9.5C2 9.77614 2.22386 10 2.5 10H9.5C9.77614 10 10 9.77614 10 9.5V7M7 2H10V5M10 2L5.5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---- Status helpers ----

const taskStatusStyles: Record<TaskStatus, string> = {
  Pending: "bg-navy-800 text-navy-300 ring-navy-700",
  "In Progress": "bg-accent-600/20 text-accent-300 ring-accent-500/30",
  Review: "bg-amber-500/20 text-amber-300 ring-amber-500/30",
  Done: "bg-emerald-500/20 text-emerald-300 ring-emerald-500/30",
};

const stageStatusStyles: Record<string, string> = {
  "Not Started": "bg-navy-800 text-navy-400 ring-navy-700",
  "In Progress": "bg-accent-600/20 text-accent-300 ring-accent-500/30",
  "Needs Review": "bg-amber-500/20 text-amber-300 ring-amber-500/30",
  Complete: "bg-emerald-500/20 text-emerald-300 ring-emerald-500/30",
};

const TASK_CYCLE: TaskStatus[] = ["Pending", "In Progress", "Review", "Done"];

function nextStatus(current: TaskStatus): TaskStatus {
  const idx = TASK_CYCLE.indexOf(current);
  return TASK_CYCLE[(idx + 1) % TASK_CYCLE.length];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function scoreColor(score: number): string {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-500";
}

function scoreTextColor(score: number): string {
  if (score >= 70) return "text-emerald-400";
  if (score >= 40) return "text-amber-400";
  return "text-red-400";
}

// ---- Growth Record Card ----

function GrowthRecordCard({
  record,
  onUpdate,
}: {
  record: GrowthRecord;
  onUpdate: (r: GrowthRecord) => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [local, setLocal] = React.useState(record);

  React.useEffect(() => { setLocal(record); }, [record]);

  function save() {
    const overall = Math.round(
      (local.discoverabilityScore + local.trustScore + local.conversionReadinessScore + local.followUpScore) / 4,
    );
    onUpdate({ ...local, overallScore: overall, lastUpdated: new Date().toISOString() });
    setEditing(false);
  }

  const dimensions: { key: keyof GrowthRecord; label: string }[] = [
    { key: "discoverabilityScore", label: "Discoverability" },
    { key: "trustScore", label: "Trust" },
    { key: "conversionReadinessScore", label: "Conversion" },
    { key: "followUpScore", label: "Follow-Up" },
  ];

  return (
    <div className="rounded-xl border border-navy-800/60 bg-navy-900/20 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xs font-semibold text-navy-400 uppercase tracking-wider">
          Growth Record
        </h3>
        <button
          type="button"
          onClick={() => editing ? save() : setEditing(true)}
          className="inline-flex items-center gap-1 text-xs text-accent-400 hover:text-accent-300 transition-colors"
        >
          {editing ? "Save" : <><PencilIcon /> Edit</>}
        </button>
      </div>

      {/* Overall score */}
      <div className="flex items-end gap-2 mb-4">
        <span className={`font-display text-4xl font-bold ${scoreTextColor(record.overallScore)}`}>
          {record.overallScore}
        </span>
        <span className="text-xs text-navy-500 font-mono mb-1">/ 100 overall</span>
      </div>

      {/* Dimension bars */}
      <div className="space-y-3">
        {dimensions.map(({ key, label }) => {
          const val = (editing ? local : record)[key] as number;
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-navy-300 font-display">{label}</span>
                {editing ? (
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={val}
                    onChange={(e) => setLocal({ ...local, [key]: Math.min(100, Math.max(0, Number(e.target.value))) })}
                    className="w-14 rounded border border-navy-700 bg-navy-900 px-1.5 py-0.5 text-xs text-white text-right font-mono focus:outline-none focus:ring-1 focus:ring-accent-500"
                  />
                ) : (
                  <span className={`text-xs font-mono font-bold ${scoreTextColor(val)}`}>
                    {val}
                  </span>
                )}
              </div>
              <div className="h-1.5 rounded-full bg-navy-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${scoreColor(val)}`}
                  style={{ width: `${val}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Top gaps */}
      {record.topGaps.length > 0 && (
        <div className="mt-4 pt-3 border-t border-navy-800/40">
          <span className="text-[10px] font-mono text-navy-500 uppercase tracking-wider">Top Gaps</span>
          <ul className="mt-1 space-y-0.5">
            {record.topGaps.map((gap, i) => (
              <li key={i} className="text-xs text-navy-300">&bull; {gap}</li>
            ))}
          </ul>
        </div>
      )}

      {record.lastUpdated && (
        <p className="text-[10px] text-navy-600 font-mono mt-3">
          Updated {formatDate(record.lastUpdated)}
        </p>
      )}
    </div>
  );
}

// ---- Stage Accordion ----

function StageSection({
  stage,
  clientId,
  expanded,
  onToggle,
  onTaskUpdate,
}: {
  stage: WorkflowStage;
  clientId: string;
  expanded: boolean;
  onToggle: () => void;
  onTaskUpdate: () => void;
}) {
  const doneTasks = stage.tasks.filter((t) => t.status === "Done").length;
  const totalTasks = stage.tasks.length;
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  function cycleTask(task: WorkflowTask) {
    updateTaskStatus(clientId, stage.id, task.id, nextStatus(task.status));
    onTaskUpdate();
  }

  // Group tasks by stream for Stage 5
  const hasStreams = stage.stage === 5;
  const streamGroups = React.useMemo(() => {
    if (!hasStreams) return null;
    const groups: Record<string, WorkflowTask[]> = {};
    for (const t of stage.tasks) {
      const s = t.stream || "Other";
      if (!groups[s]) groups[s] = [];
      groups[s].push(t);
    }
    return groups;
  }, [stage.tasks, hasStreams]);

  const ownerLabel = stage.owner === "Both" ? "Agent + Human" : stage.owner;

  function renderTask(task: WorkflowTask) {
    return (
      <div
        key={task.id}
        className="flex items-center gap-3 px-5 py-3 border-b border-navy-800/30 last:border-0 hover:bg-navy-900/30 transition-colors"
      >
        <button
          type="button"
          onClick={() => cycleTask(task)}
          className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono ring-1 cursor-pointer hover:opacity-80 transition-opacity ${taskStatusStyles[task.status]}`}
          title={`Click to change to "${nextStatus(task.status)}"`}
        >
          {task.status}
        </button>
        <div className="flex-1 min-w-0">
          <span className={`text-sm ${task.status === "Done" ? "text-navy-500 line-through" : "text-navy-100"}`}>
            {task.name}
          </span>
          {task.notes && (
            <span className="ml-2 text-[10px] text-navy-600 font-mono">{task.notes}</span>
          )}
        </div>
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <span className="text-navy-500">
            {task.assigneeType === "Agent" ? <BotIcon /> : <PersonIcon />}
          </span>
          <span className="text-xs text-navy-400 font-mono max-w-[140px] truncate">
            {task.assigneeName}
          </span>
        </div>
        <span className="text-xs font-mono text-navy-500 shrink-0">
          {formatDate(task.dueDate)}
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-navy-800/60 bg-navy-900/20 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-navy-900/40 transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center text-xs font-mono font-bold text-navy-300 shrink-0">
          {stage.stage}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-display font-semibold text-white text-sm truncate">
              {stage.name}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono ring-1 ${stageStatusStyles[stage.status]}`}>
              {stage.status}
            </span>
            <span className="text-[10px] font-mono text-navy-600">{ownerLabel}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1 rounded-full bg-navy-800 overflow-hidden max-w-[200px]">
              <div className="h-full rounded-full bg-accent-500 transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[11px] font-mono text-navy-500">{doneTasks}/{totalTasks} tasks</span>
          </div>
        </div>
        <ChevronDown className={`text-navy-500 transition-transform duration-200 shrink-0 ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="border-t border-navy-800/40">
          {hasStreams && streamGroups ? (
            Object.entries(streamGroups).map(([stream, tasks]) => (
              <div key={stream}>
                <div className="px-5 py-2 bg-navy-900/40 border-b border-navy-800/30">
                  <span className="text-[10px] font-mono font-bold text-accent-400 uppercase tracking-wider">
                    {stream}
                  </span>
                </div>
                {tasks.map(renderTask)}
              </div>
            ))
          ) : (
            stage.tasks.map(renderTask)
          )}
        </div>
      )}
    </div>
  );
}

// ---- Weekly Cadence Card ----

function WeeklyCadenceCard() {
  const items = [
    { label: "New client", action: "Complete intake, run audit, create growth record", color: "text-accent-400" },
    { label: "Start of week", action: "Review overdue and upcoming tasks", color: "text-navy-300" },
    { label: "Mid-week", action: "Check execution blockers", color: "text-navy-300" },
    { label: "End of week", action: "Review completed work", color: "text-navy-300" },
    { label: "Monthly", action: "Re-score growth dimensions", color: "text-amber-400" },
  ];
  return (
    <div className="rounded-xl border border-navy-800/60 bg-navy-900/20 p-5">
      <h3 className="font-display text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3">
        Weekly Cadence
      </h3>
      <div className="space-y-2.5">
        {items.map((item) => (
          <div key={item.label}>
            <span className={`text-xs font-mono font-bold ${item.color}`}>{item.label}</span>
            <p className="text-xs text-navy-400 mt-0.5">{item.action}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Main Component ----

export default function ClientDetail() {
  const params = useParams<{ id: string }>();
  const [client, setClient] = React.useState<Client | null>(null);
  const [loaded, setLoaded] = React.useState(false);
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());

  function load() {
    if (params?.id) {
      const c = getClient(params.id as string);
      setClient(c || null);
      if (c) {
        const first = c.stages.find((s) => s.status !== "Complete");
        if (first) setExpanded(new Set([first.id]));
      }
    }
    setLoaded(true);
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  function reload() {
    if (params?.id) setClient(getClient(params.id as string) || null);
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleStatusChange(newStatus: Client["status"]) {
    if (!client) return;
    const updated = { ...client, status: newStatus };
    saveClient(updated);
    setClient(updated);
  }

  function handleGrowthUpdate(record: GrowthRecord) {
    if (!client) return;
    updateGrowthRecord(client.id, record);
    setClient({ ...client, growthRecord: record });
  }

  if (!loaded) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-navy-500 font-mono text-sm">Loading…</div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-lg font-semibold text-navy-300 mb-2">Client not found</h2>
          <p className="text-navy-500 text-sm mb-4">This client may have been deleted or the URL is incorrect.</p>
          <Link href="/clients" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-600 text-sm font-display font-semibold text-white hover:bg-accent-500 transition-colors">
            <ArrowLeft /> Back to Clients
          </Link>
        </div>
      </div>
    );
  }

  const allTasks = client.stages.flatMap((s) => s.tasks);
  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter((t) => t.status === "Done").length;
  const agentTasks = allTasks.filter((t) => t.assigneeType === "Agent").length;
  const humanTasks = totalTasks - agentTasks;
  const overallPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const upcomingTask = allTasks
    .filter((t) => t.status !== "Done")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];

  const activeStage = client.stages.find((s) => s.status !== "Complete" && s.status !== "Not Started")
    || client.stages.find((s) => s.status !== "Complete");

  const statusOptions: Client["status"][] = ["Onboarding", "Active", "Paused", "Completed"];
  const growthRecord = client.growthRecord || {
    discoverabilityScore: 0, trustScore: 0, conversionReadinessScore: 0, followUpScore: 0, overallScore: 0, topGaps: [], lastUpdated: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link href="/clients" className="inline-flex items-center gap-1.5 text-sm text-navy-400 hover:text-white transition-colors mb-6">
          <ArrowLeft /> All Clients
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">{client.businessName}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded-md bg-navy-800/80 text-navy-400 text-xs font-mono ring-1 ring-navy-700/50">{client.industry}</span>
              <select
                value={client.status}
                onChange={(e) => handleStatusChange(e.target.value as Client["status"])}
                className="px-2 py-0.5 rounded-md text-xs font-mono bg-navy-800 text-navy-300 ring-1 ring-navy-700 border-none focus:outline-none focus:ring-2 focus:ring-accent-500 cursor-pointer"
              >
                {statusOptions.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
              {client.website && (
                <a href={client.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-accent-400 hover:text-accent-300">Website <ExternalLink /></a>
              )}
              {client.gbpUrl && (
                <a href={client.gbpUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-accent-400 hover:text-accent-300">GBP <ExternalLink /></a>
              )}
            </div>
          </div>
          {activeStage && (
            <div className="px-3 py-1.5 rounded-lg bg-accent-600/10 border border-accent-500/20">
              <span className="text-[10px] font-mono text-accent-500 uppercase tracking-wider">Active Stage</span>
              <p className="text-sm font-display font-semibold text-accent-300">{activeStage.stage}. {activeStage.name}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content — 7-Stage Pipeline */}
          <div className="lg:col-span-3 space-y-3">
            <h2 className="font-display text-sm font-semibold text-navy-300 uppercase tracking-wider mb-3">
              Workflow Pipeline
            </h2>
            {client.stages.map((stage) => (
              <StageSection
                key={stage.id}
                stage={stage}
                clientId={client.id}
                expanded={expanded.has(stage.id)}
                onToggle={() => toggleExpand(stage.id)}
                onTaskUpdate={reload}
              />
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Growth Record */}
            <GrowthRecordCard record={growthRecord} onUpdate={handleGrowthUpdate} />

            {/* Overall progress */}
            <div className="rounded-xl border border-navy-800/60 bg-navy-900/20 p-5">
              <h3 className="font-display text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3">Overall Progress</h3>
              <div className="flex items-end gap-2 mb-3">
                <span className="font-display text-3xl font-bold text-white">{overallPct}%</span>
                <span className="text-xs text-navy-500 font-mono mb-1">{doneTasks}/{totalTasks} tasks</span>
              </div>
              <div className="h-2 rounded-full bg-navy-800 overflow-hidden">
                <div className="h-full rounded-full bg-accent-500 transition-all duration-500" style={{ width: `${overallPct}%` }} />
              </div>
            </div>

            {/* Task split */}
            <div className="rounded-xl border border-navy-800/60 bg-navy-900/20 p-5">
              <h3 className="font-display text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3">Task Split</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-navy-300"><BotIcon /> Agent</span>
                  <span className="font-mono text-accent-400">{agentTasks}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-navy-300"><PersonIcon /> Human</span>
                  <span className="font-mono text-navy-300">{humanTasks}</span>
                </div>
              </div>
            </div>

            {/* Next task */}
            {upcomingTask && (
              <div className="rounded-xl border border-navy-800/60 bg-navy-900/20 p-5">
                <h3 className="font-display text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3">Next Up</h3>
                <p className="text-sm text-navy-100 mb-1">{upcomingTask.name}</p>
                <div className="flex items-center gap-2 text-xs text-navy-500">
                  <span className="font-mono">{formatDate(upcomingTask.dueDate)}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    {upcomingTask.assigneeType === "Agent" ? <BotIcon /> : <PersonIcon />}
                    {upcomingTask.assigneeName}
                  </span>
                </div>
              </div>
            )}

            {/* Monitoring */}
            {client.nextMonitoringDate && (
              <div className="rounded-xl border border-navy-800/60 bg-navy-900/20 p-5">
                <h3 className="font-display text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">Next Monitoring</h3>
                <p className="text-sm font-mono text-accent-300">{formatDate(client.nextMonitoringDate)}</p>
              </div>
            )}

            {/* Weekly cadence */}
            <WeeklyCadenceCard />

            {/* Client info */}
            <div className="rounded-xl border border-navy-800/60 bg-navy-900/20 p-5">
              <h3 className="font-display text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3">Client Info</h3>
              <dl className="space-y-2 text-sm">
                <div><dt className="text-navy-500 text-xs">Contact</dt><dd className="text-navy-200">{client.contactName}</dd></div>
                <div><dt className="text-navy-500 text-xs">Email</dt><dd className="text-navy-200">{client.email}</dd></div>
                {client.phone && <div><dt className="text-navy-500 text-xs">Phone</dt><dd className="text-navy-200">{client.phone}</dd></div>}
                {client.serviceArea && <div><dt className="text-navy-500 text-xs">Service Area</dt><dd className="text-navy-200">{client.serviceArea}</dd></div>}
                {client.budget && <div><dt className="text-navy-500 text-xs">Budget</dt><dd className="text-navy-200">{client.budget}</dd></div>}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
