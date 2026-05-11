import { PrismaPg } from "@prisma/adapter-pg";
// Import the Node bundle (`index.js`), not `client.ts` — the latter uses a stub
// `internal/class.ts` with an empty DMMF and rejects fields like `meetingAt`.
import { PrismaClient } from "../app/generated/prisma/index.js";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: pg.Pool;
  prismaUrl?: string;
};

function normalizeDatabaseUrl(raw: string): string {
  let url = raw.trim();
  if (
    (url.startsWith('"') && url.endsWith('"')) ||
    (url.startsWith("'") && url.endsWith("'"))
  ) {
    url = url.slice(1, -1).trim();
  }
  return url;
}

function assertValidPostgresUrl(url: string): void {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "postgresql:" && parsed.protocol !== "postgres:") {
      throw new Error(`Invalid protocol: ${parsed.protocol}`);
    }
    if (!parsed.hostname) {
      throw new Error("Missing hostname in DATABASE_URL");
    }
    const db = parsed.pathname.replace(/^\//, "").split("?")[0];
    if (!db) {
      throw new Error("Missing database name in DATABASE_URL path");
    }
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(
        "DATABASE_URL is not a valid URL. Use postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public (encode special chars in the password, e.g. * → %2A).",
      );
    }
    throw e;
  }
}

function poolFromUrl(connectionUrl: string): pg.Pool {
  const u = new URL(connectionUrl);
  const database = u.pathname.replace(/^\//, "").split("?")[0];
  const port = u.port ? Number(u.port) : 5432;
  const user = decodeURIComponent(u.username);
  const password = decodeURIComponent(u.password);

  const sslMode = u.searchParams.get("sslmode");
  const ssl =
    sslMode === "require" || sslMode === "prefer"
      ? { rejectUnauthorized: false }
      : undefined;

  return new pg.Pool({
    host: u.hostname,
    port,
    user: user || undefined,
    password: password || undefined,
    database,
    ssl,
  });
}

export function getPrisma(): PrismaClient {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not set");
  }

  const url = normalizeDatabaseUrl(raw);
  assertValidPostgresUrl(url);

  if (
    globalForPrisma.prisma &&
    globalForPrisma.prismaUrl !== url
  ) {
    void globalForPrisma.prisma.$disconnect().catch(() => {});
    void globalForPrisma.pgPool?.end();
    globalForPrisma.prisma = undefined;
    globalForPrisma.pgPool = undefined;
  }

  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const pool = poolFromUrl(url);
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({ adapter });

  globalForPrisma.prisma = client;
  globalForPrisma.pgPool = pool;
  globalForPrisma.prismaUrl = url;

  return client;
}
