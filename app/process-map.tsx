'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Copy, Check, X, FileText, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { templates } from './data';
import type { Template } from './data';

/* ═══════════════════════════════════════════════════════════════
   TYPES
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
  next: string[]; // ids of connected nodes
};

/* ═══════════════════════════════════════════════════════════════
   FLOW DATA — Full journey with connections
   ═══════════════════════════════════════════════════════════════ */

const nodes: FlowNode[] = [
  // START
  { id: 'start', label: 'New Lead Enters', type: 'start', lane: 'sales', phase: 1, next: ['s1a', 's1b', 's1c'] },

  // Phase 1: Lead Intake — 3 entry paths
  { id: 's1a', label: 'Marketing Lead\n(website, event, webinar)', type: 'action', lane: 'sales', phase: 1, next: ['s1d'] },
  { id: 's1b', label: 'Sales Qualified\n(rep pitched & qualified)', type: 'action', lane: 'sales', phase: 1, next: ['s1d'] },
  { id: 's1c', label: 'Partner Referral\nor Self-Service', type: 'action', lane: 'sales', phase: 1, next: ['s1d'] },
  { id: 's1d', label: 'Qualify for C&M\nEngagement', type: 'decision', lane: 'sales', phase: 1, description: 'Is this customer a fit for Capability & Maturity?', next: ['s1e'] },
  { id: 's1e', label: 'Route to VE Team', type: 'handoff', lane: 'sales', phase: 1, next: ['s1f'] },
  { id: 's1f', label: 'Assign VE Owner\n& Log in SFDC', type: 'action', lane: 've-lead', phase: 1, next: ['s2a'] },

  // Phase 2: Discovery
  { id: 's2a', label: 'Schedule\nDiscovery Call', type: 'action', lane: 've', phase: 2, description: 'Within 48 hours of assignment', next: ['s2b'] },
  { id: 's2b', label: 'Run Discovery\nCall', type: 'milestone', lane: 've', phase: 2, description: 'Understand pain points, objectives, org structure', next: ['s2c', 's2d', 's2e'] },
  { id: 's2c', label: 'Workshop\nFormat?', type: 'decision', lane: 've', phase: 2, description: 'Virtual / Onsite / Hybrid', next: ['s2c1', 's2c2', 's2c3'] },
  { id: 's2c1', label: 'Virtual\n(Teams/Zoom)', type: 'action', lane: 've', phase: 2, next: ['s2f'] },
  { id: 's2c2', label: 'Onsite', type: 'action', lane: 've', phase: 2, next: ['s2f', 's4log'] },
  { id: 's2c3', label: 'Hybrid', type: 'action', lane: 've', phase: 2, next: ['s2f', 's4log'] },
  { id: 's2d', label: 'Confirm\nParticipants', type: 'action', lane: 'customer', phase: 2, description: '5-12 stakeholders with names, titles, emails', next: ['s2f'] },
  { id: 's2e', label: 'Scope Capability\nDomains', type: 'action', lane: 've', phase: 2, next: ['s2f'] },
  { id: 's2f', label: 'Send Engagement\nEmail', type: 'template', lane: 've', phase: 2, templateId: 'initial-outreach-email', description: 'Formal email with agenda, logistics, participants', next: ['s3a'] },

  // Phase 3: Assessment
  { id: 's3a', label: 'Access Facilitator\nPortal', type: 'action', lane: 've', phase: 3, next: ['s3b'] },
  { id: 's3b', label: 'Create Assessment\nInstance', type: 'action', lane: 've', phase: 3, description: 'Configure domains, participants, deadline', next: ['s3c'] },
  { id: 's3c', label: 'Generate\nCustomer URL', type: 'milestone', lane: 've', phase: 3, next: ['s3d'] },
  { id: 's3d', label: 'Send Assessment\nInvite', type: 'template', lane: 've', phase: 3, templateId: 'assessment-invitation-email', next: ['s3e', 's3f'] },
  { id: 's3e', label: 'Complete\nAssessment', type: 'action', lane: 'customer', phase: 3, description: '15-20 min per participant', next: ['s4a'] },
  { id: 's3f', label: 'Send Reminders\n(Day 3, Day 5)', type: 'template', lane: 've', phase: 3, templateId: 'assessment-reminder-email', description: 'Target 80%+ response rate', next: ['s3e'] },

  // Phase 4: Pre-Workshop
  { id: 's4a', label: 'Download &\nReview Responses', type: 'action', lane: 've', phase: 4, next: ['s4b'] },
  { id: 's4b', label: 'Build Multi-Stakeholder\nCanvas Board', type: 'milestone', lane: 've', phase: 4, description: 'Lucidchart/Miro — show alignment & divergence', next: ['s4c', 's4d'] },
  { id: 's4c', label: 'Prep Facilitation\nDeck & Exercises', type: 'action', lane: 've', phase: 4, next: ['s4e'] },
  { id: 's4d', label: 'Identify Key\nThemes & Gaps', type: 'action', lane: 've', phase: 4, next: ['s4e'] },
  { id: 's4log', label: 'Onsite\nLogistics?', type: 'decision', lane: 'logistics', phase: 4, next: ['s4log1', 's4log2'] },
  { id: 's4log1', label: 'Order FedEx\nSupplies', type: 'template', lane: 'logistics', phase: 4, templateId: 'fedex-shipping-checklist', description: 'Capability Cards, easel pads, markers, etc.', next: ['s4e'] },
  { id: 's4log2', label: 'Confirm Venue\n& AV Setup', type: 'action', lane: 'logistics', phase: 4, next: ['s4e'] },
  { id: 's4e', label: 'Brief Account\nTeam', type: 'handoff', lane: 'sales', phase: 4, description: 'Share pre-workshop findings & themes', next: ['s5a'] },

  // Phase 5: Workshop
  { id: 's5a', label: 'Welcome &\nGround Rules', type: 'action', lane: 've', phase: 5, next: ['s5b'] },
  { id: 's5b', label: 'Present Canvas\nResults', type: 'milestone', lane: 've', phase: 5, description: 'Show stakeholder alignment & divergence', next: ['s5c'] },
  { id: 's5c', label: 'Domain-by-Domain\nReview', type: 'action', lane: 've', phase: 5, next: ['s5d'] },
  { id: 's5d', label: 'Breakout\nExercises', type: 'action', lane: 've', phase: 5, next: ['s5e'] },
  { id: 's5e', label: 'Participate &\nProvide Input', type: 'action', lane: 'customer', phase: 5, description: 'Stakeholders contribute, vote, co-create', next: ['s5f'] },
  { id: 's5f', label: 'Priority Voting\n(Dot Vote)', type: 'action', lane: 've', phase: 5, next: ['s5g'] },
  { id: 's5g', label: 'Capture ALL\nOutputs', type: 'milestone', lane: 've', phase: 5, description: 'Photos, recordings, sticky notes, chat', next: ['s5h'] },
  { id: 's5h', label: 'Send Thank-You\nEmail', type: 'template', lane: 've', phase: 5, templateId: 'post-workshop-thank-you', description: 'Same-day with recap & next steps', next: ['s6a'] },

  // Phase 6: Synthesis
  { id: 's6a', label: 'Transcribe &\nOrganize Notes', type: 'action', lane: 've', phase: 6, next: ['s6b'] },
  { id: 's6b', label: 'Synthesize\nThemes', type: 'template', lane: 've', phase: 6, templateId: 'workshop-notes-prompt', description: 'Copilot prompt: messy notes → structured themes', next: ['s6c'] },
  { id: 's6c', label: 'Score\nCapabilities', type: 'action', lane: 've', phase: 6, description: 'Assessment data + workshop discussion', next: ['s6d'] },
  { id: 's6d', label: 'Generate\nSkeleton Deck', type: 'template', lane: 've', phase: 6, templateId: 'synthesis-deck-prompt', description: 'Copilot prompt: structured synthesis deck', next: ['s6e'] },
  { id: 's6e', label: 'Build Crawl/Walk/Run\nRoadmap', type: 'milestone', lane: 've', phase: 6, description: '0-6mo / 6-12mo / 12-24mo', next: ['s6f'] },
  { id: 's6f', label: 'Internal Review\nw/ Account Team', type: 'handoff', lane: 'sales', phase: 6, description: 'Catch political landmines before delivery', next: ['s7a'] },

  // Phase 7: Deliverable
  { id: 's7a', label: 'Schedule\nReadout', type: 'template', lane: 've', phase: 7, templateId: 'readout-meeting-invite', next: ['s7b'] },
  { id: 's7b', label: 'Present\nSynthesis', type: 'milestone', lane: 've', phase: 7, description: 'Scores, gap analysis, roadmap', next: ['s7c'] },
  { id: 's7c', label: 'Review &\nApprove Direction', type: 'action', lane: 'customer', phase: 7, next: ['s7d'] },
  { id: 's7d', label: 'Share Final\nDeliverable', type: 'action', lane: 've', phase: 7, description: 'PDF + editable deck within 24 hours', next: ['s7e', 's7f'] },
  { id: 's7e', label: 'Commercial\nTransition', type: 'handoff', lane: 'sales', phase: 7, description: 'Connect roadmap to proposals', next: ['end'] },
  { id: 's7f', label: 'Update SFDC &\nLog Lessons', type: 'action', lane: 've-lead', phase: 7, next: ['end'] },

  // END
  { id: 'end', label: 'Engagement\nComplete', type: 'end', lane: 've', phase: 7, next: [] },
];

const lanes = [
  { id: 'sales', label: '🤝 Sales / Account Team', color: '#f59e0b', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.15)' },
  { id: 've-lead', label: '📋 VE Lead', color: '#3b82f6', bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.15)' },
  { id: 've', label: '💡 Value Engineer', color: '#a855f7', bg: 'rgba(168,85,247,0.06)', border: 'rgba(168,85,247,0.15)' },
  { id: 'customer', label: '🏢 Customer', color: '#22c55e', bg: 'rgba(34,197,94,0.06)', border: 'rgba(34,197,94,0.15)' },
  { id: 'logistics', label: '📦 Logistics', color: '#f43f5e', bg: 'rgba(244,63,94,0.06)', border: 'rgba(244,63,94,0.15)' },
];

const phaseColors = ['#3b82f6', '#f97316', '#22c55e', '#06b6d4', '#a855f7', '#f43f5e', '#f59e0b'];

const typeConfig: Record<NodeType, { fill: string; stroke: string; textColor: string; shape: 'rect' | 'diamond' | 'rounded' | 'pill' }> = {
  start: { fill: '#1a1a2e', stroke: '#22c55e', textColor: '#22c55e', shape: 'pill' },
  action: { fill: '#161620', stroke: '#333', textColor: '#ccc', shape: 'rect' },
  template: { fill: '#1a1028', stroke: '#a855f7', textColor: '#d8b4fe', shape: 'rect' },
  decision: { fill: '#1a1810', stroke: '#f59e0b', textColor: '#fbbf24', shape: 'diamond' },
  milestone: { fill: '#101a18', stroke: '#22c55e', textColor: '#86efac', shape: 'rounded' },
  handoff: { fill: '#1a1018', stroke: '#f43f5e', textColor: '#fda4af', shape: 'rounded' },
  end: { fill: '#1a1a2e', stroke: '#f43f5e', textColor: '#f43f5e', shape: 'pill' },
};

/* ═══════════════════════════════════════════════════════════════
   LAYOUT ENGINE — Position nodes in a grid
   ═══════════════════════════════════════════════════════════════ */

const NODE_W = 150;
const NODE_H = 70;
const PHASE_GAP = 180;
const LANE_GAP = 100;
const MARGIN_LEFT = 180;
const MARGIN_TOP = 80;

function layoutNodes() {
  const positions: Record<string, { x: number; y: number }> = {};
  const laneIndex: Record<string, number> = {};
  lanes.forEach((l, i) => { laneIndex[l.id] = i; });

  // Group by phase and lane, track column positions within each phase
  const phaseLaneCounts: Record<string, number> = {};

  // Sort nodes by phase, then by connection order
  const sorted = [...nodes];

  sorted.forEach(node => {
    const li = laneIndex[node.lane] ?? 2;
    const key = `${node.phase}-${node.lane}`;
    const col = phaseLaneCounts[key] || 0;
    phaseLaneCounts[key] = col + 1;

    const x = MARGIN_LEFT + (node.phase - 1) * PHASE_GAP + col * (NODE_W + 20);
    const y = MARGIN_TOP + li * LANE_GAP;

    positions[node.id] = { x, y };
  });

  return positions;
}

/* ═══════════════════════════════════════════════════════════════
   SVG COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={copy} className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-[#888] hover:bg-white/10'}`}>
      {copied ? <Check size={10} /> : <Copy size={10} />} {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function TemplateModal({ template, onClose }: { template: Template; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-[#222]">
          <div>
            <h3 className="text-sm font-bold text-white">{template.title}</h3>
            <p className="text-[10px] text-[#666] mt-0.5">{template.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <CopyButton text={template.content} />
            <button onClick={onClose} className="text-[#555] hover:text-white"><X size={18} /></button>
          </div>
        </div>
        <pre className="text-xs text-[#ccc] whitespace-pre-wrap font-mono leading-relaxed p-4 overflow-y-auto max-h-[60vh]">{template.content}</pre>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function ProcessMapView() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const positions = layoutNodes();

  // Calculate SVG dimensions
  const maxX = Math.max(...Object.values(positions).map(p => p.x)) + NODE_W + 100;
  const maxY = Math.max(...Object.values(positions).map(p => p.y)) + NODE_H + 100;

  const handleNodeClick = (node: FlowNode) => {
    if (node.templateId) {
      const tmpl = templates.find(t => t.id === node.templateId);
      if (tmpl) setSelectedTemplate(tmpl);
    }
  };

  // Get connected nodes for highlighting
  const getConnected = (nodeId: string): Set<string> => {
    const set = new Set<string>();
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      node.next.forEach(id => set.add(id));
      // Also find nodes that connect TO this node
      nodes.forEach(n => {
        if (n.next.includes(nodeId)) set.add(n.id);
      });
    }
    return set;
  };

  const connectedNodes = hoveredNode ? getConnected(hoveredNode) : new Set<string>();

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && e.target === e.currentTarget) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  };
  const handleMouseUp = () => setIsPanning(false);

  // Draw connection line between two positions
  const drawConnection = (fromId: string, toId: string, index: number) => {
    const from = positions[fromId];
    const to = positions[toId];
    if (!from || !to) return null;

    const x1 = from.x + NODE_W / 2;
    const y1 = from.y + NODE_H / 2;
    const x2 = to.x + NODE_W / 2;
    const y2 = to.y + NODE_H / 2;

    // Determine exit/entry points
    const fx = from.x + NODE_W;
    const fy = from.y + NODE_H / 2;
    const tx = to.x;
    const ty = to.y + NODE_H / 2;

    const isHighlighted = hoveredNode === fromId || hoveredNode === toId;
    const isHovered = hoveredNode && !isHighlighted;

    // Bezier curve
    const dx = Math.abs(tx - fx);
    const cp = Math.max(dx * 0.4, 30);
    const path = `M ${fx} ${fy} C ${fx + cp} ${fy}, ${tx - cp} ${ty}, ${tx} ${ty}`;

    return (
      <g key={`${fromId}-${toId}-${index}`}>
        <path
          d={path}
          fill="none"
          stroke={isHighlighted ? '#a855f7' : '#333'}
          strokeWidth={isHighlighted ? 2 : 1}
          opacity={isHovered ? 0.15 : isHighlighted ? 1 : 0.4}
          markerEnd={`url(#arrow${isHighlighted ? '-active' : ''})`}
        />
      </g>
    );
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">🔀 Process Flow Map</h2>
            <p className="text-[10px] text-[#555] mt-0.5">{nodes.length} steps · {nodes.reduce((s, n) => s + n.next.length, 0)} connections · Hover to trace flow · Click purple nodes for templates</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Legend */}
            <div className="flex items-center gap-3 mr-4">
              {Object.entries(typeConfig).filter(([k]) => !['start', 'end'].includes(k)).map(([type, cfg]) => (
                <div key={type} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm" style={{ background: cfg.fill, border: `1px solid ${cfg.stroke}` }} />
                  <span className="text-[9px]" style={{ color: cfg.textColor }}>{type}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setZoom(z => Math.min(z + 0.15, 2))} className="p-1.5 bg-[#1a1a1a] rounded hover:bg-[#222]"><ZoomIn size={14} className="text-[#888]" /></button>
            <button onClick={() => setZoom(z => Math.max(z - 0.15, 0.3))} className="p-1.5 bg-[#1a1a1a] rounded hover:bg-[#222]"><ZoomOut size={14} className="text-[#888]" /></button>
            <button onClick={() => { setZoom(0.85); setPan({ x: 0, y: 0 }); }} className="p-1.5 bg-[#1a1a1a] rounded hover:bg-[#222]"><Maximize2 size={14} className="text-[#888]" /></button>
            <span className="text-[10px] text-[#555] ml-1">{Math.round(zoom * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="bg-[#0a0a0a] border border-[#222] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ height: '70vh' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`${-pan.x / zoom} ${-pan.y / zoom} ${(containerRef.current?.clientWidth || 1200) / zoom} ${(containerRef.current?.clientHeight || 700) / zoom}`}
        >
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#555" />
            </marker>
            <marker id="arrow-active" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
            </marker>
          </defs>

          {/* Lane backgrounds */}
          {lanes.map((lane, i) => (
            <g key={lane.id}>
              <rect
                x={0}
                y={MARGIN_TOP + i * LANE_GAP - LANE_GAP * 0.35}
                width={maxX}
                height={LANE_GAP * 0.7}
                fill={lane.bg}
                rx={8}
              />
              <text x={12} y={MARGIN_TOP + i * LANE_GAP + 5} fill={lane.color} fontSize={11} fontWeight="bold" fontFamily="system-ui">
                {lane.label}
              </text>
            </g>
          ))}

          {/* Phase column headers */}
          {[1, 2, 3, 4, 5, 6, 7].map((p, i) => {
            const labels = ['Lead Intake', 'Discovery', 'Assessment', 'Pre-Workshop', 'Workshop', 'Synthesis', 'Deliverable'];
            const icons = ['🎯', '🔍', '📋', '🧩', '🎪', '🔬', '🏆'];
            return (
              <g key={p}>
                <rect
                  x={MARGIN_LEFT + i * PHASE_GAP - 10}
                  y={10}
                  width={NODE_W + 20}
                  height={30}
                  fill={`${phaseColors[i]}15`}
                  stroke={`${phaseColors[i]}30`}
                  rx={6}
                />
                <text x={MARGIN_LEFT + i * PHASE_GAP + NODE_W / 2} y={30} fill={phaseColors[i]} fontSize={10} fontWeight="bold" textAnchor="middle" fontFamily="system-ui">
                  {icons[i]} Phase {p}: {labels[i]}
                </text>
              </g>
            );
          })}

          {/* Connection lines (draw first, behind nodes) */}
          {nodes.flatMap(node =>
            node.next.map((targetId, i) => drawConnection(node.id, targetId, i))
          )}

          {/* Nodes */}
          {nodes.map(node => {
            const pos = positions[node.id];
            if (!pos) return null;
            const cfg = typeConfig[node.type];
            const isHovered = hoveredNode === node.id;
            const isConnected = connectedNodes.has(node.id);
            const isDimmed = hoveredNode && !isHovered && !isConnected;
            const hasTemplate = node.type === 'template' && node.templateId;

            const w = (node.type as string) === 'diamond' ? NODE_W * 0.85 : NODE_W;
            const h = NODE_H;

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => handleNodeClick(node)}
                style={{ cursor: hasTemplate ? 'pointer' : 'default', opacity: isDimmed ? 0.2 : 1, transition: 'opacity 0.2s' }}
              >
                {/* Node shape */}
                {cfg.shape === 'diamond' ? (
                  <g transform={`translate(${w / 2}, ${h / 2})`}>
                    <rect
                      x={-w * 0.4}
                      y={-h * 0.4}
                      width={w * 0.8}
                      height={h * 0.8}
                      fill={cfg.fill}
                      stroke={isHovered ? '#fff' : cfg.stroke}
                      strokeWidth={isHovered ? 2 : 1}
                      rx={4}
                      transform="rotate(45)"
                    />
                  </g>
                ) : cfg.shape === 'pill' ? (
                  <rect
                    width={w}
                    height={h}
                    fill={cfg.fill}
                    stroke={isHovered ? '#fff' : cfg.stroke}
                    strokeWidth={isHovered ? 2 : 1.5}
                    rx={h / 2}
                  />
                ) : (
                  <rect
                    width={w}
                    height={h}
                    fill={cfg.fill}
                    stroke={isHovered ? '#fff' : cfg.stroke}
                    strokeWidth={isHovered ? 2 : 1}
                    rx={cfg.shape === 'rounded' ? 12 : 6}
                  />
                )}

                {/* Template icon */}
                {hasTemplate && (
                  <g transform={`translate(${w - 16}, 4)`}>
                    <rect width={12} height={12} rx={2} fill="#a855f7" opacity={0.3} />
                    <text x={6} y={10} fill="#d8b4fe" fontSize={8} textAnchor="middle" fontFamily="system-ui">📄</text>
                  </g>
                )}

                {/* Label */}
                {node.label.split('\n').map((line, i, arr) => (
                  <text
                    key={i}
                    x={w / 2}
                    y={h / 2 + (i - (arr.length - 1) / 2) * 13}
                    fill={isHovered ? '#fff' : cfg.textColor}
                    fontSize={10}
                    fontWeight={isHovered ? 'bold' : 'normal'}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="system-ui"
                  >
                    {line}
                  </text>
                ))}

                {/* Connection count badge */}
                {node.next.length > 1 && (
                  <g transform={`translate(${w - 4}, ${h - 4})`}>
                    <circle r={8} fill="#222" stroke="#555" strokeWidth={1} />
                    <text x={0} y={1} fill="#888" fontSize={8} textAnchor="middle" dominantBaseline="middle" fontFamily="system-ui">
                      {node.next.length}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tooltip for hovered node */}
      {hoveredNode && (() => {
        const node = nodes.find(n => n.id === hoveredNode);
        if (!node || !node.description) return null;
        return (
          <div className="bg-[#111] border border-[#333] rounded-lg p-3 mt-2">
            <div className="text-xs font-semibold text-white">{node.label.replace('\n', ' ')}</div>
            <div className="text-[10px] text-[#888] mt-1">{node.description}</div>
            <div className="text-[9px] text-[#555] mt-1">
              → Connects to: {node.next.length > 0 ? node.next.map(id => nodes.find(n => n.id === id)?.label.replace('\n', ' ')).join(' · ') : 'None (end)'}
            </div>
          </div>
        );
      })()}

      {/* Template Modal */}
      {selectedTemplate && <TemplateModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />}
    </div>
  );
}
