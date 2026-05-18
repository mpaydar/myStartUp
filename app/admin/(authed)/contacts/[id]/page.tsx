import Link from "next/link";
import { notFound } from "next/navigation";

import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function formatWhen(d: Date | null): string {
  if (!d) return "—";
  return d.toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  });
}

export default async function AdminContactDetailPage({ params }: Props) {
  const { id } = await params;
  const prisma = getPrisma();
  const row = await prisma.contactRequest.findUnique({ where: { id } });
  if (!row) notFound();

  return (
    <div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        <Link
          href="/admin"
          className="font-medium text-teal-700 underline-offset-2 hover:underline dark:text-teal-400"
        >
          ← All leads
        </Link>
      </p>
      <h1 className="mt-4 text-xl font-semibold tracking-tight">
        {row.firstName} {row.lastName}
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Submitted {formatWhen(row.createdAt)}
      </p>

      <dl className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Email
          </dt>
          <dd className="mt-1">
            <a
              href={`mailto:${row.email}`}
              className="text-teal-700 underline-offset-2 hover:underline dark:text-teal-400"
            >
              {row.email}
            </a>
          </dd>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Meeting
          </dt>
          <dd className="mt-1 text-zinc-800 dark:text-zinc-200">{formatWhen(row.meetingAt)}</dd>
        </div>
      </dl>

      {row.fileName ? (
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Attachment
          </h2>
          <p className="mt-2 text-sm text-zinc-800 dark:text-zinc-200">{row.fileName}</p>
          {row.fileBlobUrl ? (
            <a
              href={row.fileBlobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex text-sm font-medium text-teal-700 underline-offset-2 hover:underline dark:text-teal-400"
            >
              Open file link
            </a>
          ) : (
            <p className="mt-2 text-sm text-zinc-500">No blob URL stored.</p>
          )}
          <p className="mt-1 text-xs text-zinc-500">
            {row.fileMimeType ?? "unknown type"}
            {row.fileSize != null ? ` · ${(row.fileSize / 1024).toFixed(1)} KB` : ""}
          </p>
        </div>
      ) : null}

      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Message
        </h2>
        <pre className="mt-3 max-h-[480px] overflow-auto whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
          {row.message?.trim() ? row.message : "—"}
        </pre>
      </div>
    </div>
  );
}
