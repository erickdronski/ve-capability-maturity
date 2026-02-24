'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronRight, Copy, Check, Clock, Users, Wrench, FileText, CheckSquare, Lightbulb, Package, ArrowRight } from 'lucide-react';
import { phases, onsiteMaterials, templates, getTemplatesForPhase } from '../data';
import type { Phase, Template } from '../data';

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={copy} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-[#888] hover:bg-white/10 hover:text-white'}`}>
      {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied!' : (label || 'Copy')}
    </button>
  );
}

function TemplateCard({ template }: { template: Template }) {
  const [open, setOpen] = useState(false);
  const typeColors: Record<string, string> = { email: 'bg-blue-500/15 text-blue-400', prompt: 'bg-purple-500/15 text-purple-400', checklist: 'bg-green-500/15 text-green-400', document: 'bg-amber-500/15 text-amber-400' };
  const typeIcons: Record<string, string> = { email: '📧', prompt: '🤖', checklist: '✅', document: '📄' };
  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-3 text-left hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-3">
          <span className="text-lg">{typeIcons[template.type] || '📄'}</span>
          <div><div className="text-sm font-medium text-white">{template.title}</div><div className="text-[10px] text-[#666]">{template.description}</div></div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${typeColors[template.type] || 'bg-white/5 text-[#666]'}`}>{template.type}</span>
          {open ? <ChevronDown size={14} className="text-[#555]" /> : <ChevronRight size={14} className="text-[#555]" />}
        </div>
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-[#1a1a1a]">
          <div className="flex justify-end pt-2 mb-2"><CopyButton text={template.content} label="Copy Template" /></div>
          <pre className="text-xs text-[#ccc] whitespace-pre-wrap font-mono leading-relaxed bg-[#080808] border border-[#1a1a1a] rounded-lg p-4 max-h-96 overflow-y-auto">{template.content}</pre>
        </div>
      )}
    </div>
  );
}

export default function PlaybookPage() {
  const [activePhase, setActivePhase] = useState(phases[0].id);
  const [view, setView] = useState<'journey' | 'templates'>('journey');
  const currentPhase = phases.find(p => p.id === activePhase)!;
  const phaseTemplates = getTemplatesForPhase(activePhase);

  return (
    <div className="min-h-screen">
      <div className="border-b border-[#222] bg-[#0a0a0a] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-[#555] hover:text-white transition-colors"><ArrowLeft size={18} /></Link>
              <div>
                <h1 className="text-lg font-bold text-white">Playbook & Templates</h1>
                <p className="text-sm text-[#555]">Reference guide for the C&M workshop process</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setView('journey')} className={`px-3 py-1.5 text-xs rounded-lg ${view === 'journey' ? 'bg-purple-500/15 text-purple-400' : 'text-[#555] hover:text-white'}`}>Journey View</button>
              <button onClick={() => setView('templates')} className={`px-3 py-1.5 text-xs rounded-lg ${view === 'templates' ? 'bg-purple-500/15 text-purple-400' : 'text-[#555] hover:text-white'}`}>Template Library</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {view === 'templates' ? (
          <div className="space-y-6">
            {(['email', 'prompt', 'checklist'] as const).map(type => {
              const t = templates.filter(t => t.type === type);
              if (!t.length) return null;
              const labels: Record<string, string> = { email: '📧 Email Templates', prompt: '🤖 Copilot Prompts', checklist: '✅ Checklists' };
              return (<div key={type}><h3 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-3">{labels[type]}</h3><div className="space-y-2">{t.map(t => <TemplateCard key={t.id} template={t} />)}</div></div>);
            })}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Timeline */}
            <div className="flex items-center justify-between gap-1">
              {phases.map((phase, i) => (
                <div key={phase.id} className="flex items-center flex-1">
                  <button onClick={() => setActivePhase(phase.id)} className={`flex-1 p-3 rounded-xl border text-center transition-all ${activePhase === phase.id ? `${phase.bgColor} ${phase.borderColor}` : 'bg-[#111] border-[#1a1a1a] hover:border-[#333]'}`}>
                    <div className="text-xl mb-1">{phase.icon}</div>
                    <div className={`text-[9px] font-semibold ${activePhase === phase.id ? phase.color : 'text-[#555]'}`}>{phase.title.split(' ').slice(0, 2).join(' ')}</div>
                  </button>
                  {i < phases.length - 1 && <ArrowRight size={10} className="mx-0.5 text-[#222] flex-shrink-0" />}
                </div>
              ))}
            </div>

            {/* Phase Detail */}
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl ${currentPhase.bgColor} flex items-center justify-center text-3xl`}>{currentPhase.icon}</div>
              <div>
                <h2 className="text-xl font-bold text-white">{currentPhase.title}</h2>
                <p className="text-sm text-[#666]">{currentPhase.subtitle}</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-xs text-[#555]"><Clock size={12} /> {currentPhase.duration}</div>
            </div>

            <div className="bg-[#111] border border-[#222] rounded-xl p-5"><p className="text-sm text-[#999] leading-relaxed">{currentPhase.description}</p></div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#111] border border-[#222] rounded-xl p-5">
                <h3 className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-3 flex items-center gap-1.5"><Wrench size={12} className={currentPhase.color} /> Key Activities</h3>
                <div className="space-y-2">{currentPhase.keyActivities.map((a, i) => (<div key={i} className="text-xs text-[#888] flex items-start gap-2"><span className={`${currentPhase.color} opacity-50 mt-0.5 font-mono text-[10px]`}>{String(i+1).padStart(2,'0')}</span>{a}</div>))}</div>
              </div>
              <div className="bg-[#111] border border-[#222] rounded-xl p-5">
                <h3 className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-3 flex items-center gap-1.5"><CheckSquare size={12} className={currentPhase.color} /> Checklist</h3>
                <div className="space-y-2">{currentPhase.checklist.map((c, i) => (<div key={i} className="flex items-start gap-2"><div className="w-4 h-4 mt-0.5 rounded border border-[#333] flex-shrink-0" /><div><div className="text-xs text-[#888]">{c.label}</div>{c.description && <div className="text-[10px] text-[#555] mt-0.5">{c.description}</div>}</div></div>))}</div>
              </div>
            </div>

            <div className={`bg-[#111] border ${currentPhase.borderColor} rounded-xl p-5`}>
              <h3 className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-3 flex items-center gap-1.5"><Lightbulb size={12} className="text-yellow-400" /> Pro Tips</h3>
              <div className="space-y-2">{currentPhase.tips.map((t, i) => (<div key={i} className="text-xs text-[#999] flex items-start gap-2"><span className="text-yellow-400/50 mt-0.5">💡</span> {t}</div>))}</div>
            </div>

            {activePhase === 'pre-workshop-prep' && (
              <div className="bg-[#111] border border-amber-500/20 rounded-xl p-5">
                <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Package size={12} /> Onsite Materials</h3>
                <div className="space-y-1">
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-semibold text-[#555] uppercase pb-2 border-b border-[#222]"><div className="col-span-4">Item</div><div className="col-span-3">Qty</div><div className="col-span-5">Notes</div></div>
                  {onsiteMaterials.map((m, i) => (<div key={i} className="grid grid-cols-12 gap-2 text-xs text-[#888] py-1.5 border-b border-[#111]"><div className="col-span-4 text-white/80">{m.item}</div><div className="col-span-3">{m.quantity}</div><div className="col-span-5 text-[#666]">{m.notes}</div></div>))}
                </div>
              </div>
            )}

            {phaseTemplates.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-3 flex items-center gap-1.5"><FileText size={12} className={currentPhase.color} /> Templates</h3>
                <div className="space-y-2">{phaseTemplates.map(t => <TemplateCard key={t.id} template={t} />)}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
