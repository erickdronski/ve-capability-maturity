'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Check, FileText, X } from 'lucide-react';
import { templates } from './data';
import type { Template } from './data';

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */

type StepType = 'action' | 'template' | 'decision' | 'milestone' | 'handoff';

type Step = {
  id: string;
  label: string;
  lane: string;
  phase: number;
  type: StepType;
  templateId?: string;
  description?: string;
  connectedTo?: string[];
};

type Lane = {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
};

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

const lanes: Lane[] = [
  { id: 'sales', label: '🤝 Sales / Account Team', color: 'text-amber-400', bgColor: 'bg-amber-500/5', borderColor: 'border-amber-500/15' },
  { id: 've-lead', label: '📋 VE Lead', color: 'text-blue-400', bgColor: 'bg-blue-500/5', borderColor: 'border-blue-500/15' },
  { id: 've', label: '💡 Value Engineer', color: 'text-purple-400', bgColor: 'bg-purple-500/5', borderColor: 'border-purple-500/15' },
  { id: 'customer', label: '🏢 Customer / Participants', color: 'text-green-400', bgColor: 'bg-green-500/5', borderColor: 'border-green-500/15' },
  { id: 'logistics', label: '📦 Logistics / Ops', color: 'text-rose-400', bgColor: 'bg-rose-500/5', borderColor: 'border-rose-500/15' },
];

const phaseHeaders = [
  { num: 1, label: 'Lead Intake', icon: '🎯', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { num: 2, label: 'Discovery', icon: '🔍', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { num: 3, label: 'Assessment', icon: '📋', color: 'text-green-400', bg: 'bg-green-500/10' },
  { num: 4, label: 'Pre-Workshop', icon: '🧩', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { num: 5, label: 'Workshop', icon: '🎪', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { num: 6, label: 'Synthesis', icon: '🔬', color: 'text-rose-400', bg: 'bg-rose-500/10' },
  { num: 7, label: 'Deliverable', icon: '🏆', color: 'text-amber-400', bg: 'bg-amber-500/10' },
];

const steps: Step[] = [
  // Phase 1: Lead Intake
  { id: 's1', label: 'Lead received', lane: 'sales', phase: 1, type: 'action', description: 'Marketing qualified, sales qualified, partner referral, or self-service lead enters pipeline', connectedTo: ['s2'] },
  { id: 's2', label: 'Qualify & pitch C&M', lane: 'sales', phase: 1, type: 'action', description: 'Sales rep confirms fit for Capability & Maturity engagement', connectedTo: ['s3'] },
  { id: 's3', label: 'Route to VE team', lane: 'sales', phase: 1, type: 'handoff', description: 'Hand off qualified lead to Value Engineering', connectedTo: ['s4'] },
  { id: 's4', label: 'Assign VE owner', lane: 've-lead', phase: 1, type: 'action', description: 'VE Lead assigns owner and logs in Salesforce', connectedTo: ['s5'] },
  { id: 's5', label: 'Log in Salesforce', lane: 've-lead', phase: 1, type: 'action', description: 'Create C&M opportunity type in Salesforce', connectedTo: ['s6'] },

  // Phase 2: Discovery
  { id: 's6', label: 'Schedule discovery call', lane: 've', phase: 2, type: 'action', description: 'Schedule within 48 hours of lead assignment', connectedTo: ['s7'] },
  { id: 's7', label: 'Run discovery call', lane: 've', phase: 2, type: 'action', description: 'Understand pain points, strategic objectives, org structure', connectedTo: ['s8', 's9'] },
  { id: 's8', label: 'Decide workshop format', lane: 've', phase: 2, type: 'decision', description: 'Virtual (Teams/Zoom), Onsite, or Hybrid?', connectedTo: ['s10'] },
  { id: 's9', label: 'Confirm participants', lane: 'customer', phase: 2, type: 'action', description: 'Customer champion confirms 5-12 participants with names, titles, emails', connectedTo: ['s10'] },
  { id: 's10', label: 'Send engagement email', lane: 've', phase: 2, type: 'template', templateId: 'initial-outreach-email', description: 'Formal engagement email with agenda, logistics, and participant list', connectedTo: ['s11'] },

  // Phase 3: Assessment
  { id: 's11', label: 'Access facilitator portal', lane: 've', phase: 3, type: 'action', description: 'Log into online assessment facilitator portal', connectedTo: ['s12'] },
  { id: 's12', label: 'Create assessment instance', lane: 've', phase: 3, type: 'action', description: 'Configure capability domains, participant access, deadline', connectedTo: ['s13'] },
  { id: 's13', label: 'Generate customer URL', lane: 've', phase: 3, type: 'milestone', description: 'Unique assessment link generated for distribution', connectedTo: ['s14'] },
  { id: 's14', label: 'Send assessment invite', lane: 've', phase: 3, type: 'template', templateId: 'assessment-invitation-email', description: 'Email all participants with assessment link and deadline', connectedTo: ['s15', 's16'] },
  { id: 's15', label: 'Complete assessment', lane: 'customer', phase: 3, type: 'action', description: 'Each participant completes 15-20 min online assessment', connectedTo: ['s18'] },
  { id: 's16', label: 'Send reminders', lane: 've', phase: 3, type: 'template', templateId: 'assessment-reminder-email', description: 'Nudge at Day 3 and Day 5 if not complete. Target 80%+ response rate', connectedTo: ['s15'] },

  // Phase 4: Pre-Workshop
  { id: 's18', label: 'Download responses', lane: 've', phase: 4, type: 'action', description: 'Download and review all participant assessment responses', connectedTo: ['s19'] },
  { id: 's19', label: 'Build stakeholder canvas', lane: 've', phase: 4, type: 'milestone', description: 'Multi-stakeholder canvas board in Lucidchart/Miro showing alignment and divergence', connectedTo: ['s20', 's22'] },
  { id: 's20', label: 'Prep facilitation deck', lane: 've', phase: 4, type: 'action', description: 'Workshop deck, breakout exercises, discussion prompts', connectedTo: ['s24'] },
  { id: 's21', label: 'Onsite workshop?', lane: 'logistics', phase: 4, type: 'decision', description: 'If onsite or hybrid, trigger logistics workflow', connectedTo: ['s22', 's23'] },
  { id: 's22', label: 'Order FedEx supplies', lane: 'logistics', phase: 4, type: 'template', templateId: 'fedex-shipping-checklist', description: 'Ship Capability Cards, easel pads, sticky notes, markers, etc. 5+ business days out', connectedTo: ['s24'] },
  { id: 's23', label: 'Confirm venue & AV', lane: 'logistics', phase: 4, type: 'action', description: 'Venue, AV equipment, catering, room setup confirmed', connectedTo: ['s24'] },
  { id: 's24', label: 'Brief account team', lane: 'sales', phase: 4, type: 'handoff', description: 'Share pre-workshop findings and themes with sales rep', connectedTo: ['s25'] },

  // Phase 5: Workshop
  { id: 's25', label: 'Welcome & ground rules', lane: 've', phase: 5, type: 'action', description: 'Open session, set expectations, introduce agenda', connectedTo: ['s26'] },
  { id: 's26', label: 'Present canvas results', lane: 've', phase: 5, type: 'milestone', description: 'Show where stakeholder perspectives align and diverge', connectedTo: ['s27'] },
  { id: 's27', label: 'Domain-by-domain review', lane: 've', phase: 5, type: 'action', description: 'Facilitate capability discussion per domain', connectedTo: ['s28'] },
  { id: 's28', label: 'Breakout exercises', lane: 've', phase: 5, type: 'action', description: 'Small group exercises on priority areas', connectedTo: ['s29'] },
  { id: 's29', label: 'Participate & provide input', lane: 'customer', phase: 5, type: 'action', description: 'Stakeholders contribute perspectives, vote on priorities, co-create direction', connectedTo: ['s30'] },
  { id: 's30', label: 'Priority voting', lane: 've', phase: 5, type: 'action', description: 'Dot voting on top 3-5 priority areas', connectedTo: ['s31'] },
  { id: 's31', label: 'Capture all outputs', lane: 've', phase: 5, type: 'milestone', description: 'Photos of sticky notes, whiteboard, recording, chat — CAPTURE EVERYTHING', connectedTo: ['s32'] },
  { id: 's32', label: 'Send thank-you email', lane: 've', phase: 5, type: 'template', templateId: 'post-workshop-thank-you', description: 'Same-day email with recap and next steps', connectedTo: ['s33'] },

  // Phase 6: Synthesis
  { id: 's33', label: 'Transcribe & organize notes', lane: 've', phase: 6, type: 'action', description: 'Transcribe recordings, organize sticky notes, consolidate all inputs', connectedTo: ['s34'] },
  { id: 's34', label: 'Synthesize themes', lane: 've', phase: 6, type: 'template', templateId: 'workshop-notes-prompt', description: 'Use Copilot prompt to synthesize messy notes into structured themes', connectedTo: ['s35'] },
  { id: 's35', label: 'Score capabilities', lane: 've', phase: 6, type: 'action', description: 'Score each domain based on assessment data + workshop discussion', connectedTo: ['s36'] },
  { id: 's36', label: 'Generate skeleton deck', lane: 've', phase: 6, type: 'template', templateId: 'synthesis-deck-prompt', description: 'Use Copilot prompt to generate synthesis deck structure', connectedTo: ['s37'] },
  { id: 's37', label: 'Build Crawl/Walk/Run roadmap', lane: 've', phase: 6, type: 'milestone', description: 'Phased roadmap: 0-6mo / 6-12mo / 12-24mo with initiatives and success metrics', connectedTo: ['s38'] },
  { id: 's38', label: 'Internal review', lane: 'sales', phase: 6, type: 'action', description: 'Account team reviews deck before customer delivery — catch political landmines', connectedTo: ['s39'] },

  // Phase 7: Deliverable
  { id: 's39', label: 'Schedule readout', lane: 've', phase: 7, type: 'template', templateId: 'readout-meeting-invite', description: 'Book 60-90 min with all stakeholders + executive sponsors', connectedTo: ['s40'] },
  { id: 's40', label: 'Present synthesis', lane: 've', phase: 7, type: 'milestone', description: 'Walk through capability scores, gap analysis, and roadmap', connectedTo: ['s41'] },
  { id: 's41', label: 'Review & approve direction', lane: 'customer', phase: 7, type: 'action', description: 'Executive sponsors review roadmap and agree on priorities', connectedTo: ['s42'] },
  { id: 's42', label: 'Share deliverable', lane: 've', phase: 7, type: 'action', description: 'Send final PDF + editable deck + follow-up email within 24 hours', connectedTo: ['s43'] },
  { id: 's43', label: 'Commercial transition', lane: 'sales', phase: 7, type: 'handoff', description: 'Connect roadmap phases to Ivanti solutions and commercial proposals', connectedTo: ['s44'] },
  { id: 's44', label: 'Update Salesforce', lane: 've-lead', phase: 7, type: 'action', description: 'Log outcomes, capture NPS, document lessons learned' },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

const typeStyles: Record<StepType, { bg: string; border: string; icon: string }> = {
  action: { bg: 'bg-[#161616]', border: 'border-[#2a2a2a]', icon: '▸' },
  template: { bg: 'bg-purple-500/8', border: 'border-purple-500/25', icon: '📄' },
  decision: { bg: 'bg-amber-500/8', border: 'border-amber-500/25', icon: '◆' },
  milestone: { bg: 'bg-green-500/8', border: 'border-green-500/25', icon: '★' },
  handoff: { bg: 'bg-rose-500/8', border: 'border-rose-500/25', icon: '→' },
};

const typeLabels: Record<StepType, { label: string; color: string }> = {
  action: { label: 'Step', color: 'text-[#666]' },
  template: { label: 'Template', color: 'text-purple-400' },
  decision: { label: 'Decision', color: 'text-amber-400' },
  milestone: { label: 'Milestone', color: 'text-green-400' },
  handoff: { label: 'Handoff', color: 'text-rose-400' },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={copy} className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-[#888] hover:bg-white/10'}`}>
      {copied ? <Check size={10} /> : <Copy size={10} />} {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function TemplateModal({ template, onClose }: { template: Template; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
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

function StepTile({ step, onClick }: { step: Step; onClick?: () => void }) {
  const style = typeStyles[step.type];
  const label = typeLabels[step.type];
  const hasTemplate = step.type === 'template' && step.templateId;
  const hasConnections = step.connectedTo && step.connectedTo.length > 0;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border-2 ${style.bg} ${style.border} transition-all hover:scale-[1.02] hover:brightness-110 ${hasTemplate ? 'cursor-pointer ring-1 ring-purple-500/10' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs">{style.icon}</span>
            <span className={`text-[9px] font-bold uppercase tracking-wider ${label.color}`}>{label.label}</span>
            {hasTemplate && <FileText size={10} className="text-purple-400" />}
          </div>
          <div className="text-xs font-semibold text-white leading-tight">{step.label}</div>
          {step.description && (
            <div className="text-[10px] text-[#666] mt-1 leading-relaxed line-clamp-2">{step.description}</div>
          )}
        </div>
        {hasConnections && (
          <div className="text-[#333] mt-1 flex-shrink-0">
            <ChevronRight size={12} />
          </div>
        )}
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PROCESS MAP
   ═══════════════════════════════════════════════════════════════ */

export default function ProcessMapView() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  const handleStepClick = (step: Step) => {
    if (step.templateId) {
      const tmpl = templates.find(t => t.id === step.templateId);
      if (tmpl) setSelectedTemplate(tmpl);
    }
  };

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white">Process Map — Capability & Maturity Framework</h2>
          <div className="text-[10px] text-[#555]">{steps.length} steps across {phaseHeaders.length} phases</div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {Object.entries(typeStyles).map(([type, style]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded ${style.bg} border ${style.border}`} />
              <span className={`text-[10px] ${typeLabels[type as StepType].color}`}>{typeLabels[type as StepType].label}</span>
            </div>
          ))}
          <div className="text-[#333]">|</div>
          <div className="text-[10px] text-[#555]">💡 Click purple tiles to view templates</div>
        </div>
      </div>

      {/* Swim Lane Diagram */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[1400px]">
          {/* Phase Headers */}
          <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: '160px repeat(7, 1fr)' }}>
            <div className="p-2 text-[10px] text-[#444] font-semibold uppercase tracking-wider flex items-center">Roles ↓ / Phases →</div>
            {phaseHeaders.map(ph => (
              <div key={ph.num} className={`p-2 rounded-lg ${ph.bg} text-center`}>
                <div className="text-base mb-0.5">{ph.icon}</div>
                <div className={`text-[10px] font-bold ${ph.color}`}>Phase {ph.num}</div>
                <div className="text-[9px] text-[#666]">{ph.label}</div>
              </div>
            ))}
          </div>

          {/* Lanes */}
          {lanes.map((lane) => {
            return (
              <div
                key={lane.id}
                className={`grid gap-1 mb-1 ${lane.bgColor} rounded-lg border ${lane.borderColor}`}
                style={{ gridTemplateColumns: '160px repeat(7, 1fr)' }}
              >
                {/* Lane Label */}
                <div className="p-3 flex items-center">
                  <div>
                    <div className={`text-xs font-bold ${lane.color}`}>{lane.label}</div>
                  </div>
                </div>

                {/* Phase Cells */}
                {phaseHeaders.map(ph => {
                  const cellSteps = steps.filter(s => s.lane === lane.id && s.phase === ph.num);
                  return (
                    <div key={ph.num} className="p-2 min-h-[80px] flex flex-col gap-1.5">
                      {cellSteps.map(step => (
                        <StepTile
                          key={step.id}
                          step={step}
                          onClick={() => handleStepClick(step)}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Flow Summary */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-5">
        <h3 className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-3">📊 Process Flow Summary</h3>
        <div className="grid grid-cols-7 gap-3">
          {phaseHeaders.map(ph => {
            const phaseSteps = steps.filter(s => s.phase === ph.num);
            const templateCount = phaseSteps.filter(s => s.type === 'template').length;
            const decisionCount = phaseSteps.filter(s => s.type === 'decision').length;
            const milestoneCount = phaseSteps.filter(s => s.type === 'milestone').length;
            return (
              <div key={ph.num} className="text-center">
                <div className="text-base mb-1">{ph.icon}</div>
                <div className={`text-xs font-bold ${ph.color}`}>{ph.label}</div>
                <div className="text-[10px] text-[#555] mt-1">{phaseSteps.length} steps</div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  {templateCount > 0 && <span className="text-[9px] text-purple-400">{templateCount} 📄</span>}
                  {decisionCount > 0 && <span className="text-[9px] text-amber-400">{decisionCount} ◆</span>}
                  {milestoneCount > 0 && <span className="text-[9px] text-green-400">{milestoneCount} ★</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connection Map */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-5">
        <h3 className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-3">🔗 Key Handoffs & Connections</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {steps.filter(s => s.type === 'handoff').map(step => {
            const targets = step.connectedTo?.map(id => steps.find(s => s.id === id)).filter(Boolean) || [];
            return (
              <div key={step.id} className="bg-rose-500/5 border border-rose-500/15 rounded-lg p-3">
                <div className="text-xs font-semibold text-rose-400 mb-1">→ {step.label}</div>
                <div className="text-[10px] text-[#888]">{step.description}</div>
                {targets.length > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-[#555]">
                    Leads to: {targets.map((t, i) => (
                      <span key={i} className="text-white/70 bg-white/5 px-1.5 py-0.5 rounded">{t!.label}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Template Modal */}
      {selectedTemplate && (
        <TemplateModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />
      )}
    </div>
  );
}
