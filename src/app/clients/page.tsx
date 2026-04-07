"use client";

import * as React from "react";
import Link from "next/link";
import { type Client, getClients, deleteClient } from "@/lib/client-store";

// ---- Icons ----

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 4H12M5 4V3C5 2.44772 5.44772 2 6 2H8C8.55228 2 9 2.44772 9 3V4M5.5 6.5V10.5M8.5 6.5V10.5M3 4L3.5 11.5C3.5 12.0523 3.94772 12.5 4.5 12.5H9.5C10.0523 12.5 10.5 12.0523 10.5 11.5L11 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="18" cy="16" r="6" stroke="currentColor" strokeWidth="2" />
      <path d="M6 38C6 31.3726 11.3726 26 18 26C24.6274 26 30 31.3726 30 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="34" cy="18" r="5" stroke="currentColor" strokeWidth="2" />
      <path d="M32 26C32 26 34 26 36 26C40.4183 26 44 29.5817 44 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ---- Helpers ----

const statusColors: Record<string, string> = {
  Onboarding: "bg-amber-500/20 text-amber-300 ring-amber-500/30",
  Active: "bg-emerald-500/20 text-emerald-300 ring-emerald-500/30",
  Paused: "bg-navy-700/50 text-navy-300 ring-navy-600/30",
  Completed: "bg-accent-500/20 text-accent-300 ring-accent-500/30",
};

function scoreColor(score: number): string {
  if (score >= 70) return "text-emerald-400";
  if (score >= 40) return "text-amber-400";
  return "text-red-400";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ---- Main Page ----

export default function ClientsPage() {
  const [clients, setClients] = React.useState<Client[]>([]);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setClients(getClients());
    setLoaded(true);
  }, []);

  function handleDelete(id: string, name: string) {
    if (confirm(`Delete "${name}" and all workflow data?`)) {
      deleteClient(id);
      setClients(getClients());
    }
  }

  if (!loaded) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-navy-500 font-mono text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">Clients</h1>
            <p className="text-navy-400 text-sm mt-1">{clients.length} client{clients.length !== 1 ? "s" : ""} onboarded</p>
          </div>
          <Link
            href="/onboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent-600 text-sm font-display font-semibold text-white hover:bg-accent-500 transition-colors"
          >
            <PlusIcon /> Onboard Client
          </Link>
        </div>

        {/* Client Cards */}
        {clients.length === 0 ? (
          <div className="rounded-2xl border border-navy-800/60 bg-navy-900/20 p-12 text-center">
            <div className="inline-flex items-center justify-center text-navy-600 mb-4"><UsersIcon /></div>
            <h2 className="font-display text-lg font-semibold text-navy-300 mb-2">No clients yet</h2>
            <p className="text-navy-500 text-sm mb-6 max-w-sm mx-auto">
              Onboard your first client to generate their 7-stage workflow with automated agent assignments.
            </p>
            <Link
              href="/onboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-600 text-sm font-display font-semibold text-white hover:bg-accent-500 transition-colors"
            >
              <PlusIcon /> Onboard Your First Client
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clients.map((client) => {
              const allTasks = client.stages.flatMap((s) => s.tasks);
              const doneTasks = allTasks.filter((t) => t.status === "Done").length;
              const totalTasks = allTasks.length;
              const taskPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
              const activeStage = client.stages.find((s) => s.status !== "Complete" && s.status !== "Not Started")
                || client.stages.find((s) => s.status !== "Complete");
              const overallScore = client.growthRecord?.overallScore ?? 0;

              return (
                <Link
                  key={client.id}
                  href={`/clients/${client.id}`}
                  className="group rounded-xl border border-navy-800/60 bg-navy-900/30 p-5 hover:border-navy-700 hover:bg-navy-900/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display font-semibold text-white group-hover:text-accent-300 transition-colors truncate">
                        {client.businessName}
                      </h3>
                      <p className="text-xs text-navy-500 mt-0.5">{client.contactName}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {/* Growth score */}
                      <span className={`font-display text-lg font-bold ${scoreColor(overallScore)}`}>
                        {overallScore}
                      </span>
                    </div>
                  </div>

                  {/* Active stage */}
                  {activeStage && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded-md bg-accent-600/10 text-accent-400 text-[10px] font-mono ring-1 ring-accent-500/20">
                        Stage {activeStage.stage}
                      </span>
                      <span className="text-xs text-navy-400 truncate">{activeStage.name}</span>
                    </div>
                  )}

                  {/* Task progress */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-1.5 rounded-full bg-navy-800 overflow-hidden">
                      <div className="h-full rounded-full bg-accent-500 transition-all duration-500" style={{ width: `${taskPct}%` }} />
                    </div>
                    <span className="text-xs font-mono text-navy-400 shrink-0">{doneTasks}/{totalTasks}</span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-navy-800/40">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-navy-800/80 text-navy-400 text-xs font-mono ring-1 ring-navy-700/50">
                        {client.industry}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono ring-1 ${statusColors[client.status] || "bg-navy-800 text-navy-300 ring-navy-700"}`}>
                        {client.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-navy-600">{formatDate(client.createdAt)}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(client.id, client.businessName); }}
                        className="p-1.5 rounded-md text-navy-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete client"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
