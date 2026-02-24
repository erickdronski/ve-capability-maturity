import { kv } from '@vercel/kv';

export type Engagement = {
  id: string;
  customerName: string;
  industry: string;
  owner: string;
  currentPhase: string;
  workshopFormat: 'virtual' | 'onsite' | 'hybrid' | 'tbd';
  workshopDate: string | null;
  participantCount: number;
  notes: string;
  checkedItems: Record<string, string[]>; // phaseId -> array of checked item labels
  createdAt: string;
  updatedAt: string;
};

const ENGAGEMENTS_KEY = 'engagements';

export async function getAllEngagements(): Promise<Engagement[]> {
  const ids = await kv.smembers(ENGAGEMENTS_KEY) as string[];
  if (!ids || ids.length === 0) return [];
  const engagements = await Promise.all(
    ids.map(async (id) => {
      const eng = await kv.get<Engagement>(`engagement:${id}`);
      return eng;
    })
  );
  return engagements.filter(Boolean) as Engagement[];
}

export async function getEngagement(id: string): Promise<Engagement | null> {
  return await kv.get<Engagement>(`engagement:${id}`);
}

export async function createEngagement(engagement: Engagement): Promise<Engagement> {
  await kv.set(`engagement:${engagement.id}`, engagement);
  await kv.sadd(ENGAGEMENTS_KEY, engagement.id);
  return engagement;
}

export async function updateEngagement(id: string, updates: Partial<Engagement>): Promise<Engagement | null> {
  const existing = await getEngagement(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
  await kv.set(`engagement:${id}`, updated);
  return updated;
}

export async function deleteEngagement(id: string): Promise<boolean> {
  await kv.del(`engagement:${id}`);
  await kv.srem(ENGAGEMENTS_KEY, id);
  return true;
}
