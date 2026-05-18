import Link from "next/link";

import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatWhen(d: Date): string {
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminLeadsPage() {
  let rows: Awaited<ReturnType<typeof fetchLeads>>;
  try {
    rows = await fetchLeads();
  } catch {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
        <p className="font-medium">Database unavailable</p>
        <p className="mt-2 text-sm text-amber-900/90 dark:text-amber-200/90">
          Check <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">DATABASE_URL</code>{" "}
          and run migrations /{" "}
          <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">prisma db push</code>.
        </p>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Contact leads</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          No submissions yet. They appear here when someone completes the get-in-touch form.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Contact leads</h1>
      
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {rows.length} submission{rows.length === 1 ? "" : "s"} (newest first).
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Meeting</th>
              <th className="px-4 py-3">File</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40">
                <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {formatWhen(r.createdAt)}
                </td>
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                  {r.firstName} {r.lastName}
                </td>
                <td className="max-w-[200px] truncate px-4 py-3 text-zinc-700 dark:text-zinc-300">
                  <a
                    href={`mailto:${r.email}`}
                    className="text-teal-700 underline-offset-2 hover:underline dark:text-teal-400"
                  >
                    {r.email}
                  </a>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {r.meetingAt ? formatWhen(r.meetingAt) : "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {r.fileName ? "Yes" : "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <Link
                    href={`/admin/contacts/${r.id}`}
                    className="font-medium text-teal-700 underline-offset-2 hover:underline dark:text-teal-400"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

async function fetchLeads() {
  const prisma = getPrisma();
  return prisma.contactRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      meetingAt: true,
      fileName: true,
      createdAt: true,
    },
  });
}
