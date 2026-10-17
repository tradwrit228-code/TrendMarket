import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';

function resolveProjectId(): string | undefined {
  if (process.env.VITE_FIREBASE_PROJECT_ID) {
    return process.env.VITE_FIREBASE_PROJECT_ID;
  }
  if (process.env.FIREBASE_PROJECT_ID) {
    return process.env.FIREBASE_PROJECT_ID;
  }

  const localConfigPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(localConfigPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(localConfigPath, 'utf-8'));
      return raw.projectId;
    } catch {
      // ignore parsing error
    }
  }

  return undefined;
}

if (!getApps().length) {
  const projectId = resolveProjectId();
  initializeApp(projectId ? { projectId } : {});
}

export const adminAuth = getAuth();
