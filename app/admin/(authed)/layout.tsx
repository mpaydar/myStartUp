import Link from "next/link";

import { AdminLogoutButton } from "./AdminLogoutButton";

export default function AdminAuthedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="text-sm font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
              SimBay admin
            </span>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link
                href="/admin"
                className="text-teal-700 underline-offset-4 hover:underline dark:text-teal-400"
              >
                Contact leads
              </Link>
              <Link
                href="/admin/find-target"
                className="text-teal-700 underline-offset-4 hover:underline dark:text-teal-400"
              >
                Find targets
              </Link>
            </nav>
          </div>
          
          <AdminLogoutButton />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
