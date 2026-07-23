import * as path from 'path';
import * as fs from 'fs';

export interface StoragePathResult {
  clientDir: string;
  filePath: string;
  fileUrl: string;
}

export function getStoragePath(
  client: { id: string; tenantId?: string; tenant?: { slug?: string } },
  fileName: string,
): StoragePathResult {
  const uploadDir = process.env.UPLOAD_DIR || './uploads';

  const tenantFolder = sanitizeFolderName(client.tenant?.slug || client.tenantId || 'global');
  const clientFolder = sanitizeFolderName(client.id);

  const relativeDir = path.join(tenantFolder, clientFolder);
  const clientDir = path.join(uploadDir, relativeDir);

  if (!fs.existsSync(clientDir)) {
    fs.mkdirSync(clientDir, { recursive: true });
  }

  const filePath = path.join(clientDir, fileName);
  const fileUrl = `/uploads/${tenantFolder}/${clientFolder}/${fileName}`;

  return { clientDir, filePath, fileUrl };
}

function sanitizeFolderName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_');
}
