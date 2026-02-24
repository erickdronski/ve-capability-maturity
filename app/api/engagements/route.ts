import { NextResponse } from 'next/server';
import { getAllEngagements, createEngagement } from '../../lib/store';
import { v4 as uuidv4 } from 'uuid';
import type { Engagement } from '../../lib/store';

export async function GET() {
  try {
    const engagements = await getAllEngagements();
    return NextResponse.json(engagements);
  } catch {
    // If KV is not configured, return empty array (local dev / no KV)
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const engagement: Engagement = {
      id: uuidv4(),
      customerName: body.customerName || '',
      industry: body.industry || '',
      owner: body.owner || '',
      currentPhase: 'lead-intake',
      workshopFormat: body.workshopFormat || 'tbd',
      workshopDate: body.workshopDate || null,
      participantCount: body.participantCount || 0,
      notes: body.notes || '',
      checkedItems: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const created = await createEngagement(engagement);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create engagement' }, { status: 500 });
  }
}
