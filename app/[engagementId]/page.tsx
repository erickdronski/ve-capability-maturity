'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronRight, Copy, Check, Clock, Users, Wrench, FileText, CheckSquare, Lightbulb, Package, ArrowRight, Save, Trash2, MessageSquare, Edit3 } from 'lucide-react';
import { phases, onsiteMaterials, getTemplatesForPhase } from '../data';
import type { Phase, Template } from '../data';
import type { Engagement } from '../lib/store';

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
  const typeIcons: Record<string, string> = { email: '📧', prompt: '🤖', checklist: '✅', document: '📄', script: '⚡' };

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
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${typeColors[template.type]}`}>{template.type}</span>
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

export default function EngagementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const engagementId = params.engagementId as string;

  const [engagement, setEngagement] = useState<Engagement | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activePhase, setActivePhase] = useState<string>('');
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesInput, setNotesInput] = useState('');

  // Fetch engagement
  useEffect(() => {
    fetch(`/api/engagements/${engagementId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { router.push('/'); return; }
        setEngagement(data);
        setActivePhase(data.currentPhase || 'lead-intake');
        setNotesInput(data.notes || '');
        setLoading(false);
      })
      .catch(() => router.push('/'));
  }, [engagementId, router]);

  // Save helper
  const save = useCallback(async (updates: Partial<Engagement>) => {
    setSaving(true);
    const res = await fetch(`/api/engagements/${engagementId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const updated = await res.json();
    setEngagement(updated);
    setSaving(false);
  }, [engagementId]);

  // Toggle checklist item
  const toggleChecklist = useCallback(async (phaseId: string, itemLabel: string) => {
    if (!engagement) return;
    const current = engagement.checkedItems[phaseId] || [];
    const updated = current.includes(itemLabel)
      ? current.filter(l => l !== itemLabel)
      : [...current, itemLabel];
    const newChecked = { ...engagement.checkedItems, [phaseId]: updated };
    setEngagement({ ...engagement, checkedItems: newChecked });
    await save({ checkedItems: newChecked });
  }, [engagement, save]);

  // Set current phase
  const setPhase = useCallback(async (phaseId: string) => {
    await save({ currentPhase: phaseId });
  }, [save]);

  // Delete
  const handleDelete = async () => {
    if (!confirm('Delete this engagement? This cannot be undone.')) return;
    await fetch(`/api/engagements/${engagementId}`, { method: 'DELETE' });
    router.push('/');
  };

  if (loading || !engagement) {
    return <div className="min-h-screen flex items-center justify-center text-[#555]">Loading...</div>;
  }

  const currentPhaseData = phases.find(p => p.id === activePhase)!;
  const currentPhaseIndex = phases.findIndex(p => p.id === engagement.currentPhase);
  const phaseChecked = engagement.checkedItems[activePhase] || [];
  const phaseTotal = currentPhaseData.checklist.length;
  const phaseComplete = phaseChecked.length;
  const phaseTemplates = getTemplatesForPhase(activePhase);

  // Calculate overall progress
  const totalItems = phases.reduce((sum, p) => sum + p.checklist.length, 0);
  const totalChecked = Object.values(engagement.checkedItems).reduce((sum, items) => sum + items.length, 0);
  const overallProgress = totalItems > 0 ? Math.round((totalChecked / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-[#222] bg-[#0a0a0a] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-[#555] hover:text-white transition-colors">
                <ArrowLeft size={18} />
              </Link>
              <div>
                <h1 className="text-lg font-bold text-white">{engagement.customerName}</h1>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-[#666]">{engagement.industry}</span>
                  <span className="text-[#333]">·</span>
                  <span className="text-xs text-[#666]">Owner: {engagement.owner}</span>
                  <span className="text-[#333]">·</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    engagement.workshopFormat === 'onsite' ? 'bg-amber-500/15 text-amber-400' :
                    engagement.workshopFormat === 'virtual' ? 'bg-blue-500/15 text-blue-400' :
                    engagement.workshopFormat === 'hybrid' ? 'bg-purple-500/15 text-purple-400' :
                    'bg-white/5 text-[#666]'
                  }`}>
                    {engagement.workshopFormat === 'tbd' ? 'Format TBD' : engagement.workshopFormat}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {saving && <span className="text-xs text-[#555]">Saving...</span>}
              <div className="text-right">
                <div className="text-xs text-[#555]">Overall Progress</div>
                <div className="text-sm font-bold text-purple-400">{overallProgress}%</div>
              </div>
              <div className="w-24 h-2 bg-[#222] rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
              </div>
              <button onClick={handleDelete} className="p-2 text-[#555] hover:text-red-400 transition-colors" title="Delete engagement">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        {/* Phase Timeline */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-[#555] uppercase tracking-wider">Engagement Timeline</h2>
            <div className="text-xs text-[#555]">
              Current Phase: <span className="text-white font-semibold">{phases.find(p => p.id === engagement.currentPhase)?.title}</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-1">
            {phases.map((phase, i) => {
              const isCurrentPhase = engagement.currentPhase === phase.id;
              const isPast = i < currentPhaseIndex;
              const isViewing = activePhase === phase.id;
              const checked = (engagement.checkedItems[phase.id] || []).length;
              const total = phase.checklist.length;
              const pctComplete = total > 0 ? Math.round((checked / total) * 100) : 0;

              return (
                <div key={phase.id} className="flex items-center flex-1">
                  <button
                    onClick={() => setActivePhase(phase.id)}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all text-center relative ${
                      isViewing
                        ? `${phase.bgColor} ${phase.borderColor} scale-[1.02]`
                        : isPast
                        ? 'bg-green-500/5 border-green-500/20'
                        : isCurrentPhase
                        ? 'bg-[#0d0d0d] border-purple-500/30'
                        : 'bg-[#0d0d0d] border-[#1a1a1a] hover:border-[#333]'
                    }`}
                  >
                    {isCurrentPhase && (
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px] bg-purple-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                        CURRENT
                      </div>
                    )}
                    <div className="text-xl mb-1">{phase.icon}</div>
                    <div className={`text-[9px] font-semibold ${isViewing ? phase.color : isPast ? 'text-green-400' : 'text-[#555]'}`}>
                      {phase.title.length > 12 ? phase.title.split(' ').slice(0, 2).join(' ') : phase.title}
                    </div>
                    {/* Progress bar */}
                    <div className="mt-1.5 w-full h-1 bg-[#222] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${isPast || pctComplete === 100 ? 'bg-green-500' : pctComplete > 0 ? 'bg-purple-500' : ''}`}
                        style={{ width: `${pctComplete}%` }} />
                    </div>
                    <div className="text-[8px] text-[#444] mt-0.5">{checked}/{total}</div>
                  </button>
                  {i < phases.length - 1 && (
                    <ArrowRight size={10} className={`mx-0.5 flex-shrink-0 ${isPast ? 'text-green-500/30' : 'text-[#222]'}`} />
                  )}
                </div>
              );
            })}
          </div>
          {/* Set Phase Buttons */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-[10px] text-[#555]">Move to:</span>
            {phases.map(phase => (
              <button
                key={phase.id}
                onClick={() => setPhase(phase.id)}
                className={`text-[10px] px-2 py-1 rounded transition-colors ${
                  engagement.currentPhase === phase.id
                    ? `${phase.bgColor} ${phase.color} font-semibold`
                    : 'bg-[#0d0d0d] text-[#555] hover:text-white hover:bg-[#1a1a1a]'
                }`}
              >
                {phase.number}
              </button>
            ))}
          </div>
        </div>

        {/* Active Phase Detail */}
        <div className="space-y-5">
          {/* Phase Header */}
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${currentPhaseData.bgColor} flex items-center justify-center text-3xl`}>
              {currentPhaseData.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">{currentPhaseData.title}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full ${currentPhaseData.bgColor} ${currentPhaseData.color}`}>
                  Phase {currentPhaseData.number}
                </span>
                <span className="text-xs text-[#555]">{phaseComplete}/{phaseTotal} complete</span>
              </div>
              <p className="text-sm text-[#666] mt-0.5">{currentPhaseData.subtitle}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-xs text-[#555]">
                <Clock size={12} /> {currentPhaseData.duration}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#111] border border-[#222] rounded-xl p-5">
            <p className="text-sm text-[#999] leading-relaxed">{currentPhaseData.description}</p>
          </div>

          {/* Interactive Checklist */}
          <div className="bg-[#111] border border-[#222] rounded-xl p-5">
            <h3 className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CheckSquare size={12} className={currentPhaseData.color} /> Checklist for {engagement.customerName}
            </h3>
            <div className="space-y-1">
              {currentPhaseData.checklist.map((c, i) => {
                const isChecked = phaseChecked.includes(c.label);
                return (
                  <button
                    key={i}
                    onClick={() => toggleChecklist(activePhase, c.label)}
                    className={`w-full flex items-start gap-3 p-2 rounded-lg text-left transition-all ${
                      isChecked ? 'bg-green-500/5' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className={`w-5 h-5 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                      isChecked ? 'bg-green-500 border-green-500' : 'border-[#333]'
                    }`}>
                      {isChecked && <Check size={12} className="text-white" />}
                    </div>
                    <div>
                      <div className={`text-sm ${isChecked ? 'text-green-400 line-through opacity-70' : 'text-[#ccc]'}`}>
                        {c.label}
                      </div>
                      {c.description && (
                        <div className="text-[10px] text-[#555] mt-0.5">{c.description}</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Key Activities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#111] border border-[#222] rounded-xl p-5">
              <h3 className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Wrench size={12} className={currentPhaseData.color} /> Key Activities
              </h3>
              <div className="space-y-2">
                {currentPhaseData.keyActivities.map((a, i) => (
                  <div key={i} className="text-xs text-[#888] flex items-start gap-2">
                    <span className={`${currentPhaseData.color} opacity-50 mt-0.5 font-mono text-[10px]`}>{String(i + 1).padStart(2, '0')}</span>
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-[#111] border border-[#222] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-[#555] uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare size={12} className={currentPhaseData.color} /> Engagement Notes
                </h3>
                {editingNotes ? (
                  <button onClick={() => { save({ notes: notesInput }); setEditingNotes(false); }}
                    className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300">
                    <Save size={12} /> Save
                  </button>
                ) : (
                  <button onClick={() => setEditingNotes(true)}
                    className="flex items-center gap-1 text-xs text-[#555] hover:text-white">
                    <Edit3 size={12} /> Edit
                  </button>
                )}
              </div>
              {editingNotes ? (
                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full h-40 bg-[#0a0a0a] border border-[#222] rounded-lg p-3 text-sm text-[#ccc] placeholder-[#444] focus:outline-none focus:border-purple-500/30 resize-none"
                  placeholder="Add notes about this engagement..."
                />
              ) : (
                <div className="text-sm text-[#888] leading-relaxed whitespace-pre-wrap min-h-[100px]">
                  {engagement.notes || <span className="text-[#444] italic">No notes yet. Click Edit to add.</span>}
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className={`bg-[#111] border ${currentPhaseData.borderColor} rounded-xl p-5`}>
            <h3 className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Lightbulb size={12} className="text-yellow-400" /> Pro Tips
            </h3>
            <div className="space-y-2">
              {currentPhaseData.tips.map((t, i) => (
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
                {currentPhaseData.deliverables.map((d, i) => (
                  <span key={i} className="text-[10px] bg-white/5 text-[#888] px-2 py-1 rounded">{d}</span>
                ))}
              </div>
            </div>
            <div className="bg-[#111] border border-[#222] rounded-xl p-4">
              <h3 className="text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-2">🔧 Tools</h3>
              <div className="flex flex-wrap gap-1.5">
                {currentPhaseData.tools.map((t, i) => (
                  <span key={i} className="text-[10px] bg-white/5 text-[#888] px-2 py-1 rounded">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Onsite Materials */}
          {activePhase === 'pre-workshop-prep' && (
            <div className="bg-[#111] border border-amber-500/20 rounded-xl p-5">
              <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Package size={12} /> Onsite Workshop Materials List
              </h3>
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
          )}

          {/* Templates */}
          {phaseTemplates.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <FileText size={12} className={currentPhaseData.color} /> Templates & Prompts
              </h3>
              <div className="space-y-2">
                {phaseTemplates.map(t => <TemplateCard key={t.id} template={t} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
