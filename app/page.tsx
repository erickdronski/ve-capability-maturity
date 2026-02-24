'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Copy, Check, Download, Clock, Users, Wrench, FileText, CheckSquare, Lightbulb, Package, ArrowRight } from 'lucide-react';
import { phases, onsiteMaterials, templates, getTemplatesForPhase } from './data';
import type { Phase, Template } from './data';

/* ── Copy Button ── */
function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
        copied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-[#888] hover:bg-white/10 hover:text-white'
      }`}>
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : (label || 'Copy')}
    </button>
  );
}

/* ── Timeline Node ── */
function TimelineNode({ phase, isActive, isLast, onClick }: { phase: Phase; isActive: boolean; isLast: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center group relative">
      {/* Node */}
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 border-2 ${
        isActive
          ? `${phase.bgColor} ${phase.borderColor} scale-110 shadow-lg`
          : 'bg-[#111] border-[#222] group-hover:border-[#333] group-hover:scale-105'
      }`}>
        {phase.icon}
      </div>
      {/* Label */}
      <div className={`mt-2 text-center transition-colors ${isActive ? 'text-white' : 'text-[#555] group-hover:text-[#888]'}`}>
        <div className="text-[10px] font-bold">{phase.title}</div>
        <div className="text-[9px] text-[#444]">{phase.duration}</div>
      </div>
      {/* Connector line */}
      {!isLast && (
        <div className="absolute top-7 left-[calc(100%)] w-[calc(100%-8px)] h-0.5 bg-[#222] -translate-y-1/2 hidden md:block" style={{ left: '58px', width: '60px' }} />
      )}
    </button>
  );
}

/* ── Template Card ── */
function TemplateCard({ template }: { template: Template }) {
  const [open, setOpen] = useState(false);
  const typeColors: Record<string, string> = {
    email: 'bg-blue-500/15 text-blue-400',
    prompt: 'bg-purple-500/15 text-purple-400',
    checklist: 'bg-green-500/15 text-green-400',
    document: 'bg-amber-500/15 text-amber-400',
    script: 'bg-rose-500/15 text-rose-400',
  };
  const typeIcons: Record<string, string> = {
    email: '📧',
    prompt: '🤖',
    checklist: '✅',
    document: '📄',
    script: '⚡',
  };

  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-3 text-left hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-3">
          <span className="text-lg">{typeIcons[template.type]}</span>
          <div>
            <div className="text-sm font-medium text-white">{template.title}</div>
            <div className="text-[10px] text-[#666]">{template.description}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${typeColors[template.type]}`}>
            {template.type}
          </span>
          {open ? <ChevronDown size={14} className="text-[#555]" /> : <ChevronRight size={14} className="text-[#555]" />}
        </div>
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-[#1a1a1a]">
          <div className="flex justify-end pt-2 mb-2">
            <CopyButton text={template.content} label="Copy Template" />
          </div>
          <pre className="text-xs text-[#ccc] whitespace-pre-wrap font-mono leading-relaxed bg-[#080808] border border-[#1a1a1a] rounded-lg p-4 max-h-96 overflow-y-auto">
            {template.content}
          </pre>
        </div>
      )}
    </div>
  );
}

/* ── Phase Detail Panel ── */
function PhaseDetail({ phase }: { phase: Phase }) {
  const phaseTemplates = getTemplatesForPhase(phase.id);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Phase Header */}
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl ${phase.bgColor} flex items-center justify-center text-3xl`}>
          {phase.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">{phase.title}</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full ${phase.bgColor} ${phase.color}`}>Phase {phase.number}</span>
          </div>
          <p className="text-sm text-[#666] mt-0.5">{phase.subtitle}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 text-xs text-[#555]">
            <Clock size={12} /> {phase.duration}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#555] mt-1">
            <Users size={12} /> {phase.owner}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-5">
        <p className="text-sm text-[#999] leading-relaxed">{phase.description}</p>
      </div>

      {/* Key Activities + Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Key Activities */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-5">
          <h3 className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Wrench size={12} className={phase.color} /> Key Activities
          </h3>
          <div className="space-y-2">
            {phase.keyActivities.map((a, i) => (
              <div key={i} className="text-xs text-[#888] flex items-start gap-2">
                <span className={`${phase.color} opacity-50 mt-0.5 font-mono text-[10px]`}>{String(i + 1).padStart(2, '0')}</span>
                {a}
              </div>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-5">
          <h3 className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <CheckSquare size={12} className={phase.color} /> Checklist
          </h3>
          <div className="space-y-2">
            {phase.checklist.map((c, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-4 h-4 mt-0.5 rounded border border-[#333] flex-shrink-0" />
                <div>
                  <div className="text-xs text-[#888]">{c.label}</div>
                  {c.description && <div className="text-[10px] text-[#555] mt-0.5">{c.description}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className={`bg-[#111] border ${phase.borderColor} rounded-xl p-5`}>
        <h3 className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Lightbulb size={12} className="text-yellow-400" /> Pro Tips
        </h3>
        <div className="space-y-2">
          {phase.tips.map((t, i) => (
            <div key={i} className="text-xs text-[#999] flex items-start gap-2">
              <span className="text-yellow-400/50 mt-0.5">💡</span> {t}
            </div>
          ))}
        </div>
      </div>

      {/* Deliverables + Tools */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#111] border border-[#222] rounded-xl p-4">
          <h3 className="text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-2">📦 Deliverables</h3>
          <div className="flex flex-wrap gap-1.5">
            {phase.deliverables.map((d, i) => (
              <span key={i} className="text-[10px] bg-white/5 text-[#888] px-2 py-1 rounded">{d}</span>
            ))}
          </div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-xl p-4">
          <h3 className="text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-2">🔧 Tools</h3>
          <div className="flex flex-wrap gap-1.5">
            {phase.tools.map((t, i) => (
              <span key={i} className="text-[10px] bg-white/5 text-[#888] px-2 py-1 rounded">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Onsite Materials (only for pre-workshop-prep) */}
      {phase.id === 'pre-workshop-prep' && (
        <div className="bg-[#111] border border-amber-500/20 rounded-xl p-5">
          <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Package size={12} /> Onsite Workshop Materials List
          </h3>
          <div className="overflow-x-auto">
            <div className="space-y-1">
              <div className="grid grid-cols-12 gap-2 text-[10px] font-semibold text-[#555] uppercase pb-2 border-b border-[#222]">
                <div className="col-span-4">Item</div>
                <div className="col-span-3">Quantity</div>
                <div className="col-span-5">Notes</div>
              </div>
              {onsiteMaterials.map((m, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 text-xs text-[#888] py-1.5 border-b border-[#111]">
                  <div className="col-span-4 text-white/80">{m.item}</div>
                  <div className="col-span-3">{m.quantity}</div>
                  <div className="col-span-5 text-[#666]">{m.notes}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Templates for this phase */}
      {phaseTemplates.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <FileText size={12} className={phase.color} /> Templates & Prompts for This Phase
          </h3>
          <div className="space-y-2">
            {phaseTemplates.map(t => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Page ── */
export default function CapabilityMaturityPlaybook() {
  const [activePhase, setActivePhase] = useState(phases[0].id);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const currentPhase = phases.find(p => p.id === activePhase)!;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-[#222] bg-[#0a0a0a] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Capability & Maturity Workshop Playbook</h1>
              <p className="text-sm text-[#555] mt-0.5">End-to-end process guide — from lead intake to deliverable</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTemplateLibrary(!showTemplateLibrary)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  showTemplateLibrary
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#111] border border-[#222] text-[#888] hover:text-white hover:border-[#333]'
                }`}
              >
                <FileText size={16} />
                Template Library
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {showTemplateLibrary ? (
          /* ── Template Library View ── */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">📚 Template & Prompt Library</h2>
                <p className="text-sm text-[#666] mt-1">All templates, email drafts, and Copilot prompts in one place. Copy and customize.</p>
              </div>
              <div className="text-xs text-[#555]">{templates.length} templates</div>
            </div>

            {/* Group by type */}
            {(['email', 'prompt', 'checklist', 'document'] as const).map(type => {
              const typeTemplates = templates.filter(t => t.type === type);
              if (typeTemplates.length === 0) return null;
              const typeLabels: Record<string, string> = { email: '📧 Email Templates', prompt: '🤖 Copilot Prompts', checklist: '✅ Checklists', document: '📄 Documents' };
              return (
                <div key={type}>
                  <h3 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-3">{typeLabels[type]}</h3>
                  <div className="space-y-2">
                    {typeTemplates.map(t => (
                      <TemplateCard key={t.id} template={t} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── Journey View ── */
          <div className="space-y-8">
            {/* Visual Timeline */}
            <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
              <div className="text-center mb-6">
                <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider">Customer Journey Timeline</h2>
                <p className="text-xs text-[#444] mt-1">Click any phase to view details, checklists, and templates</p>
              </div>
              <div className="flex items-start justify-between gap-2 overflow-x-auto pb-2">
                {phases.map((phase, i) => (
                  <div key={phase.id} className="flex items-center">
                    <TimelineNode
                      phase={phase}
                      isActive={activePhase === phase.id}
                      isLast={i === phases.length - 1}
                      onClick={() => setActivePhase(phase.id)}
                    />
                    {i < phases.length - 1 && (
                      <div className="hidden md:flex items-center mx-1 mt-[-20px]">
                        <div className={`w-8 h-0.5 ${
                          phases.findIndex(p => p.id === activePhase) > i ? 'bg-purple-500/50' : 'bg-[#222]'
                        } transition-colors`} />
                        <ArrowRight size={12} className={`${
                          phases.findIndex(p => p.id === activePhase) > i ? 'text-purple-500/50' : 'text-[#222]'
                        } transition-colors -ml-1`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Phase Summary Cards (mini) */}
            <div className="grid grid-cols-7 gap-2">
              {phases.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(phase.id)}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    activePhase === phase.id
                      ? `${phase.bgColor} ${phase.borderColor}`
                      : 'bg-[#111] border-[#1a1a1a] hover:border-[#333]'
                  }`}
                >
                  <div className="text-lg">{phase.icon}</div>
                  <div className={`text-[9px] font-semibold mt-1 ${activePhase === phase.id ? phase.color : 'text-[#555]'}`}>
                    {phase.title.split(' ').slice(0, 2).join(' ')}
                  </div>
                </button>
              ))}
            </div>

            {/* Active Phase Detail */}
            <PhaseDetail phase={currentPhase} />
          </div>
        )}
      </div>
    </div>
  );
}
