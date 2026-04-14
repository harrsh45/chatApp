import React, { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";

function formatFirstNameFromEmail(email) {
  if (!email) return "there";
  const local = String(email).split("@")[0] || "";
  const cleaned = local.replace(/[._-]+/g, " ").trim();
  const first = cleaned.split(" ")[0] || local;
  return first.charAt(0).toUpperCase() + first.slice(1);
}

function getInitials(email) {
  if (!email) return "U";
  const local = String(email).split("@")[0] || "u";
  const parts = local.replace(/[._-]+/g, " ").trim().split(" ").filter(Boolean);
  const a = parts[0]?.[0] ?? local[0] ?? "u";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-sky-200/60 bg-white p-4 shadow-sm">
      <div className="h-5 w-40 rounded bg-sky-100/80" />
      <div className="mt-3 flex items-center gap-2">
        <div className="h-4 w-28 rounded bg-sky-100/80" />
        <div className="ml-auto h-7 w-20 rounded-full bg-sky-100/80" />
      </div>
    </div>
  );
}

function AITip({ title, example }) {
  return (
    <div className="rounded-2xl border border-sky-200/60 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <div className="mt-2 rounded-xl bg-sky-50 p-3 font-mono text-[12px] leading-relaxed text-slate-700">
        {example}
      </div>
    </div>
  );
}

function ProjectCard({ project, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group w-full text-left rounded-2xl border border-sky-200/60 bg-white p-4 shadow-sm transition hover:border-sky-300/70 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700 ring-1 ring-sky-200/60">
          <i className="ri-chat-3-line text-lg" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-[15px] font-semibold text-slate-900">
              {project?.name}
            </h2>
            <span className="ml-auto inline-flex items-center rounded-full border border-sky-200/60 bg-sky-50 px-2.5 py-1 text-xs text-slate-700">
              <i className="ri-group-line mr-1.5" />
              {project?.users?.length ?? 0}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Open the room and start chatting — use{" "}
            <span className="font-semibold text-slate-800">@ai</span>{" "}
            anytime.
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="inline-flex items-center gap-2 text-xs text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500/70" />
          Ready
        </span>
        <span className="ml-auto inline-flex items-center gap-2 text-xs text-slate-500 group-hover:text-slate-700">
          Open
          <i className="ri-arrow-right-line" />
        </span>
      </div>
    </button>
  );
}

function CreateProjectModal({
  isOpen,
  onClose,
  onCreate,
  projectName,
  setProjectName,
  isCreating,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-3xl border border-sky-200/70 bg-white p-5 shadow-2xl shadow-slate-900/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60 text-sky-700">
            <i className="ri-add-line text-lg" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900">
              Create a new chat room
            </h2>
            <p className="text-sm text-slate-600">
              Pick a short name — you can invite collaborators inside.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-700 ring-1 ring-sky-200/60 transition hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40"
            aria-label="Close"
          >
            <i className="ri-close-line" />
          </button>
        </div>

        <form
          className="mt-5"
          onSubmit={(e) => {
            e.preventDefault();
            onCreate();
          }}
        >
          <label className="block text-sm font-medium text-slate-700">
            Room name
          </label>
          <input
            autoFocus
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g. product-standup, hiring-chat, design-review"
            className="mt-2 w-full rounded-2xl border border-sky-200/70 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
            required
          />

          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-sky-200/70 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/15 transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40"
            >
              {isCreating ? "Creating..." : "Create room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => String(p?.name ?? "").toLowerCase().includes(q));
  }, [projects, query]);

  const stats = useMemo(() => {
    const rooms = projects.length;
    const collaborators = projects.reduce(
      (acc, p) => acc + (p?.users?.length ?? 0),
      0
    );
    return { rooms, collaborators };
  }, [projects]);

  async function fetchProjects() {
    if (!user?.email) return;
    try {
      setIsLoading(true);
      const res = await axios.get("/projects/all", {
        params: { email: user.email },
      });
      setProjects(res?.data?.projects ?? []);
    } catch (err) {
      console.log(err);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function createProject() {
    const name = projectName.trim();
    if (!name) return;

    try {
      setIsCreating(true);
      await axios.post("/projects/create", { name });
      setIsModalOpen(false);
      setProjectName("");
      await fetchProjects();
    } catch (error) {
      console.log(error);
    } finally {
      setIsCreating(false);
    }
  }

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  return (
    <main className="min-h-screen w-full bg-[#f6fbff] text-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-sky-300/55 blur-3xl" />
        <div className="absolute -top-24 left-[-8%] h-[420px] w-[420px] rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(125,211,252,0.55),transparent_65%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm text-slate-600">Welcome back,</p>
            <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {formatFirstNameFromEmail(user?.email)}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Start a room for two-person chat, and pull the assistant in with{" "}
              <span className="rounded-md bg-white px-1.5 py-0.5 font-mono text-xs text-slate-800 ring-1 ring-sky-200/70">
                @ai
              </span>
              .
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 rounded-2xl border border-sky-200/70 bg-white/70 px-3 py-2 backdrop-blur">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 ring-1 ring-sky-200/70 text-slate-800">
                  {getInitials(user?.email)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user?.email}
                  </p>
                  <p className="text-xs text-slate-600">
                    {stats.rooms} rooms · {stats.collaborators} collaborators
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/15 transition hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40"
              >
                <i className="ri-add-line" />
                New room
              </button>
            </div>
          </div>
        </header>

        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-white/85">
                  Your rooms
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Jump back in or create a new chat. Each room is optimized for
                  two-person conversation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-72">
                  <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search rooms..."
                    className="w-full rounded-2xl border border-sky-200/70 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
                  />
                </div>
                <button
                  type="button"
                  onClick={fetchProjects}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-sky-200/70 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40"
                  aria-label="Refresh"
                >
                  <i className="ri-refresh-line" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : filteredProjects.length === 0 ? (
                <div className="sm:col-span-2 rounded-3xl border border-sky-200/70 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/70 text-sky-700">
                      <i className="ri-sparkling-2-line text-xl" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-slate-900">
                        {projects.length === 0
                          ? "No rooms yet"
                          : "No matches"}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {projects.length === 0
                          ? "Create your first room and invite one collaborator to begin."
                          : "Try a different search term."}
                      </p>

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(true)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/15 transition hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40"
                        >
                          <i className="ri-add-line" />
                          Create room
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuery("")}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-200/70 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40"
                        >
                          Clear search
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                filteredProjects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onOpen={() =>
                      navigate("/project", {
                        state: { project },
                      })
                    }
                  />
                ))
              )}
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-3xl border border-sky-200/70 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-200/70">
                  <i className="ri-robot-2-line text-lg" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900">
                    AI assist inside chat
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    In any room, type <span className="font-semibold text-slate-800">@ai</span>{" "}
                    followed by your request.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <AITip
                  title="Summarize the conversation"
                  example={`@ai Summarize the last 20 messages into 5 bullets and list decisions.`}
                />
                <AITip
                  title="Draft a reply (tone-aware)"
                  example={`@ai Write a calm, concise reply that acknowledges concerns and proposes next steps.`}
                />
                <AITip
                  title="Turn ideas into an action list"
                  example={`@ai Convert our discussion into a checklist with owners and clear acceptance criteria.`}
                />
              </div>

              <div className="mt-4 rounded-2xl border border-sky-200/70 bg-sky-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Pro tip
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Use{" "}
                  <span className="rounded-md bg-white px-1.5 py-0.5 font-mono text-xs text-slate-800 ring-1 ring-sky-200/70">
                    @ai
                  </span>{" "}
                  to get a response without breaking the flow between two people.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={createProject}
        projectName={projectName}
        setProjectName={setProjectName}
        isCreating={isCreating}
      />
    </main>
  );
};

export default Home;