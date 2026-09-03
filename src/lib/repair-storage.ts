import { promises as fs } from "fs";
import path from "path";
import type { RepairRequest } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const REPAIR_FILE = path.join(DATA_DIR, "repair-requests.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readRepairRequests(): Promise<RepairRequest[]> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(REPAIR_FILE, "utf-8");
    return JSON.parse(raw) as RepairRequest[];
  } catch {
    return [];
  }
}

export async function writeRepairRequests(requests: RepairRequest[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(REPAIR_FILE, JSON.stringify(requests, null, 2), "utf-8");
}

export async function addRepairRequest(
  data: Omit<RepairRequest, "id" | "status" | "createdAt">
): Promise<RepairRequest> {
  const requests = await readRepairRequests();
  const entry: RepairRequest = {
    ...data,
    id: `REP-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  requests.unshift(entry);
  await writeRepairRequests(requests);
  return entry;
}
