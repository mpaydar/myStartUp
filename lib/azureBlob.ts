import {
  BlobSASPermissions,
  BlobServiceClient,
} from "@azure/storage-blob";
import { randomUUID } from "node:crypto";

/** Container for consultation form attachments (create in Azure if it does not exist). */
const DEFAULT_CONTAINER = "consultation-attachment";

const DEFAULT_BLOB_CORS_ORIGINS = [
  "http://localhost:3000",
  "https://simbayai.vercel.app",
];

const DEFAULT_BLOB_CORS_ALLOWED_HEADERS = [
  "content-type",
  "x-ms-blob-type",
  "x-ms-blob-content-type",
  "x-ms-version",
  "x-ms-date",
  "x-ms-client-request-id",
  "authorization",
  "accept",
  "origin",
].join(",");

let blobServiceCorsConfigured = false;

function sanitizeForBlobName(original: string): string {
  const base = original.replace(/[/\\]/g, "_").replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.length > 120 ? base.slice(-120) : base || "upload";
}

/**
 * Full connection string, OR storage account name + account key (`azure_secret_key` / `AZURE_STORAGE_ACCOUNT_KEY`).
 */
export function getAzureStorageConnectionString(): string | null {
  const full = process.env.AZURE_STORAGE_CONNECTION_STRING?.trim();
  if (full) return full;

  const accountName = (
    process.env.AZURE_STORAGE_ACCOUNT_NAME ||
    process.env.azure_storage_account_name ||
    ""
  ).trim();
  const accountKey = (
    process.env.AZURE_STORAGE_ACCOUNT_KEY ||
    process.env.azure_secret_key ||
    process.env.AZURE_SECRET_KEY ||
    ""
  ).trim();

  if (!accountName || !accountKey) return null;

  return `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`;
}

export function isAzureBlobConfigured(): boolean {
  return getAzureStorageConnectionString() !== null;
}

export function getAzureStorageAccountName(): string | null {
  const fromEnv = (
    process.env.AZURE_STORAGE_ACCOUNT_NAME ||
    process.env.azure_storage_account_name ||
    ""
  ).trim();
  if (fromEnv) return fromEnv;

  const connectionString = getAzureStorageConnectionString();
  if (!connectionString) return null;

  const match = connectionString.match(/AccountName=([^;]+)/i);
  return match?.[1]?.trim() || null;
}

export function getAzureStorageContainerName(): string {
  return (
    process.env.AZURE_STORAGE_CONTAINER_NAME ||
    process.env.azure_storage_container_name ||
    ""
  ).trim() || DEFAULT_CONTAINER;
}

function getBlobServiceClient(): BlobServiceClient {
  const connectionString = getAzureStorageConnectionString();
  if (!connectionString) {
    throw new Error(
      "Azure storage is not configured. Set AZURE_STORAGE_CONNECTION_STRING, or AZURE_STORAGE_ACCOUNT_NAME with azure_secret_key (account key).",
    );
  }

  return BlobServiceClient.fromConnectionString(connectionString);
}

function getBlobCorsOrigins(): string[] {
  const raw = process.env.AZURE_BLOB_CORS_ORIGINS?.trim();
  if (!raw) return DEFAULT_BLOB_CORS_ORIGINS;

  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function getBlobCorsAllowedHeaders(): string {
  return (
    process.env.AZURE_BLOB_CORS_ALLOWED_HEADERS?.trim() ||
    DEFAULT_BLOB_CORS_ALLOWED_HEADERS
  );
}

async function ensureBlobServiceCorsConfigured(): Promise<void> {
  if (blobServiceCorsConfigured) return;

  const service = getBlobServiceClient();
  const origins = getBlobCorsOrigins();
  const allowedHeaders = getBlobCorsAllowedHeaders();
  const allowedMethods = "GET,PUT,OPTIONS,HEAD";
  const allowedOrigins = origins.join(",");

  try {
    const properties = await service.getProperties();
    const existingRules = properties.cors ?? [];
    const nextRules = existingRules.filter(
      (rule) => rule.allowedOrigins !== allowedOrigins,
    );

    nextRules.push({
      allowedOrigins,
      allowedMethods,
      allowedHeaders,
      exposedHeaders: "*",
      maxAgeInSeconds: 3600,
    });

    await service.setProperties({
      ...properties,
      cors: nextRules,
    });
    blobServiceCorsConfigured = true;
  } catch (err) {
    console.error(
      "Could not configure Azure Blob CORS automatically. Set Blob service CORS in Azure Portal with Content-Type and x-ms-blob-type allowed.",
      err,
    );
  }
}

async function getContactAttachmentContainer() {
  const service = getBlobServiceClient();
  const container = service.getContainerClient(getAzureStorageContainerName());
  await container.createIfNotExists();
  return container;
}

export function buildContactBlobName(originalFileName: string): string {
  const safe = sanitizeForBlobName(originalFileName);
  return `${randomUUID()}-${safe}`;
}

export async function createContactDocumentUploadTarget(options: {
  originalFileName: string;
  contentType: string | null;
}): Promise<{
  uploadUrl: string;
  blobUrl: string;
  blobName: string;
  contentType: string;
}> {
  await ensureBlobServiceCorsConfigured();

  const container = await getContactAttachmentContainer();
  const blobName = buildContactBlobName(options.originalFileName);
  const blockBlob = container.getBlockBlobClient(blobName);
  const contentType = options.contentType || "application/octet-stream";

  const uploadUrl = await blockBlob.generateSasUrl({
    permissions: BlobSASPermissions.parse("cw"),
    expiresOn: new Date(Date.now() + 15 * 60 * 1000),
    contentType,
  });

  return {
    uploadUrl,
    blobUrl: blockBlob.url,
    blobName,
    contentType,
  };
}

export function isAllowedContactBlobReference(options: {
  blobUrl: string;
  blobName: string;
}): boolean {
  const accountName = getAzureStorageAccountName();
  if (!accountName) return false;

  try {
    const url = new URL(options.blobUrl);
    if (url.hostname !== `${accountName}.blob.core.windows.net`) return false;

    const containerName = getAzureStorageContainerName();
    const expectedPath = `/${containerName}/${options.blobName}`;
    if (url.pathname !== expectedPath) return false;

    return true;
  } catch {
    return false;
  }
}
