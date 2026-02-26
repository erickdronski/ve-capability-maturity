'use client';

import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Copy, Check, X, ZoomIn, ZoomOut, Maximize2, Minimize2, ArrowRight, ArrowLeft, ChevronRight, ExternalLink, Move, Hand, MousePointer } from 'lucide-react';
import { templates } from '../data';
import type { Template } from '../data';

/* ═══════════════════════════════════════════════════════════════
   TYPES & CONFIG
   ═══════════════════════════════════════════════════════════════ */

type NodeType = 'start' | 'action' | 'template' | 'decision' | 'milestone' | 'handoff' | 'end';

type FlowNode = {
  id: string;
  label: string;
  type: NodeType;
  lane: string;
  phase: number;
  templateId?: string;
  description?: string;
  next: string[];
};

const NODE_W = 160;
const NODE_H = 64;
const V_PAD = 24;
const PHASE_WIDTH = 230;
const LANE_LABEL_W = 170;

const lanes = [
  { id: 'sales', label: '🤝 Sales / Account Team', color: '#d97706' },
  { id: 've-lead', label: '📋 VE Lead', color: '#2563eb' },
  { id: 've', label: '💡 Value Engineer', color: '#7c3aed' },
  { id: 'customer', label: '🏢 Customer', color: '#059669' },
  { id: 'logistics', label: '📦 Logistics / Ops', color: '#dc2626' },
];

const phaseInfo = [
  { num: 1, label: 'Lead Intake', icon: '🎯', sub: 'Day 0', color: '#2563eb' },
  { num: 2, label: 'Discovery & Scheduling', icon: '🔍', sub: 'Days 1–5', color: '#ea580c' },
  { num: 3, label: 'Assessment Setup', icon: '📋', sub: 'Days 3–7', color: '#059669' },
  { num: 4, label: 'Pre-Workshop Prep', icon: '🧩', sub: 'Days 7–12', color: '#0891b2' },
  { num: 5, label: 'Workshop Delivery', icon: '🎪', sub: 'Workshop Day', color: '#7c3aed' },
  { num: 6, label: 'Post-Workshop Synthesis', icon: '🔬', sub: 'Days 14–21', color: '#dc2626' },
  { num: 7, label: 'Deliverable & Handoff', icon: '🏆', sub: 'Days 21–28', color: '#d97706' },
];

const typeStyle: Record<NodeType, { bg: string; border: string; text: string; badge?: string }> = {
  start:    { bg: '#f0fdf4', border: '#86efac', text: '#15803d', badge: '🟢' },
  action:   { bg: '#f8fafc', border: '#e2e8f0', text: '#334155' },
  template: { bg: '#faf5ff', border: '#c4b5fd', text: '#5b21b6', badge: '📄' },
  decision: { bg: '#fffbeb', border: '#fcd34d', text: '#92400e', badge: '◆' },
  milestone:{ bg: '#ecfdf5', border: '#6ee7b7', text: '#065f46', badge: '★' },
  handoff:  { bg: '#fff1f2', border: '#fda4af', text: '#9f1239', badge: '→' },
  end:      { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', badge: '🔴' },
};

/* ═══════════════════════════════════════════════════════════════
   FLOW DATA (same as process-map.tsx)
   ═══════════════════════════════════════════════════════════════ */

const nodes: FlowNode[] = [
  { id: 'start', label: 'New Lead Enters', type: 'start', lane: 'sales', phase: 1, next: ['s1a', 's1b', 's1c'] },
  { id: 's1a', label: 'Marketing Lead', type: 'action', lane: 'sales', phase: 1, description: 'Website, event, webinar, content download', next: ['s1d'] },
  { id: 's1b', label: 'Sales Qualified', type: 'action', lane: 'sales', phase: 1, description: 'Rep pitched and qualified the customer', next: ['s1d'] },
  { id: 's1c', label: 'Partner Referral', type: 'action', lane: 'sales', phase: 1, description: 'Partner referral or customer self-service', next: ['s1d'] },
  { id: 's1d', label: 'Qualify for C&M?', type: 'decision', lane: 'sales', phase: 1, description: 'Is this customer a fit for a Capability & Maturity engagement?', next: ['s1e'] },
  { id: 's1e', label: 'Route to VE', type: 'handoff', lane: 'sales', phase: 1, description: 'Hand off qualified lead to Value Engineering team', next: ['s1f'] },
  { id: 's1f', label: 'Assign VE Owner', type: 'action', lane: 've-lead', phase: 1, description: 'Assign owner, log in Salesforce as C&M opportunity', next: ['s2a'] },
  { id: 's2a', label: 'Schedule Discovery', type: 'action', lane: 've', phase: 2, description: 'Within 48 hours of lead assignment', next: ['s2b'] },
  { id: 's2b', label: 'Discovery Call', type: 'milestone', lane: 've', phase: 2, description: 'Understand pain points, objectives, org structure, current Ivanti footprint', next: ['s2c', 's2d', 's2e'] },
  { id: 's2c', label: 'Format Decision', type: 'decision', lane: 've', phase: 2, description: 'Virtual (Teams/Zoom), Onsite, or Hybrid workshop?', next: ['s2c1', 's2c2', 's2c3'] },
  { id: 's2c1', label: 'Virtual', type: 'action', lane: 've', phase: 2, next: ['s2f'] },
  { id: 's2c2', label: 'Onsite', type: 'action', lane: 've', phase: 2, next: ['s2f', 's4log'] },
  { id: 's2c3', label: 'Hybrid', type: 'action', lane: 've', phase: 2, next: ['s2f', 's4log'] },
  { id: 's2d', label: 'Confirm Participants', type: 'action', lane: 'customer', phase: 2, description: '5-12 stakeholders: names, titles, emails', next: ['s2f'] },
  { id: 's2e', label: 'Scope Domains', type: 'action', lane: 've', phase: 2, description: 'ITSM, Security, UEM — which capabilities to assess', next: ['s2f'] },
  { id: 's2f', label: 'Engagement Email', type: 'template', lane: 've', phase: 2, templateId: 'initial-outreach-email', description: 'Formal email: agenda, logistics, participants, next steps', next: ['s3a'] },
  { id: 's3a', label: 'Facilitator Portal', type: 'action', lane: 've', phase: 3, description: 'Log into online assessment facilitator portal', next: ['s3b'] },
  { id: 's3b', label: 'Create Assessment', type: 'action', lane: 've', phase: 3, description: 'Configure domains, participants, completion deadline', next: ['s3c'] },
  { id: 's3c', label: 'Generate URL', type: 'milestone', lane: 've', phase: 3, description: 'Unique customer assessment link created', next: ['s3d'] },
  { id: 's3d', label: 'Assessment Invite', type: 'template', lane: 've', phase: 3, templateId: 'assessment-invitation-email', description: 'Email all participants with link and deadline', next: ['s3e', 's3f'] },
  { id: 's3e', label: 'Complete Assessment', type: 'action', lane: 'customer', phase: 3, description: '15-20 min per participant — rate capabilities honestly', next: ['s4a'] },
  { id: 's3f', label: 'Send Reminders', type: 'template', lane: 've', phase: 3, templateId: 'assessment-reminder-email', description: 'Day 3 + Day 5 nudges. Target 80%+ response rate', next: ['s3e'] },
  { id: 's4a', label: 'Download Responses', type: 'action', lane: 've', phase: 4, description: 'Export and review all participant assessment data', next: ['s4b'] },
  { id: 's4b', label: 'Build Canvas Board', type: 'milestone', lane: 've', phase: 4, description: 'Multi-stakeholder canvas in Lucidchart/Miro showing alignment & divergence', next: ['s4c', 's4d'] },
  { id: 's4c', label: 'Prep Deck & Exercises', type: 'action', lane: 've', phase: 4, description: 'Facilitation deck, breakout exercises, discussion prompts', next: ['s4e'] },
  { id: 's4d', label: 'Identify Themes', type: 'action', lane: 've', phase: 4, description: 'Key themes, gaps, areas of stakeholder agreement/disagreement', next: ['s4e'] },
  { id: 's4log', label: 'Onsite Needed?', type: 'decision', lane: 'logistics', phase: 4, description: 'If onsite or hybrid, trigger logistics workflow', next: ['s4log1', 's4log2'] },
  { id: 's4log1', label: 'FedEx Supplies', type: 'template', lane: 'logistics', phase: 4, templateId: 'fedex-shipping-checklist', description: 'Ship Capability Cards, easel pads, markers — 5+ days out', next: ['s4e'] },
  { id: 's4log2', label: 'Venue & AV', type: 'action', lane: 'logistics', phase: 4, description: 'Confirm venue, AV equipment, catering, room layout', next: ['s4e'] },
  { id: 's4e', label: 'Brief Account Team', type: 'handoff', lane: 'sales', phase: 4, description: 'Share findings, themes, and workshop game plan with sales rep', next: ['s5a'] },
  { id: 's5a', label: 'Welcome & Rules', type: 'action', lane: 've', phase: 5, description: 'Open session, set ground rules, share agenda', next: ['s5b'] },
  { id: 's5b', label: 'Present Canvas', type: 'milestone', lane: 've', phase: 5, description: 'Show where stakeholder perspectives align and diverge', next: ['s5c'] },
  { id: 's5c', label: 'Domain Review', type: 'action', lane: 've', phase: 5, description: 'Walk through each capability domain with the group', next: ['s5d'] },
  { id: 's5d', label: 'Breakout Sessions', type: 'action', lane: 've', phase: 5, description: 'Small group exercises on priority areas', next: ['s5e'] },
  { id: 's5e', label: 'Stakeholder Input', type: 'action', lane: 'customer', phase: 5, description: 'Participants contribute perspectives, debate priorities', next: ['s5f'] },
  { id: 's5f', label: 'Priority Voting', type: 'action', lane: 've', phase: 5, description: 'Dot voting on top 3-5 priority areas — fast, democratic', next: ['s5g'] },
  { id: 's5g', label: 'Capture Everything', type: 'milestone', lane: 've', phase: 5, description: '📸 Photos, recordings, sticky notes, chat — MISS NOTHING', next: ['s5h'] },
  { id: 's5h', label: 'Thank-You Email', type: 'template', lane: 've', phase: 5, templateId: 'post-workshop-thank-you', description: 'Same-day: recap, key themes, next steps timeline', next: ['s6a'] },
  { id: 's6a', label: 'Transcribe Notes', type: 'action', lane: 've', phase: 6, description: 'Transcribe recordings, organize sticky notes, consolidate inputs', next: ['s6b'] },
  { id: 's6b', label: 'Synthesize Themes', type: 'template', lane: 've', phase: 6, templateId: 'workshop-notes-prompt', description: 'Copilot: messy notes → structured themes with evidence', next: ['s6c'] },
  { id: 's6c', label: 'Score Capabilities', type: 'action', lane: 've', phase: 6, description: 'Rate each domain using assessment data + workshop discussion', next: ['s6d'] },
  { id: 's6d', label: 'Generate Deck', type: 'template', lane: 've', phase: 6, templateId: 'synthesis-deck-prompt', description: 'Copilot: generate structured synthesis deck skeleton', next: ['s6e'] },
  { id: 's6e', label: 'Crawl/Walk/Run\nRoadmap', type: 'milestone', lane: 've', phase: 6, description: 'Phased roadmap: 0-6mo quick wins → 6-12mo maturity → 12-24mo optimization', next: ['s6f'] },
  { id: 's6f', label: 'Internal Review', type: 'handoff', lane: 'sales', phase: 6, description: 'Account team reviews before customer delivery — catch landmines', next: ['s7a'] },
  { id: 's7a', label: 'Schedule Readout', type: 'template', lane: 've', phase: 7, templateId: 'readout-meeting-invite', description: '60-90 min with all stakeholders + executive sponsors', next: ['s7b'] },
  { id: 's7b', label: 'Present Synthesis', type: 'milestone', lane: 've', phase: 7, description: 'Capability scores, gap analysis, strategic recommendations, roadmap', next: ['s7c'] },
  { id: 's7c', label: 'Exec Approval', type: 'action', lane: 'customer', phase: 7, description: 'Executive sponsors review roadmap and approve direction', next: ['s7d'] },
  { id: 's7d', label: 'Share Deliverable', type: 'action', lane: 've', phase: 7, description: 'PDF + editable deck + follow-up email within 24 hours', next: ['s7e', 's7f'] },
  { id: 's7e', label: 'Commercial\nTransition', type: 'handoff', lane: 'sales', phase: 7, description: 'Connect Crawl/Walk/Run roadmap to Ivanti solution proposals', next: ['end'] },
  { id: 's7f', label: 'SFDC & Lessons', type: 'action', lane: 've-lead', phase: 7, description: 'Log outcomes, capture NPS, document lessons learned', next: ['end'] },
  { id: 'end', label: 'Complete ✓', type: 'end', lane: 've', phase: 7, next: [] },
];

/* ═══════════════════════════════════════════════════════════════
   LAYOUT ENGINE
   ═══════════════════════════════════════════════════════════════ */

function computeLayout() {
  const cells: Record<string, FlowNode[]> = {};
  nodes.forEach(n => {
    const key = `${n.phase}-${n.lane}`;
    if (!cells[key]) cells[key] = [];
    cells[key].push(n);
  });

  const laneRowHeights: number[] = lanes.map(() => NODE_H + V_PAD * 2);
  lanes.forEach((lane, li) => {
    let maxInCell = 1;
    phaseInfo.forEach(ph => {
      const key = `${ph.num}-${lane.id}`;
      const count = cells[key]?.length || 0;
      if (count > maxInCell) maxInCell = count;
    });
    laneRowHeights[li] = Math.max(NODE_H + V_PAD * 2, maxInCell * (NODE_H + 10) + V_PAD * 2);
  });

  const HEADER_H = 80;
  const laneY: number[] = [];
  let cumY = HEADER_H;
  lanes.forEach((_, i) => { laneY.push(cumY); cumY += laneRowHeights[i]; });

  const positions: Record<string, { x: number; y: number }> = {};
  phaseInfo.forEach((ph) => {
    const phaseX = LANE_LABEL_W + (ph.num - 1) * PHASE_WIDTH;
    lanes.forEach((lane, li) => {
      const key = `${ph.num}-${lane.id}`;
      const cellNodes = cells[key] || [];
      if (cellNodes.length === 0) return;
      const totalStackH = cellNodes.length * NODE_H + (cellNodes.length - 1) * 10;
      const startY = laneY[li] + (laneRowHeights[li] - totalStackH) / 2;
      cellNodes.forEach((node, idx) => {
        positions[node.id] = {
          x: phaseX + (PHASE_WIDTH - NODE_W) / 2,
          y: startY + idx * (NODE_H + 10),
        };
      });
    });
  });

  const totalW = LANE_LABEL_W + phaseInfo.length * PHASE_WIDTH + 60;
  const totalH = cumY + 30;
  return { positions, laneY, laneRowHeights, totalW, totalH };
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function CopyBtn({ text }: { text: string }) {
  const [c, setC] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 2000); }}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${c ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
      {c ? <Check size={12} /> : <Copy size={12} />} {c ? 'Copied' : 'Copy'}
    </button>
  );
}

function TemplateModal({ template, onClose }: { template: Template; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div><h3 className="text-sm font-bold text-gray-900">{template.title}</h3><p className="text-xs text-gray-500 mt-0.5">{template.description}</p></div>
          <div className="flex items-center gap-2"><CopyBtn text={template.content} /><button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={18} /></button></div>
        </div>
        <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed p-5 overflow-y-auto max-h-[60vh] bg-gray-50">{template.content}</pre>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DETAIL PANEL (right sidebar)
   ═══════════════════════════════════════════════════════════════ */

function DetailPanel({ node, onSelectNode, onOpenTemplate, onClose }: {
  node: FlowNode;
  onSelectNode: (id: string) => void;
  onOpenTemplate: (t: Template) => void;
  onClose: () => void;
}) {
  const st = typeStyle[node.type];
  const lane = lanes.find(l => l.id === node.lane);
  const phase = phaseInfo.find(p => p.num === node.phase);
  const targets = node.next.map(id => nodes.find(n => n.id === id)).filter(Boolean) as FlowNode[];
  const sources = nodes.filter(n => n.next.includes(node.id));
  const template = node.templateId ? templates.find(t => t.id === node.templateId) : null;

  return (
    <div className="w-[400px] flex-shrink-0 bg-white border-l border-gray-200 overflow-y-auto shadow-lg">
      <div className="sticky top-0 bg-white border-b border-gray-100 p-5 z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold capitalize px-2.5 py-1 rounded-full" style={{ color: st.text, background: st.bg, border: `1px solid ${st.border}` }}>{st.badge && `${st.badge} `}{node.type}</span>
              {phase && <span className="text-[10px] text-gray-400">Phase {phase.num}</span>}
            </div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">{node.label.replace('\n', ' ')}</h3>
            {lane && <p className="text-xs text-gray-400 mt-1">{lane.label}</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 ml-2"><X size={20} /></button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {node.description && (
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{node.description}</p>
          </div>
        )}

        {template && (
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
            <h4 className="text-[10px] font-semibold text-purple-500 uppercase tracking-wider mb-2">📄 Linked Template</h4>
            <button onClick={() => onOpenTemplate(template)} className="w-full text-left bg-white border border-purple-200 rounded-lg p-3 hover:border-purple-400 hover:shadow-sm transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-purple-700">{template.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{template.description}</div>
                </div>
                <ExternalLink size={14} className="text-gray-400 group-hover:text-purple-500 flex-shrink-0 ml-2" />
              </div>
              <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full mt-2 inline-block">{template.type} · click to open</span>
            </button>
          </div>
        )}

        {sources.length > 0 && (
          <div>
            <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <ArrowLeft size={10} /> Coming From ({sources.length})
            </h4>
            <div className="space-y-1.5">
              {sources.map(s => {
                const sst = typeStyle[s.type];
                return (
                  <button key={s.id} onClick={() => onSelectNode(s.id)}
                    className="w-full text-left bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-300 rounded-lg p-3 transition-all group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        {sst.badge && <span className="text-sm flex-shrink-0">{sst.badge}</span>}
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">{s.label.replace('\n', ' ')}</span>
                      </div>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 flex-shrink-0" />
                    </div>
                    {s.description && <p className="text-[11px] text-gray-400 mt-1 truncate">{s.description}</p>}
                    <div className="flex gap-1.5 mt-1.5">
                      <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ color: sst.text, background: sst.bg }}>{s.type}</span>
                      <span className="text-[9px] text-gray-400">Phase {s.phase}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {targets.length > 0 && (
          <div>
            <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <ArrowRight size={10} /> Goes To ({targets.length})
            </h4>
            <div className="space-y-1.5">
              {targets.map(t => {
                const tst = typeStyle[t.type];
                return (
                  <button key={t.id} onClick={() => onSelectNode(t.id)}
                    className="w-full text-left bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-300 rounded-lg p-3 transition-all group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        {tst.badge && <span className="text-sm flex-shrink-0">{tst.badge}</span>}
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">{t.label.replace('\n', ' ')}</span>
                      </div>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 flex-shrink-0" />
                    </div>
                    {t.description && <p className="text-[11px] text-gray-400 mt-1 truncate">{t.description}</p>}
                    <div className="flex gap-1.5 mt-1.5">
                      <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ color: tst.text, background: tst.bg }}>{t.type}</span>
                      <span className="text-[9px] text-gray-400">Phase {t.phase}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {node.type === 'end' && (
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
            <span className="text-3xl">🏆</span>
            <p className="text-sm font-semibold text-green-700 mt-2">Journey Complete</p>
            <p className="text-xs text-green-600 mt-1">Final step in the C&M engagement process.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FULLSCREEN CANVAS PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function FullscreenMap() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0.65);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOrigin, setPanOrigin] = useState({ x: 0, y: 0 });
  const [minimap, setMinimap] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const { positions, laneY, laneRowHeights, totalW, totalH } = useMemo(() => computeLayout(), []);
  const HEADER_H = 80;
  const activeNodeId = selectedNodeId || hoveredNode;

  const connectedSet = useMemo(() => {
    if (!activeNodeId) return new Set<string>();
    const set = new Set<string>();
    set.add(activeNodeId);
    const queue = [activeNodeId];
    const visited = new Set<string>();
    while (queue.length) {
      const id = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      const n = nodes.find(n => n.id === id);
      if (n) n.next.forEach(nid => { set.add(nid); queue.push(nid); });
    }
    nodes.forEach(n => { if (n.next.includes(activeNodeId)) set.add(n.id); });
    return set;
  }, [activeNodeId]);

  const edges = useMemo(() => {
    const result: { from: string; to: string }[] = [];
    nodes.forEach(n => n.next.forEach(t => result.push({ from: n.id, to: t })));
    return result;
  }, []);

  // Mouse wheel zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setZoom(z => Math.min(Math.max(z + delta, 0.2), 2.0));
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    // Only start pan if clicking on canvas background (not a node)
    const target = e.target as HTMLElement;
    if (target.tagName !== 'svg' && target.tagName !== 'rect' && !target.closest('.canvas-bg')) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
    setPanOrigin({ ...pan });
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: panOrigin.x + (e.clientX - panStart.x),
      y: panOrigin.y + (e.clientY - panStart.y),
    });
  }, [isPanning, panStart, panOrigin]);

  const handleMouseUp = useCallback(() => { setIsPanning(false); }, []);

  const handleNodeClick = useCallback((node: FlowNode) => {
    setSelectedNodeId(prev => prev === node.id ? null : node.id);
  }, []);

  const handleSidebarSelectNode = useCallback((id: string) => {
    setSelectedNodeId(id);
    // Pan to node
    const pos = positions[id];
    if (pos && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      setPan({
        x: cx - (pos.x + NODE_W / 2) * zoom,
        y: cy - (pos.y + NODE_H / 2) * zoom,
      });
    }
  }, [positions, zoom]);

  const fitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const sidebarW = selectedNodeId ? 400 : 0;
    const availW = rect.width - sidebarW;
    const zx = availW / totalW;
    const zy = rect.height / totalH;
    const newZoom = Math.min(zx, zy) * 0.95;
    setZoom(newZoom);
    setPan({ x: (availW - totalW * newZoom) / 2, y: (rect.height - totalH * newZoom) / 2 });
  }, [totalW, totalH, selectedNodeId]);

  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) || null : null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Toolbar */}
      <div className="flex-shrink-0 h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <a href="/" className="text-xs text-gray-400 hover:text-purple-600 flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Playbook
          </a>
          <div className="w-px h-5 bg-gray-200" />
          <h1 className="text-sm font-bold text-gray-800">🔀 C&M Process Map</h1>
          <span className="text-[10px] text-gray-400">{nodes.length} steps · {edges.length} connections</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Legend */}
          <div className="flex items-center gap-2 border-r border-gray-200 pr-3 mr-1">
            {(['action', 'template', 'decision', 'milestone', 'handoff'] as NodeType[]).map(t => (
              <div key={t} className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm border" style={{ background: typeStyle[t].bg, borderColor: typeStyle[t].border }} />
                <span className="text-[9px] capitalize text-gray-500">{t}</span>
              </div>
            ))}
          </div>
          {/* Zoom controls */}
          <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.2))} className="p-1.5 bg-gray-100 rounded hover:bg-gray-200" title="Zoom out">
            <ZoomOut size={14} className="text-gray-500" />
          </button>
          <span className="text-[10px] text-gray-400 w-10 text-center font-mono">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(z + 0.1, 2.0))} className="p-1.5 bg-gray-100 rounded hover:bg-gray-200" title="Zoom in">
            <ZoomIn size={14} className="text-gray-500" />
          </button>
          <button onClick={fitToScreen} className="p-1.5 bg-gray-100 rounded hover:bg-gray-200" title="Fit to screen">
            <Maximize2 size={14} className="text-gray-500" />
          </button>
          <button onClick={() => { setPan({ x: 0, y: 0 }); setZoom(0.65); }} className="p-1.5 bg-gray-100 rounded hover:bg-gray-200 text-[10px] text-gray-500 font-medium px-2" title="Reset view">
            Reset
          </button>
        </div>
      </div>

      {/* Canvas + Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Infinite Canvas */}
        <div
          ref={containerRef}
          className="flex-1 overflow-hidden bg-[#fafbfc] relative"
          style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grid pattern background */}
          <div className="absolute inset-0 canvas-bg" style={{
            backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${pan.x % (20 * zoom)}px ${pan.y % (20 * zoom)}px`,
          }} />

          <svg
            className="absolute top-0 left-0 select-none canvas-bg"
            width="100%"
            height="100%"
            style={{ overflow: 'visible' }}
          >
            <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
              {/* Phase column headers */}
              {phaseInfo.map((ph, i) => {
                const x = LANE_LABEL_W + i * PHASE_WIDTH;
                return (
                  <g key={ph.num}>
                    <rect x={x} y={10} width={PHASE_WIDTH - 6} height={56} rx={10} fill="white" stroke={`${ph.color}30`} strokeWidth={1.5} />
                    <text x={x + PHASE_WIDTH / 2} y={32} fill={ph.color} fontSize={12} fontWeight="bold" textAnchor="middle" fontFamily="system-ui">
                      {ph.icon} Phase {ph.num}
                    </text>
                    <text x={x + PHASE_WIDTH / 2} y={50} fill="#94a3b8" fontSize={10} textAnchor="middle" fontFamily="system-ui">
                      {ph.label} · {ph.sub}
                    </text>
                  </g>
                );
              })}

              {/* Lane backgrounds */}
              {lanes.map((lane, i) => (
                <g key={lane.id}>
                  <rect x={0} y={laneY[i]} width={totalW} height={laneRowHeights[i]} fill="white" stroke="#e5e7eb" strokeWidth={1} rx={6} />
                  <text x={14} y={laneY[i] + laneRowHeights[i] / 2 + 4} fill={lane.color} fontSize={12} fontWeight="bold" fontFamily="system-ui">{lane.label}</text>
                </g>
              ))}

              {/* Edges */}
              {edges.map(({ from, to }, idx) => {
                const fp = positions[from];
                const tp = positions[to];
                if (!fp || !tp) return null;

                const isHl = activeNodeId && connectedSet.has(from) && connectedSet.has(to);
                const isDim = activeNodeId && !isHl;

                let x1 = fp.x + NODE_W, y1 = fp.y + NODE_H / 2;
                let x2 = tp.x, y2 = tp.y + NODE_H / 2;

                const fromNode = nodes.find(n => n.id === from);
                const toNode = nodes.find(n => n.id === to);
                if (toNode && fromNode && toNode.phase <= fromNode.phase) {
                  x1 = fp.x + NODE_W / 2; y1 = fp.y + NODE_H;
                  x2 = tp.x + NODE_W / 2; y2 = tp.y;
                }

                const dx = x2 - x1;
                const cx1 = x1 + dx * 0.4, cy1 = y1;
                const cx2 = x2 - dx * 0.4, cy2 = y2;
                const path = `M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`;

                return (
                  <path key={idx} d={path} fill="none"
                    stroke={isHl ? '#7c3aed' : '#cbd5e1'}
                    strokeWidth={isHl ? 2.5 : 1}
                    strokeDasharray={isDim ? '4,4' : 'none'}
                    opacity={isDim ? 0.12 : isHl ? 1 : 0.4}
                    markerEnd={isHl ? 'url(#arr-hl-fs)' : 'url(#arr-fs)'}
                  />
                );
              })}

              {/* Nodes */}
              {nodes.map(node => {
                const pos = positions[node.id];
                if (!pos) return null;
                const st = typeStyle[node.type];
                const isSelected = selectedNodeId === node.id;
                const isHov = hoveredNode === node.id;
                const isConn = connectedSet.has(node.id);
                const isDim = activeNodeId && !isSelected && !isHov && !isConn;

                return (
                  <g key={node.id}
                    transform={`translate(${pos.x},${pos.y})`}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={(e) => { e.stopPropagation(); handleNodeClick(node); }}
                    style={{ cursor: 'pointer', opacity: isDim ? 0.12 : 1, transition: 'opacity 0.15s' }}
                  >
                    {isSelected && <rect x={-4} y={-4} width={NODE_W + 8} height={NODE_H + 8} rx={14} fill="none" stroke="#7c3aed" strokeWidth={3} />}
                    {isHov && !isSelected && <rect x={-2} y={-2} width={NODE_W + 4} height={NODE_H + 4} rx={12} fill="none" stroke={st.border} strokeWidth={2} opacity={0.6} />}

                    <rect width={NODE_W} height={NODE_H}
                      rx={node.type === 'decision' ? 6 : node.type === 'start' || node.type === 'end' ? NODE_H / 2 : 10}
                      fill={st.bg}
                      stroke={isSelected ? '#7c3aed' : isHov ? st.border : st.border}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      strokeDasharray={node.type === 'decision' ? '5,3' : 'none'}
                    />

                    {st.badge && <text x={10} y={16} fontSize={10} fill={st.text} opacity={0.4} fontFamily="system-ui">{st.badge}</text>}

                    {node.templateId && (
                      <g transform={`translate(${NODE_W - 22}, 4)`}>
                        <rect width={18} height={16} rx={4} fill="#ede9fe" />
                        <text x={9} y={12} fontSize={9} fill="#7c3aed" textAnchor="middle" fontFamily="system-ui">📄</text>
                      </g>
                    )}

                    {node.next.length > 1 && (
                      <g transform={`translate(${NODE_W - 8}, ${NODE_H - 8})`}>
                        <circle r={10} fill="white" stroke="#d1d5db" strokeWidth={1.5} />
                        <text x={0} y={1} fontSize={9} fill="#6b7280" textAnchor="middle" dominantBaseline="middle" fontWeight="bold" fontFamily="system-ui">{node.next.length}</text>
                      </g>
                    )}

                    {node.label.split('\n').map((line, i, arr) => (
                      <text key={i} x={NODE_W / 2} y={NODE_H / 2 + (i - (arr.length - 1) / 2) * 14}
                        fill={isSelected ? '#7c3aed' : st.text}
                        fontSize={11} fontWeight={isSelected || isHov ? 'bold' : '500'}
                        textAnchor="middle" dominantBaseline="middle" fontFamily="system-ui"
                      >{line}</text>
                    ))}
                  </g>
                );
              })}

              {/* Arrow markers */}
              <defs>
                <marker id="arr-fs" viewBox="0 0 10 8" refX="10" refY="4" markerWidth="8" markerHeight="6" orient="auto">
                  <path d="M0 0 L10 4 L0 8 Z" fill="#94a3b8" />
                </marker>
                <marker id="arr-hl-fs" viewBox="0 0 10 8" refX="10" refY="4" markerWidth="8" markerHeight="6" orient="auto">
                  <path d="M0 0 L10 4 L0 8 Z" fill="#7c3aed" />
                </marker>
              </defs>
            </g>
          </svg>

          {/* Minimap */}
          {minimap && (
            <div className="absolute bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-2 opacity-80 hover:opacity-100 transition-opacity">
              <svg width={180} height={90} viewBox={`0 0 ${totalW} ${totalH}`}>
                {lanes.map((lane, i) => (
                  <rect key={lane.id} x={0} y={laneY[i]} width={totalW} height={laneRowHeights[i]} fill="#f1f5f9" stroke="#e2e8f0" strokeWidth={3} rx={4} />
                ))}
                {nodes.map(node => {
                  const pos = positions[node.id];
                  if (!pos) return null;
                  const st = typeStyle[node.type];
                  const isSelected = selectedNodeId === node.id;
                  return (
                    <rect key={node.id} x={pos.x} y={pos.y} width={NODE_W} height={NODE_H}
                      rx={4} fill={isSelected ? '#7c3aed' : st.border} opacity={isSelected ? 1 : 0.6} />
                  );
                })}
                {/* Viewport indicator */}
                {containerRef.current && (() => {
                  const rect = containerRef.current.getBoundingClientRect();
                  const vx = -pan.x / zoom;
                  const vy = -pan.y / zoom;
                  const vw = rect.width / zoom;
                  const vh = rect.height / zoom;
                  return <rect x={vx} y={vy} width={vw} height={vh} fill="none" stroke="#7c3aed" strokeWidth={6} rx={4} />;
                })()}
              </svg>
            </div>
          )}

          {/* Help hint */}
          {!selectedNodeId && (
            <div className="absolute bottom-4 right-4 bg-white/90 border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
              <p className="text-[10px] text-gray-400">
                <span className="font-medium text-gray-500">Scroll</span> to zoom · <span className="font-medium text-gray-500">Drag</span> to pan · <span className="font-medium text-gray-500">Click</span> any step to inspect
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        {selectedNode && (
          <DetailPanel
            node={selectedNode}
            onSelectNode={handleSidebarSelectNode}
            onOpenTemplate={(t) => setSelectedTemplate(t)}
            onClose={() => setSelectedNodeId(null)}
          />
        )}
      </div>

      {selectedTemplate && <TemplateModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />}
    </div>
  );
}
