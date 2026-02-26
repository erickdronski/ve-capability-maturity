'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Users, ChevronRight, ChevronDown, FileText, X, ArrowRight, BarChart3, Copy, Check, Clock, Wrench, CheckSquare, Lightbulb, Package, MessageSquare, Trash2 } from 'lucide-react';
import ProcessMapView from './process-map';
import { phases, onsiteMaterials, templates, getTemplatesForPhase } from './data';
import type { Phase, Template } from './data';
import type { Engagement } from './lib/store';

/* ═══════════════════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={copy} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'}`}>
      {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied!' : (label || 'Copy')}
    </button>
  );
}

function TemplateCard({ template }: { template: Template }) {
  const [open, setOpen] = useState(false);
  const typeColors: Record<string, string> = { email: 'bg-blue-100 text-blue-700', prompt: 'bg-purple-100 text-purple-700', checklist: 'bg-green-100 text-green-700', document: 'bg-amber-100 text-amber-700' };
  const typeIcons: Record<string, string> = { email: '📧', prompt: '🤖', checklist: '✅', document: '📄' };
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          <span className="text-lg">{typeIcons[template.type] || '📄'}</span>
          <div><div className="text-sm font-medium text-gray-900">{template.title}</div><div className="text-[10px] text-gray-500">{template.description}</div></div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${typeColors[template.type] || 'bg-gray-100 text-gray-500'}`}>{template.type}</span>
          {open ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
        </div>
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-gray-100">
          <div className="flex justify-end pt-2 mb-2"><CopyButton text={template.content} label="Copy Template" /></div>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed bg-gray-50 border border-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto">{template.content}</pre>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   JOURNEY VIEW
   ═══════════════════════════════════════════════════════════════ */

function useLocalChecklist() {
  const [checked, setChecked] = useState<Record<string, string[]>>({});
  useEffect(() => {
    try { const stored = localStorage.getItem('playbook-checklist'); if (stored) setChecked(JSON.parse(stored)); } catch {}
  }, []);
  const toggle = (phaseId: string, label: string) => {
    setChecked(prev => {
      const current = prev[phaseId] || [];
      const updated = current.includes(label) ? current.filter(l => l !== label) : [...current, label];
      const next = { ...prev, [phaseId]: updated };
      localStorage.setItem('playbook-checklist', JSON.stringify(next));
      return next;
    });
  };
  return { checked, toggle };
}

function JourneyView() {
  const [activePhase, setActivePhase] = useState(phases[0].id);
  const [subView, setSubView] = useState<'journey' | 'templates'>('journey');
  const { checked, toggle } = useLocalChecklist();
  const currentPhase = phases.find(p => p.id === activePhase)!;
  const phaseTemplates = getTemplatesForPhase(activePhase);
  const phaseChecked = checked[activePhase] || [];

  // Light-mode phase colors
  const phaseColorMap: Record<string, { text: string; bg: string; border: string; activeBg: string }> = {
    'text-blue-400': { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', activeBg: 'bg-blue-50' },
    'text-orange-400': { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', activeBg: 'bg-orange-50' },
    'text-green-400': { text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', activeBg: 'bg-green-50' },
    'text-cyan-400': { text: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200', activeBg: 'bg-cyan-50' },
    'text-purple-400': { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', activeBg: 'bg-purple-50' },
    'text-rose-400': { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', activeBg: 'bg-rose-50' },
    'text-amber-400': { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', activeBg: 'bg-amber-50' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={() => setSubView('journey')} className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${subView === 'journey' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'text-gray-400 hover:text-gray-700 border border-transparent'}`}>
          🗺️ Process Journey
        </button>
        <button onClick={() => setSubView('templates')} className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${subView === 'templates' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'text-gray-400 hover:text-gray-700 border border-transparent'}`}>
          📚 Template Library
        </button>
      </div>

      {subView === 'templates' ? (
        <div className="space-y-6">
          {(['email', 'prompt', 'checklist'] as const).map(type => {
            const t = templates.filter(t => t.type === type);
            if (!t.length) return null;
            const labels: Record<string, string> = { email: '📧 Email Templates', prompt: '🤖 Copilot Prompts', checklist: '✅ Checklists' };
            return (<div key={type}><h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">{labels[type]}</h3><div className="space-y-2">{t.map(t => <TemplateCard key={t.id} template={t} />)}</div></div>);
          })}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Timeline */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="text-center mb-4">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer Journey Timeline</h2>
              <p className="text-[10px] text-gray-400 mt-1">Click any phase to view details, checklists, and templates</p>
            </div>
            <div className="flex items-center justify-between gap-1">
              {phases.map((phase, i) => {
                const isActive = activePhase === phase.id;
                const pChecked = (checked[phase.id] || []).length;
                const pTotal = phase.checklist.length;
                const pct = pTotal > 0 ? Math.round((pChecked / pTotal) * 100) : 0;
                return (
                  <div key={phase.id} className="flex items-center flex-1">
                    <button onClick={() => setActivePhase(phase.id)} className={`flex-1 p-3 rounded-xl border text-center transition-all ${isActive ? 'bg-white border-purple-300 shadow-md scale-[1.02]' : 'bg-gray-50 border-gray-100 hover:border-gray-300'}`}>
                      <div className="text-xl mb-1">{phase.icon}</div>
                      <div className={`text-[9px] font-semibold ${isActive ? 'text-purple-600' : 'text-gray-400'}`}>{phase.title.split(' ').slice(0, 2).join(' ')}</div>
                      <div className="mt-1.5 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-green-500' : pct > 0 ? 'bg-purple-500' : ''}`} style={{ width: `${pct}%` }} />
                      </div>
                      <div className="text-[8px] text-gray-400 mt-0.5">{pChecked}/{pTotal}</div>
                    </button>
                    {i < phases.length - 1 && <ArrowRight size={10} className="mx-0.5 text-gray-300 flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phase Detail */}
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${currentPhase.bgColor} flex items-center justify-center text-3xl`}>{currentPhase.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">{currentPhase.title}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700`}>Phase {currentPhase.number}</span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{currentPhase.subtitle}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-xs text-gray-500"><Clock size={12} /> {currentPhase.duration}</div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1"><Users size={12} /> {currentPhase.owner}</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-600 leading-relaxed">{currentPhase.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Wrench size={12} className="text-purple-500" /> Key Activities</h3>
              <div className="space-y-2">{currentPhase.keyActivities.map((a, i) => (<div key={i} className="text-xs text-gray-600 flex items-start gap-2"><span className="text-purple-400 mt-0.5 font-mono text-[10px]">{String(i+1).padStart(2,'0')}</span>{a}</div>))}</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><CheckSquare size={12} className="text-purple-500" /> Checklist</h3>
              <div className="space-y-1">
                {currentPhase.checklist.map((c, i) => {
                  const isChecked = phaseChecked.includes(c.label);
                  return (
                    <button key={i} onClick={() => toggle(activePhase, c.label)}
                      className={`w-full flex items-start gap-2 p-1.5 rounded-lg text-left transition-all ${isChecked ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                      <div className={`w-4 h-4 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${isChecked ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                        {isChecked && <Check size={10} className="text-white" />}
                      </div>
                      <div>
                        <div className={`text-xs ${isChecked ? 'text-green-600 line-through opacity-70' : 'text-gray-600'}`}>{c.label}</div>
                        {c.description && <div className="text-[10px] text-gray-400 mt-0.5">{c.description}</div>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Lightbulb size={12} className="text-amber-500" /> Pro Tips</h3>
            <div className="space-y-2">{currentPhase.tips.map((t, i) => (<div key={i} className="text-xs text-gray-600 flex items-start gap-2"><span className="text-amber-400 mt-0.5">💡</span> {t}</div>))}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">📦 Deliverables</h3>
              <div className="flex flex-wrap gap-1.5">{currentPhase.deliverables.map((d, i) => (<span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded">{d}</span>))}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">🔧 Tools</h3>
              <div className="flex flex-wrap gap-1.5">{currentPhase.tools.map((t, i) => (<span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded">{t}</span>))}</div>
            </div>
          </div>

          {activePhase === 'pre-workshop-prep' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h3 className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Package size={12} /> Onsite Materials</h3>
              <div className="space-y-1">
                <div className="grid grid-cols-12 gap-2 text-[10px] font-semibold text-gray-400 uppercase pb-2 border-b border-amber-200"><div className="col-span-4">Item</div><div className="col-span-3">Qty</div><div className="col-span-5">Notes</div></div>
                {onsiteMaterials.map((m, i) => (<div key={i} className="grid grid-cols-12 gap-2 text-xs text-gray-600 py-1.5 border-b border-amber-100 last:border-0"><div className="col-span-4 text-gray-800 font-medium">{m.item}</div><div className="col-span-3">{m.quantity}</div><div className="col-span-5 text-gray-500">{m.notes}</div></div>))}
              </div>
            </div>
          )}

          {phaseTemplates.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><FileText size={12} className="text-purple-500" /> Templates & Prompts</h3>
              <div className="space-y-2">{phaseTemplates.map(t => <TemplateCard key={t.id} template={t} />)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VERTICAL TIMELINE VIEW
   ═══════════════════════════════════════════════════════════════ */

function VerticalTimelineView() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const { checked, toggle } = useLocalChecklist();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-lg font-bold text-gray-900">End-to-End Journey</h2>
        <p className="text-sm text-gray-500 mt-1">From first lead to final deliverable — click any phase to expand</p>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-amber-400 opacity-30" />

        {phases.map((phase, i) => {
          const isExpanded = expandedPhase === phase.id;
          const isLast = i === phases.length - 1;
          const phaseChecked = checked[phase.id] || [];
          const pct = phase.checklist.length > 0 ? Math.round((phaseChecked.length / phase.checklist.length) * 100) : 0;
          const phaseTemplates = getTemplatesForPhase(phase.id);

          return (
            <div key={phase.id} className={`relative ${!isLast ? 'pb-2' : ''}`}>
              <div className="absolute left-6 -translate-x-1/2 flex flex-col items-center z-10">
                <button onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all hover:scale-110 ${
                    isExpanded ? 'bg-purple-50 border-purple-300 shadow-lg shadow-purple-200/50'
                    : pct === 100 ? 'bg-green-50 border-green-300'
                    : 'bg-white border-gray-200 hover:border-gray-400'
                  }`}>
                  {pct === 100 ? '✅' : phase.icon}
                </button>
              </div>

              <div className="ml-16">
                <button onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all shadow-sm ${
                    isExpanded ? 'bg-white border-purple-200 shadow-md' : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-md'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isExpanded ? 'text-purple-600' : 'text-gray-400'}`}>Phase {phase.number}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-[10px] text-gray-400">{phase.duration}</span>
                      </div>
                      <h3 className={`text-base font-bold mt-0.5 ${isExpanded ? 'text-gray-900' : 'text-gray-700'}`}>{phase.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{phase.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-green-500' : pct > 0 ? 'bg-purple-500' : ''}`} style={{ width: `${pct}%` }} />
                        </div>
                        <div className="text-[9px] text-gray-400 mt-0.5">{phaseChecked.length}/{phase.checklist.length}</div>
                      </div>
                      {isExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-3 space-y-4 pb-6">
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                      <p className="text-sm text-gray-600 leading-relaxed">{phase.description}</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Wrench size={12} className="text-purple-500" /> Key Activities
                      </h4>
                      <div className="space-y-1.5">
                        {phase.keyActivities.map((a, idx) => (
                          <div key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className="text-purple-400 mt-0.5 font-mono text-[10px]">{String(idx+1).padStart(2,'0')}</span>{a}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckSquare size={12} className="text-purple-500" /> Checklist
                      </h4>
                      <div className="space-y-0.5">
                        {phase.checklist.map((c, idx) => {
                          const isChecked = phaseChecked.includes(c.label);
                          return (
                            <button key={idx} onClick={() => toggle(phase.id, c.label)}
                              className={`w-full flex items-start gap-2 p-1.5 rounded-lg text-left transition-all ${isChecked ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                              <div className={`w-4 h-4 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${isChecked ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                                {isChecked && <Check size={10} className="text-white" />}
                              </div>
                              <div>
                                <div className={`text-xs ${isChecked ? 'text-green-600 line-through opacity-70' : 'text-gray-600'}`}>{c.label}</div>
                                {c.description && <div className="text-[10px] text-gray-400 mt-0.5">{c.description}</div>}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Lightbulb size={12} className="text-amber-500" /> Pro Tips
                      </h4>
                      <div className="space-y-1.5">
                        {phase.tips.map((t, idx) => (
                          <div key={idx} className="text-xs text-gray-600 flex items-start gap-2"><span className="text-amber-400 mt-0.5">💡</span> {t}</div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                        <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">📦 Deliverables</h4>
                        <div className="flex flex-wrap gap-1">{phase.deliverables.map((d, idx) => (<span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{d}</span>))}</div>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                        <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">🔧 Tools</h4>
                        <div className="flex flex-wrap gap-1">{phase.tools.map((t, idx) => (<span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{t}</span>))}</div>
                      </div>
                    </div>

                    {phase.id === 'pre-workshop-prep' && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h4 className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Package size={12} /> Onsite Materials</h4>
                        <div className="space-y-1">
                          {onsiteMaterials.map((m, idx) => (
                            <div key={idx} className="flex items-start gap-3 text-xs py-1 border-b border-amber-100 last:border-0">
                              <span className="text-gray-800 font-medium min-w-[140px]">{m.item}</span>
                              <span className="text-gray-500 min-w-[120px]">{m.quantity}</span>
                              <span className="text-gray-400">{m.notes}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {phaseTemplates.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <FileText size={12} className="text-purple-500" /> Templates & Prompts
                        </h4>
                        <div className="space-y-2">{phaseTemplates.map(t => <TemplateCard key={t.id} template={t} />)}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ENGAGEMENTS VIEW
   ═══════════════════════════════════════════════════════════════ */

const industries = [
  'Business Services', 'Non-Profit', 'Retail / Wholesale', 'Medical & Surgical Hospitals',
  'Energy / Utilities', 'Banking / Finance / Insurance', 'Healthcare / Pharma',
  'Aerospace & Defense / Manufacturing', 'Technology', 'Education', 'Government', 'Other',
];

function NewEngagementModal({ onClose, onCreated }: { onClose: () => void; onCreated: (e: Engagement) => void }) {
  const [form, setForm] = useState<{
    customerName: string; industry: string; owner: string; workshopFormat: 'virtual' | 'onsite' | 'hybrid' | 'tbd'; notes: string;
  }>({ customerName: '', industry: '', owner: '', workshopFormat: 'tbd', notes: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName.trim()) return;
    setSaving(true);
    const res = await fetch('/api/engagements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const created = await res.json();
    onCreated(created);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">New Customer Engagement</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">Customer Name *</label>
            <input type="text" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-200" placeholder="e.g., Acme Corporation" autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Industry</label>
              <select value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-purple-400">
                <option value="">Select...</option>
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">VE Owner</label>
              <input type="text" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400" placeholder="Your name" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">Workshop Format</label>
            <div className="flex gap-2 mt-1">
              {(['tbd', 'virtual', 'onsite', 'hybrid'] as const).map(fmt => (
                <button key={fmt} type="button" onClick={() => setForm({ ...form, workshopFormat: fmt })}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${form.workshopFormat === fmt ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  {fmt === 'tbd' ? 'TBD' : fmt.charAt(0).toUpperCase() + fmt.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">Initial Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 resize-none h-20" placeholder="Lead source, initial context, etc." />
          </div>
          <button type="submit" disabled={!form.customerName.trim() || saving} className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium rounded-lg transition-colors">
            {saving ? 'Creating...' : 'Create Engagement'}
          </button>
        </form>
      </div>
    </div>
  );
}

function EngagementCard({ engagement }: { engagement: Engagement }) {
  const phase = phases.find(p => p.id === engagement.currentPhase) || phases[0];
  const phaseIndex = phases.findIndex(p => p.id === engagement.currentPhase);
  const totalItems = phases.reduce((sum, p) => sum + p.checklist.length, 0);
  const totalChecked = Object.values(engagement.checkedItems).reduce((sum, items) => sum + items.length, 0);
  const progress = totalItems > 0 ? Math.round((totalChecked / totalItems) * 100) : 0;
  const formatColors: Record<string, string> = { onsite: 'bg-amber-100 text-amber-700', virtual: 'bg-blue-100 text-blue-700', hybrid: 'bg-purple-100 text-purple-700', tbd: 'bg-gray-100 text-gray-500' };

  return (
    <Link href={`/${engagement.id}`} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-gray-300 transition-all group block shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{engagement.customerName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-gray-500">{engagement.industry || 'No industry'}</span>
            <span className="text-gray-300">·</span>
            <span className="text-[10px] text-gray-500">{engagement.owner || 'Unassigned'}</span>
          </div>
        </div>
        <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors mt-1" />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{phase.icon}</span>
        <div>
          <div className="text-xs font-semibold text-purple-600">{phase.title}</div>
          <div className="text-[10px] text-gray-400">{phase.duration}</div>
        </div>
        <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${formatColors[engagement.workshopFormat]}`}>
          {engagement.workshopFormat === 'tbd' ? 'Format TBD' : engagement.workshopFormat}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-[10px] text-gray-400 font-mono">{progress}%</span>
      </div>
      <div className="flex items-center gap-1 mt-2">
        {phases.map((p, i) => (
          <div key={p.id} className={`w-1.5 h-1.5 rounded-full ${i < phaseIndex ? 'bg-green-500' : i === phaseIndex ? 'bg-purple-500' : 'bg-gray-200'}`} />
        ))}
      </div>
    </Link>
  );
}

function EngagementsView() {
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    fetch('/api/engagements')
      .then(r => r.json())
      .then(data => { setEngagements(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const byPhase = phases.map(phase => ({ phase, engagements: engagements.filter(e => e.currentPhase === phase.id) }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-lg">
            <div className="text-lg font-bold text-purple-600">{engagements.length}</div>
            <div className="text-[10px] text-gray-400">Active</div>
          </div>
          {phases.slice(0, 4).map(phase => {
            const count = engagements.filter(e => e.currentPhase === phase.id).length;
            return (
              <div key={phase.id} className="text-center px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="text-lg font-bold text-purple-600">{count}</div>
                <div className="text-[10px] text-gray-400">{phase.title.split(' ')[0]}</div>
              </div>
            );
          })}
        </div>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
          <Plus size={16} /> New Engagement
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-20">Loading engagements...</div>
      ) : engagements.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🎯</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">No engagements yet</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">Create your first customer engagement to start tracking.</p>
          <button onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors shadow-sm">
            <Plus size={18} /> Create First Engagement
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {byPhase.map(({ phase, engagements: pe }) => (
            <div key={phase.id}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{phase.icon}</span>
                <h3 className="text-sm font-semibold text-gray-700">{phase.title}</h3>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{pe.length}</span>
              </div>
              {pe.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pe.map(e => <EngagementCard key={e.id} engagement={e} />)}
                </div>
              ) : (
                <div className="text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg p-3 text-center">No engagements in this phase</div>
              )}
            </div>
          ))}
        </div>
      )}

      {showNew && <NewEngagementModal onClose={() => setShowNew(false)} onCreated={(e) => setEngagements([...engagements, e])} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function HomePage() {
  const [tab, setTab] = useState<'journey' | 'timeline' | 'processmap' | 'engagements'>('journey');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Capability & Maturity Workshop Playbook</h1>
              <p className="text-sm text-gray-500 mt-0.5">Process guide & customer engagement tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4">
            {([
              { key: 'journey' as const, label: '🗺️ Journey & Playbook' },
              { key: 'timeline' as const, label: '📍 Vertical Timeline' },
              { key: 'processmap' as const, label: '🔀 Process Map' },
              { key: 'engagements' as const, label: '📋 Customer Engagements' },
            ]).map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${
                  tab === t.key ? 'text-purple-700 border-purple-500 bg-purple-50' : 'text-gray-400 border-transparent hover:text-gray-700'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {tab === 'journey' ? <JourneyView /> : tab === 'timeline' ? <VerticalTimelineView /> : tab === 'processmap' ? <ProcessMapView /> : <EngagementsView />}
      </div>
    </div>
  );
}
