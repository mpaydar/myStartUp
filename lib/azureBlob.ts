import { BlobServiceClient } from "@azure/storage-blob";
import { randomUUID } from "node:crypto";

/** Container for consultation form attachments (create in Azure if it does not exist). */
const DEFAULT_CONTAINER = "consultation-attachment";

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

export async function uploadContactDocumentToAzure(options: {
  buffer: Buffer;
  originalFileName: string;
  contentType: string | null;
}): Promise<{ blobUrl: string; blobName: string }> {
  const connectionString = getAzureStorageConnectionString();
  if (!connectionString) {
    throw new Error(
      "Azure storage is not configured. Set AZURE_STORAGE_CONNECTION_STRING, or AZURE_STORAGE_ACCOUNT_NAME with azure_secret_key (account key).",
    );
  }

  const containerName = (
    process.env.AZURE_STORAGE_CONTAINER_NAME ||
    process.env.azure_storage_container_name ||
    ""
  ).trim() || DEFAULT_CONTAINER;

  const service = BlobServiceClient.fromConnectionString(connectionString);
  const container = service.getContainerClient(containerName);
  await container.createIfNotExists();

  const safe = sanitizeForBlobName(options.originalFileName);
  const blobName = `${randomUUID()}-${safe}`;
  const blockBlob = container.getBlockBlobClient(blobName);

  await blockBlob.uploadData(options.buffer, {
    blobHTTPHeaders: {
      blobContentType:
        options.contentType || "application/octet-stream",
    },
  });

  return { blobUrl: blockBlob.url, blobName };
}
