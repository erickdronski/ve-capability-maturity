'use client';

import { useState, useRef, useMemo } from 'react';
import { Copy, Check, X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { templates } from './data';
import type { Template } from './data';

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

const NODE_W = 140;
const NODE_H = 56;
const H_GAP = 16; // horizontal gap between stacked nodes in same cell
const V_PAD = 20; // vertical padding within lane row
const PHASE_WIDTH = 200; // width per phase column
const LANE_LABEL_W = 150;

const lanes = [
  { id: 'sales', label: '🤝 Sales / Account Team', color: '#f59e0b', bg: 'rgba(245,158,11,0.04)', border: 'rgba(245,158,11,0.12)' },
  { id: 've-lead', label: '📋 VE Lead', color: '#3b82f6', bg: 'rgba(59,130,246,0.04)', border: 'rgba(59,130,246,0.12)' },
  { id: 've', label: '💡 Value Engineer', color: '#a855f7', bg: 'rgba(168,85,247,0.04)', border: 'rgba(168,85,247,0.12)' },
  { id: 'customer', label: '🏢 Customer', color: '#22c55e', bg: 'rgba(34,197,94,0.04)', border: 'rgba(34,197,94,0.12)' },
  { id: 'logistics', label: '📦 Logistics / Ops', color: '#f43f5e', bg: 'rgba(244,63,94,0.04)', border: 'rgba(244,63,94,0.12)' },
];

const phaseInfo = [
  { num: 1, label: 'Lead Intake', icon: '🎯', sub: 'Day 0', color: '#3b82f6' },
  { num: 2, label: 'Discovery & Scheduling', icon: '🔍', sub: 'Days 1–5', color: '#f97316' },
  { num: 3, label: 'Assessment Setup', icon: '📋', sub: 'Days 3–7', color: '#22c55e' },
  { num: 4, label: 'Pre-Workshop Prep', icon: '🧩', sub: 'Days 7–12', color: '#06b6d4' },
  { num: 5, label: 'Workshop Delivery', icon: '🎪', sub: 'Workshop Day', color: '#a855f7' },
  { num: 6, label: 'Post-Workshop Synthesis', icon: '🔬', sub: 'Days 14–21', color: '#f43f5e' },
  { num: 7, label: 'Deliverable & Handoff', icon: '🏆', sub: 'Days 21–28', color: '#f59e0b' },
];

const typeStyle: Record<NodeType, { fill: string; stroke: string; text: string; badge?: string }> = {
  start:    { fill: '#0d1a0d', stroke: '#22c55e', text: '#4ade80', badge: '🟢' },
  action:   { fill: '#141418', stroke: '#3a3a3a', text: '#bbb' },
  template: { fill: '#1a1028', stroke: '#7c3aed', text: '#c4b5fd', badge: '📄' },
  decision: { fill: '#1c1a0e', stroke: '#d97706', text: '#fbbf24', badge: '◆' },
  milestone:{ fill: '#0d1a16', stroke: '#059669', text: '#6ee7b7', badge: '★' },
  handoff:  { fill: '#1a0e14', stroke: '#e11d48', text: '#fda4af', badge: '→' },
  end:      { fill: '#1a0d0d', stroke: '#ef4444', text: '#fca5a5', badge: '🔴' },
};

/* ═══════════════════════════════════════════════════════════════
   FLOW DATA
   ═══════════════════════════════════════════════════════════════ */

const nodes: FlowNode[] = [
  // Phase 1: Lead Intake
  { id: 'start', label: 'New Lead Enters', type: 'start', lane: 'sales', phase: 1, next: ['s1a', 's1b', 's1c'] },
  { id: 's1a', label: 'Marketing Lead', type: 'action', lane: 'sales', phase: 1, description: 'Website, event, webinar, content download', next: ['s1d'] },
  { id: 's1b', label: 'Sales Qualified', type: 'action', lane: 'sales', phase: 1, description: 'Rep pitched and qualified the customer', next: ['s1d'] },
  { id: 's1c', label: 'Partner Referral', type: 'action', lane: 'sales', phase: 1, description: 'Partner referral or customer self-service', next: ['s1d'] },
  { id: 's1d', label: 'Qualify for C&M?', type: 'decision', lane: 'sales', phase: 1, description: 'Is this customer a fit for a Capability & Maturity engagement?', next: ['s1e'] },
  { id: 's1e', label: 'Route to VE', type: 'handoff', lane: 'sales', phase: 1, description: 'Hand off qualified lead to Value Engineering team', next: ['s1f'] },
  { id: 's1f', label: 'Assign VE Owner', type: 'action', lane: 've-lead', phase: 1, description: 'Assign owner, log in Salesforce as C&M opportunity', next: ['s2a'] },

  // Phase 2: Discovery
  { id: 's2a', label: 'Schedule Discovery', type: 'action', lane: 've', phase: 2, description: 'Within 48 hours of lead assignment', next: ['s2b'] },
  { id: 's2b', label: 'Discovery Call', type: 'milestone', lane: 've', phase: 2, description: 'Understand pain points, objectives, org structure, current Ivanti footprint', next: ['s2c', 's2d', 's2e'] },
  { id: 's2c', label: 'Format Decision', type: 'decision', lane: 've', phase: 2, description: 'Virtual (Teams/Zoom), Onsite, or Hybrid workshop?', next: ['s2c1', 's2c2', 's2c3'] },
  { id: 's2c1', label: 'Virtual', type: 'action', lane: 've', phase: 2, next: ['s2f'] },
  { id: 's2c2', label: 'Onsite', type: 'action', lane: 've', phase: 2, next: ['s2f', 's4log'] },
  { id: 's2c3', label: 'Hybrid', type: 'action', lane: 've', phase: 2, next: ['s2f', 's4log'] },
  { id: 's2d', label: 'Confirm Participants', type: 'action', lane: 'customer', phase: 2, description: '5-12 stakeholders: names, titles, emails', next: ['s2f'] },
  { id: 's2e', label: 'Scope Domains', type: 'action', lane: 've', phase: 2, description: 'ITSM, Security, UEM — which capabilities to assess', next: ['s2f'] },
  { id: 's2f', label: 'Engagement Email', type: 'template', lane: 've', phase: 2, templateId: 'initial-outreach-email', description: 'Formal email: agenda, logistics, participants, next steps', next: ['s3a'] },

  // Phase 3: Assessment
  { id: 's3a', label: 'Facilitator Portal', type: 'action', lane: 've', phase: 3, description: 'Log into online assessment facilitator portal', next: ['s3b'] },
  { id: 's3b', label: 'Create Assessment', type: 'action', lane: 've', phase: 3, description: 'Configure domains, participants, completion deadline', next: ['s3c'] },
  { id: 's3c', label: 'Generate URL', type: 'milestone', lane: 've', phase: 3, description: 'Unique customer assessment link created', next: ['s3d'] },
  { id: 's3d', label: 'Assessment Invite', type: 'template', lane: 've', phase: 3, templateId: 'assessment-invitation-email', description: 'Email all participants with link and deadline', next: ['s3e', 's3f'] },
  { id: 's3e', label: 'Complete Assessment', type: 'action', lane: 'customer', phase: 3, description: '15-20 min per participant — rate capabilities honestly', next: ['s4a'] },
  { id: 's3f', label: 'Send Reminders', type: 'template', lane: 've', phase: 3, templateId: 'assessment-reminder-email', description: 'Day 3 + Day 5 nudges. Target 80%+ response rate', next: ['s3e'] },

  // Phase 4: Pre-Workshop
  { id: 's4a', label: 'Download Responses', type: 'action', lane: 've', phase: 4, description: 'Export and review all participant assessment data', next: ['s4b'] },
  { id: 's4b', label: 'Build Canvas Board', type: 'milestone', lane: 've', phase: 4, description: 'Multi-stakeholder canvas in Lucidchart/Miro showing alignment & divergence', next: ['s4c', 's4d'] },
  { id: 's4c', label: 'Prep Deck & Exercises', type: 'action', lane: 've', phase: 4, description: 'Facilitation deck, breakout exercises, discussion prompts', next: ['s4e'] },
  { id: 's4d', label: 'Identify Themes', type: 'action', lane: 've', phase: 4, description: 'Key themes, gaps, areas of stakeholder agreement/disagreement', next: ['s4e'] },
  { id: 's4log', label: 'Onsite Needed?', type: 'decision', lane: 'logistics', phase: 4, description: 'If onsite or hybrid, trigger logistics workflow', next: ['s4log1', 's4log2'] },
  { id: 's4log1', label: 'FedEx Supplies', type: 'template', lane: 'logistics', phase: 4, templateId: 'fedex-shipping-checklist', description: 'Ship Capability Cards, easel pads, markers — 5+ days out', next: ['s4e'] },
  { id: 's4log2', label: 'Venue & AV', type: 'action', lane: 'logistics', phase: 4, description: 'Confirm venue, AV equipment, catering, room layout', next: ['s4e'] },
  { id: 's4e', label: 'Brief Account Team', type: 'handoff', lane: 'sales', phase: 4, description: 'Share findings, themes, and workshop game plan with sales rep', next: ['s5a'] },

  // Phase 5: Workshop
  { id: 's5a', label: 'Welcome & Rules', type: 'action', lane: 've', phase: 5, description: 'Open session, set ground rules, share agenda', next: ['s5b'] },
  { id: 's5b', label: 'Present Canvas', type: 'milestone', lane: 've', phase: 5, description: 'Show where stakeholder perspectives align and diverge', next: ['s5c'] },
  { id: 's5c', label: 'Domain Review', type: 'action', lane: 've', phase: 5, description: 'Walk through each capability domain with the group', next: ['s5d'] },
  { id: 's5d', label: 'Breakout Sessions', type: 'action', lane: 've', phase: 5, description: 'Small group exercises on priority areas', next: ['s5e'] },
  { id: 's5e', label: 'Stakeholder Input', type: 'action', lane: 'customer', phase: 5, description: 'Participants contribute perspectives, debate priorities', next: ['s5f'] },
  { id: 's5f', label: 'Priority Voting', type: 'action', lane: 've', phase: 5, description: 'Dot voting on top 3-5 priority areas — fast, democratic', next: ['s5g'] },
  { id: 's5g', label: 'Capture Everything', type: 'milestone', lane: 've', phase: 5, description: '📸 Photos, recordings, sticky notes, chat — MISS NOTHING', next: ['s5h'] },
  { id: 's5h', label: 'Thank-You Email', type: 'template', lane: 've', phase: 5, templateId: 'post-workshop-thank-you', description: 'Same-day: recap, key themes, next steps timeline', next: ['s6a'] },

  // Phase 6: Synthesis
  { id: 's6a', label: 'Transcribe Notes', type: 'action', lane: 've', phase: 6, description: 'Transcribe recordings, organize sticky notes, consolidate inputs', next: ['s6b'] },
  { id: 's6b', label: 'Synthesize Themes', type: 'template', lane: 've', phase: 6, templateId: 'workshop-notes-prompt', description: 'Copilot: messy notes → structured themes with evidence', next: ['s6c'] },
  { id: 's6c', label: 'Score Capabilities', type: 'action', lane: 've', phase: 6, description: 'Rate each domain using assessment data + workshop discussion', next: ['s6d'] },
  { id: 's6d', label: 'Generate Deck', type: 'template', lane: 've', phase: 6, templateId: 'synthesis-deck-prompt', description: 'Copilot: generate structured synthesis deck skeleton', next: ['s6e'] },
  { id: 's6e', label: 'Crawl/Walk/Run\nRoadmap', type: 'milestone', lane: 've', phase: 6, description: 'Phased roadmap: 0-6mo quick wins → 6-12mo maturity → 12-24mo optimization', next: ['s6f'] },
  { id: 's6f', label: 'Internal Review', type: 'handoff', lane: 'sales', phase: 6, description: 'Account team reviews before customer delivery — catch landmines', next: ['s7a'] },

  // Phase 7: Deliverable
  { id: 's7a', label: 'Schedule Readout', type: 'template', lane: 've', phase: 7, templateId: 'readout-meeting-invite', description: '60-90 min with all stakeholders + executive sponsors', next: ['s7b'] },
  { id: 's7b', label: 'Present Synthesis', type: 'milestone', lane: 've', phase: 7, description: 'Capability scores, gap analysis, strategic recommendations, roadmap', next: ['s7c'] },
  { id: 's7c', label: 'Exec Approval', type: 'action', lane: 'customer', phase: 7, description: 'Executive sponsors review roadmap and approve direction', next: ['s7d'] },
  { id: 's7d', label: 'Share Deliverable', type: 'action', lane: 've', phase: 7, description: 'PDF + editable deck + follow-up email within 24 hours', next: ['s7e', 's7f'] },
  { id: 's7e', label: 'Commercial\nTransition', type: 'handoff', lane: 'sales', phase: 7, description: 'Connect Crawl/Walk/Run roadmap to Ivanti solution proposals', next: ['end'] },
  { id: 's7f', label: 'SFDC & Lessons', type: 'action', lane: 've-lead', phase: 7, description: 'Log outcomes, capture NPS, document lessons learned', next: ['end'] },
  { id: 'end', label: 'Complete ✓', type: 'end', lane: 've', phase: 7, next: [] },
];

/* ═══════════════════════════════════════════════════════════════
   SMART LAYOUT ENGINE — No overlaps
   ═══════════════════════════════════════════════════════════════ */

function computeLayout() {
  const laneIdx: Record<string, number> = {};
  lanes.forEach((l, i) => { laneIdx[l.id] = i; });

  // Group nodes by (phase, lane)
  const cells: Record<string, FlowNode[]> = {};
  nodes.forEach(n => {
    const key = `${n.phase}-${n.lane}`;
    if (!cells[key]) cells[key] = [];
    cells[key].push(n);
  });

  // Calculate max stacked nodes per lane across all phases
  // and per-phase max stacked height per lane
  const laneRowHeights: number[] = lanes.map(() => NODE_H + V_PAD * 2);
  
  lanes.forEach((lane, li) => {
    let maxInCell = 1;
    phaseInfo.forEach(ph => {
      const key = `${ph.num}-${lane.id}`;
      const count = cells[key]?.length || 0;
      if (count > maxInCell) maxInCell = count;
    });
    laneRowHeights[li] = Math.max(NODE_H + V_PAD * 2, maxInCell * (NODE_H + 8) + V_PAD * 2);
  });

  // Calculate cumulative Y positions for lanes
  const HEADER_H = 70;
  const laneY: number[] = [];
  let cumY = HEADER_H;
  lanes.forEach((_, i) => {
    laneY.push(cumY);
    cumY += laneRowHeights[i];
  });

  // Position each node
  const positions: Record<string, { x: number; y: number }> = {};

  phaseInfo.forEach((ph) => {
    const phaseX = LANE_LABEL_W + (ph.num - 1) * PHASE_WIDTH;

    lanes.forEach((lane, li) => {
      const key = `${ph.num}-${lane.id}`;
      const cellNodes = cells[key] || [];
      const cellCount = cellNodes.length;

      if (cellCount === 0) return;

      // Stack nodes vertically, centered in the lane row
      const totalStackH = cellCount * NODE_H + (cellCount - 1) * 8;
      const startY = laneY[li] + (laneRowHeights[li] - totalStackH) / 2;

      // If multiple nodes, spread horizontally too for better readability
      cellNodes.forEach((node, idx) => {
        const x = phaseX + (PHASE_WIDTH - NODE_W) / 2;
        const y = startY + idx * (NODE_H + 8);
        positions[node.id] = { x, y };
      });
    });
  });

  const totalW = LANE_LABEL_W + phaseInfo.length * PHASE_WIDTH + 40;
  const totalH = cumY + 20;

  return { positions, laneY, laneRowHeights, totalW, totalH };
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function CopyBtn({ text }: { text: string }) {
  const [c, setC] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 2000); }}
      className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] ${c ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-[#888] hover:bg-white/10'}`}>
      {c ? <Check size={10} /> : <Copy size={10} />} {c ? 'Copied' : 'Copy'}
    </button>
  );
}

function TemplateModal({ template, onClose }: { template: Template; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-[#222]">
          <div><h3 className="text-sm font-bold text-white">{template.title}</h3><p className="text-[10px] text-[#666] mt-0.5">{template.description}</p></div>
          <div className="flex items-center gap-2"><CopyBtn text={template.content} /><button onClick={onClose} className="text-[#555] hover:text-white"><X size={18} /></button></div>
        </div>
        <pre className="text-xs text-[#ccc] whitespace-pre-wrap font-mono leading-relaxed p-4 overflow-y-auto max-h-[60vh]">{template.content}</pre>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════════ */

export default function ProcessMapView() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0.7);
  const containerRef = useRef<HTMLDivElement>(null);

  const { positions, laneY, laneRowHeights, totalW, totalH } = useMemo(() => computeLayout(), []);

  const HEADER_H = 70;

  // Connected set for highlighting
  const connectedSet = useMemo(() => {
    if (!hoveredNode) return new Set<string>();
    const set = new Set<string>();
    set.add(hoveredNode);
    // Forward
    const queue = [hoveredNode];
    const visited = new Set<string>();
    while (queue.length) {
      const id = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      const n = nodes.find(n => n.id === id);
      if (n) n.next.forEach(nid => { set.add(nid); queue.push(nid); });
    }
    // Backward
    nodes.forEach(n => { if (n.next.includes(hoveredNode)) set.add(n.id); });
    return set;
  }, [hoveredNode]);

  // Connection edges
  const edges = useMemo(() => {
    const result: { from: string; to: string }[] = [];
    nodes.forEach(n => n.next.forEach(t => result.push({ from: n.id, to: t })));
    return result;
  }, []);

  const handleClick = (node: FlowNode) => {
    if (node.templateId) {
      const t = templates.find(t => t.id === node.templateId);
      if (t) setSelectedTemplate(t);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-base font-bold text-white">🔀 Capability & Maturity — End-to-End Process Flow</h2>
            <p className="text-[11px] text-[#666] mt-0.5">
              {nodes.length} steps · {edges.length} connections · 5 swim lanes · 7 phases · ~28 days end-to-end
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border-r border-[#222] pr-3">
              {(['action', 'template', 'decision', 'milestone', 'handoff'] as NodeType[]).map(t => (
                <div key={t} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm border" style={{ background: typeStyle[t].fill, borderColor: typeStyle[t].stroke }} />
                  <span className="text-[9px] capitalize" style={{ color: typeStyle[t].text }}>{t}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.3))} className="p-1.5 bg-[#1a1a1a] rounded hover:bg-[#222]"><ZoomOut size={14} className="text-[#888]" /></button>
              <span className="text-[10px] text-[#555] w-10 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(z + 0.1, 1.5))} className="p-1.5 bg-[#1a1a1a] rounded hover:bg-[#222]"><ZoomIn size={14} className="text-[#888]" /></button>
              <button onClick={() => setZoom(0.7)} className="p-1.5 bg-[#1a1a1a] rounded hover:bg-[#222] ml-1"><Maximize2 size={14} className="text-[#888]" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="bg-[#080810] border border-[#222] rounded-xl overflow-auto" style={{ height: '72vh' }}>
        <svg
          width={totalW * zoom}
          height={totalH * zoom}
          viewBox={`0 0 ${totalW} ${totalH}`}
          className="select-none"
        >
          <defs>
            <marker id="arr" viewBox="0 0 10 8" refX="10" refY="4" markerWidth="7" markerHeight="6" orient="auto">
              <path d="M0 0 L10 4 L0 8 Z" fill="#444" />
            </marker>
            <marker id="arr-hl" viewBox="0 0 10 8" refX="10" refY="4" markerWidth="7" markerHeight="6" orient="auto">
              <path d="M0 0 L10 4 L0 8 Z" fill="#a855f7" />
            </marker>
            <marker id="arr-tpl" viewBox="0 0 10 8" refX="10" refY="4" markerWidth="7" markerHeight="6" orient="auto">
              <path d="M0 0 L10 4 L0 8 Z" fill="#7c3aed" />
            </marker>
          </defs>

          {/* Phase column headers */}
          {phaseInfo.map((ph, i) => {
            const x = LANE_LABEL_W + i * PHASE_WIDTH;
            return (
              <g key={ph.num}>
                <rect x={x} y={8} width={PHASE_WIDTH - 4} height={50} rx={8} fill={`${ph.color}10`} stroke={`${ph.color}25`} strokeWidth={1} />
                <text x={x + PHASE_WIDTH / 2} y={28} fill={ph.color} fontSize={11} fontWeight="bold" textAnchor="middle" fontFamily="system-ui">
                  {ph.icon} Phase {ph.num}
                </text>
                <text x={x + PHASE_WIDTH / 2} y={43} fill={`${ph.color}90`} fontSize={9} textAnchor="middle" fontFamily="system-ui">
                  {ph.label} · {ph.sub}
                </text>
              </g>
            );
          })}

          {/* Lane backgrounds & labels */}
          {lanes.map((lane, i) => (
            <g key={lane.id}>
              <rect x={0} y={laneY[i]} width={totalW} height={laneRowHeights[i]} fill={lane.bg} stroke={lane.border} strokeWidth={1} rx={4} />
              <text x={12} y={laneY[i] + laneRowHeights[i] / 2 + 4} fill={lane.color} fontSize={11} fontWeight="bold" fontFamily="system-ui">{lane.label}</text>
            </g>
          ))}

          {/* EDGES — bezier curves */}
          {edges.map(({ from, to }, idx) => {
            const fp = positions[from];
            const tp = positions[to];
            if (!fp || !tp) return null;

            const isHl = hoveredNode && (connectedSet.has(from) && connectedSet.has(to));
            const isDim = hoveredNode && !isHl;

            // Exit right of source, enter left of target
            let x1 = fp.x + NODE_W;
            let y1 = fp.y + NODE_H / 2;
            let x2 = tp.x;
            let y2 = tp.y + NODE_H / 2;

            // If target is same phase or left, route differently
            const fromNode = nodes.find(n => n.id === from);
            const toNode = nodes.find(n => n.id === to);
            if (toNode && fromNode && toNode.phase <= fromNode.phase) {
              // Backward or same-phase: exit bottom, enter top
              x1 = fp.x + NODE_W / 2;
              y1 = fp.y + NODE_H;
              x2 = tp.x + NODE_W / 2;
              y2 = tp.y;
            }

            const dx = x2 - x1;
            const dy = y2 - y1;
            const cx1 = x1 + dx * 0.4;
            const cy1 = y1;
            const cx2 = x2 - dx * 0.4;
            const cy2 = y2;
            const path = `M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`;

            return (
              <path
                key={idx}
                d={path}
                fill="none"
                stroke={isHl ? '#a855f7' : '#333'}
                strokeWidth={isHl ? 2 : 1}
                strokeDasharray={isDim ? '4,4' : 'none'}
                opacity={isDim ? 0.08 : isHl ? 0.9 : 0.35}
                markerEnd={isHl ? 'url(#arr-hl)' : 'url(#arr)'}
              />
            );
          })}

          {/* NODES */}
          {nodes.map(node => {
            const pos = positions[node.id];
            if (!pos) return null;
            const st = typeStyle[node.type];
            const isHov = hoveredNode === node.id;
            const isConn = connectedSet.has(node.id);
            const isDim = hoveredNode && !isHov && !isConn;
            const hasTemplate = node.type === 'template';

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x},${pos.y})`}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => handleClick(node)}
                style={{ cursor: hasTemplate ? 'pointer' : 'default', opacity: isDim ? 0.12 : 1, transition: 'opacity 0.15s' }}
              >
                {/* Shadow on hover */}
                {isHov && <rect x={-2} y={-2} width={NODE_W + 4} height={NODE_H + 4} rx={10} fill="none" stroke={st.stroke} strokeWidth={2} opacity={0.5} />}

                {/* Main rect */}
                <rect
                  width={NODE_W}
                  height={NODE_H}
                  rx={node.type === 'decision' ? 4 : node.type === 'start' || node.type === 'end' ? NODE_H / 2 : 8}
                  fill={st.fill}
                  stroke={isHov ? '#fff' : st.stroke}
                  strokeWidth={isHov ? 2 : 1.2}
                  strokeDasharray={node.type === 'decision' ? '4,2' : 'none'}
                />

                {/* Type badge */}
                {st.badge && (
                  <text x={8} y={14} fontSize={9} fill={st.text} opacity={0.5} fontFamily="system-ui">{st.badge}</text>
                )}

                {/* Template indicator */}
                {hasTemplate && (
                  <g transform={`translate(${NODE_W - 20}, 4)`}>
                    <rect width={16} height={14} rx={3} fill="#7c3aed" opacity={0.25} />
                    <text x={8} y={11} fontSize={8} fill="#c4b5fd" textAnchor="middle" fontFamily="system-ui">📄</text>
                  </g>
                )}

                {/* Multi-output badge */}
                {node.next.length > 1 && (
                  <g transform={`translate(${NODE_W - 6}, ${NODE_H - 6})`}>
                    <circle r={9} fill="#1a1a2a" stroke="#555" strokeWidth={1} />
                    <text x={0} y={1} fontSize={8} fill="#aaa" textAnchor="middle" dominantBaseline="middle" fontWeight="bold" fontFamily="system-ui">{node.next.length}</text>
                  </g>
                )}

                {/* Label */}
                {node.label.split('\n').map((line, i, arr) => (
                  <text
                    key={i}
                    x={NODE_W / 2}
                    y={NODE_H / 2 + (i - (arr.length - 1) / 2) * 13}
                    fill={isHov ? '#fff' : st.text}
                    fontSize={10}
                    fontWeight={isHov ? 'bold' : '500'}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="system-ui"
                  >{line}</text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hover detail panel */}
      {hoveredNode && (() => {
        const n = nodes.find(n => n.id === hoveredNode);
        if (!n) return null;
        const st = typeStyle[n.type];
        const targets = n.next.map(id => nodes.find(nn => nn.id === id)).filter(Boolean);
        const sources = nodes.filter(nn => nn.next.includes(n.id));
        return (
          <div className="bg-[#111] border rounded-xl p-4 flex items-start gap-4" style={{ borderColor: st.stroke }}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold capitalize px-2 py-0.5 rounded" style={{ color: st.text, background: st.fill, border: `1px solid ${st.stroke}` }}>{n.type}</span>
                <span className="text-sm font-bold text-white">{n.label.replace('\n', ' ')}</span>
              </div>
              {n.description && <p className="text-xs text-[#999] mt-1">{n.description}</p>}
            </div>
            <div className="text-right text-[10px] space-y-1 min-w-[200px]">
              {sources.length > 0 && (
                <div className="text-[#666]">← From: {sources.map(s => <span key={s.id} className="text-[#aaa] bg-white/5 px-1 py-0.5 rounded ml-1">{s.label.replace('\n', ' ')}</span>)}</div>
              )}
              {targets.length > 0 && (
                <div className="text-[#666]">→ To: {targets.map(t => <span key={t!.id} className="bg-white/5 px-1 py-0.5 rounded ml-1" style={{ color: typeStyle[t!.type].text }}>{t!.label.replace('\n', ' ')}</span>)}</div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Impact Summary — for VP presentation */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-3">📊 Process at a Glance — For Leadership</h3>
        <div className="grid grid-cols-7 gap-2">
          {phaseInfo.map(ph => {
            const phaseNodes = nodes.filter(n => n.phase === ph.num);
            const tCount = phaseNodes.filter(n => n.type === 'template').length;
            const dCount = phaseNodes.filter(n => n.type === 'decision').length;
            const mCount = phaseNodes.filter(n => n.type === 'milestone').length;
            const hCount = phaseNodes.filter(n => n.type === 'handoff').length;
            return (
              <div key={ph.num} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-3 text-center">
                <div className="text-lg mb-1">{ph.icon}</div>
                <div className="text-[10px] font-bold" style={{ color: ph.color }}>{ph.label}</div>
                <div className="text-[9px] text-[#555] mt-0.5">{ph.sub}</div>
                <div className="text-lg font-bold text-white mt-2">{phaseNodes.length}</div>
                <div className="text-[9px] text-[#555]">steps</div>
                <div className="flex justify-center gap-1 mt-2 flex-wrap">
                  {tCount > 0 && <span className="text-[8px] bg-purple-500/15 text-purple-400 px-1 rounded">{tCount}📄</span>}
                  {dCount > 0 && <span className="text-[8px] bg-amber-500/15 text-amber-400 px-1 rounded">{dCount}◆</span>}
                  {mCount > 0 && <span className="text-[8px] bg-green-500/15 text-green-400 px-1 rounded">{mCount}★</span>}
                  {hCount > 0 && <span className="text-[8px] bg-rose-500/15 text-rose-400 px-1 rounded">{hCount}→</span>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-4 gap-3 mt-4">
          <div className="bg-purple-500/5 border border-purple-500/15 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-400">{nodes.filter(n => n.type === 'template').length}</div>
            <div className="text-[10px] text-purple-300/70">Templated Steps</div>
            <div className="text-[9px] text-[#555] mt-1">Emails, prompts, checklists — click to use</div>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-amber-400">{nodes.filter(n => n.type === 'decision').length}</div>
            <div className="text-[10px] text-amber-300/70">Decision Points</div>
            <div className="text-[9px] text-[#555] mt-1">Format, logistics, approval gates</div>
          </div>
          <div className="bg-rose-500/5 border border-rose-500/15 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-rose-400">{nodes.filter(n => n.type === 'handoff').length}</div>
            <div className="text-[10px] text-rose-300/70">Cross-Team Handoffs</div>
            <div className="text-[9px] text-[#555] mt-1">VE ↔ Sales ↔ Customer transitions</div>
          </div>
          <div className="bg-green-500/5 border border-green-500/15 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-400">{nodes.filter(n => n.type === 'milestone').length}</div>
            <div className="text-[10px] text-green-300/70">Key Milestones</div>
            <div className="text-[9px] text-[#555] mt-1">Canvas, URL, capture, roadmap, synthesis</div>
          </div>
        </div>
      </div>

      {selectedTemplate && <TemplateModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />}
    </div>
  );
}
