'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Users, ChevronRight, FileText, X, ArrowRight, BarChart3 } from 'lucide-react';
import { phases } from './data';
import type { Engagement } from './lib/store';

const industries = [
  'Business Services', 'Non-Profit', 'Retail / Wholesale', 'Medical & Surgical Hospitals',
  'Energy / Utilities', 'Banking / Finance / Insurance', 'Healthcare / Pharma',
  'Aerospace & Defense / Manufacturing', 'Technology', 'Education', 'Government', 'Other',
];

function NewEngagementModal({ onClose, onCreated }: { onClose: () => void; onCreated: (e: Engagement) => void }) {
  const [form, setForm] = useState<{
    customerName: string; industry: string; owner: string; workshopFormat: 'virtual' | 'onsite' | 'hybrid' | 'tbd'; notes: string;
  }>({
    customerName: '', industry: '', owner: '', workshopFormat: 'tbd', notes: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName.trim()) return;
    setSaving(true);
    const res = await fetch('/api/engagements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const created = await res.json();
    onCreated(created);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">New Customer Engagement</h2>
          <button onClick={onClose} className="text-[#555] hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-[#666] uppercase tracking-wider">Customer Name *</label>
            <input
              type="text"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="w-full mt-1 bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#444] focus:outline-none focus:border-purple-500/30"
              placeholder="e.g., Acme Corporation"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#666] uppercase tracking-wider">Industry</label>
              <select
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                className="w-full mt-1 bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/30"
              >
                <option value="">Select...</option>
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-[#666] uppercase tracking-wider">VE Owner</label>
              <input
                type="text"
                value={form.owner}
                onChange={(e) => setForm({ ...form, owner: e.target.value })}
                className="w-full mt-1 bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#444] focus:outline-none focus:border-purple-500/30"
                placeholder="Your name"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-[#666] uppercase tracking-wider">Workshop Format</label>
            <div className="flex gap-2 mt-1">
              {(['tbd', 'virtual', 'onsite', 'hybrid'] as const).map(fmt => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setForm({ ...form, workshopFormat: fmt })}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    form.workshopFormat === fmt
                      ? 'bg-purple-500/15 border-purple-500/30 text-purple-400'
                      : 'bg-[#0a0a0a] border-[#222] text-[#666] hover:border-[#333]'
                  }`}
                >
                  {fmt === 'tbd' ? 'TBD' : fmt.charAt(0).toUpperCase() + fmt.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-[#666] uppercase tracking-wider">Initial Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full mt-1 bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#444] focus:outline-none focus:border-purple-500/30 resize-none h-20"
              placeholder="Lead source, initial context, etc."
            />
          </div>
          <button
            type="submit"
            disabled={!form.customerName.trim() || saving}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-[#333] disabled:text-[#666] text-white font-medium rounded-lg transition-colors"
          >
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

  const formatColors: Record<string, string> = {
    onsite: 'bg-amber-500/15 text-amber-400',
    virtual: 'bg-blue-500/15 text-blue-400',
    hybrid: 'bg-purple-500/15 text-purple-400',
    tbd: 'bg-white/5 text-[#666]',
  };

  return (
    <Link
      href={`/${engagement.id}`}
      className="bg-[#111] border border-[#222] rounded-xl p-5 hover:bg-[#141414] hover:border-[#333] transition-all group block"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
            {engagement.customerName}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-[#666]">{engagement.industry || 'No industry'}</span>
            <span className="text-[#333]">·</span>
            <span className="text-[10px] text-[#666]">{engagement.owner || 'Unassigned'}</span>
          </div>
        </div>
        <ChevronRight size={16} className="text-[#333] group-hover:text-[#666] transition-colors mt-1" />
      </div>

      {/* Current Phase */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{phase.icon}</span>
        <div>
          <div className={`text-xs font-semibold ${phase.color}`}>{phase.title}</div>
          <div className="text-[10px] text-[#555]">{phase.duration}</div>
        </div>
        <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${formatColors[engagement.workshopFormat]}`}>
          {engagement.workshopFormat === 'tbd' ? 'Format TBD' : engagement.workshopFormat}
        </span>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-[#222] rounded-full overflow-hidden">
          <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-[10px] text-[#555] font-mono">{progress}%</span>
      </div>

      {/* Phase dots */}
      <div className="flex items-center gap-1 mt-2">
        {phases.map((p, i) => (
          <div
            key={p.id}
            className={`w-1.5 h-1.5 rounded-full ${
              i < phaseIndex ? 'bg-green-500' : i === phaseIndex ? 'bg-purple-500' : 'bg-[#222]'
            }`}
          />
        ))}
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [showPlaybook, setShowPlaybook] = useState(false);

  useEffect(() => {
    fetch('/api/engagements')
      .then(r => r.json())
      .then(data => { setEngagements(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Group by phase
  const byPhase = phases.map(phase => ({
    phase,
    engagements: engagements.filter(e => e.currentPhase === phase.id),
  }));

  const activeCount = engagements.length;
  const completedCount = engagements.filter(e => e.currentPhase === 'deliverable-presentation').length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-[#222] bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Capability & Maturity Workshop Playbook</h1>
              <p className="text-sm text-[#555] mt-0.5">Track customer engagements from lead to deliverable</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/playbook"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[#111] border border-[#222] text-[#888] hover:text-white hover:border-[#333] transition-colors"
              >
                <FileText size={16} />
                Playbook & Templates
              </Link>
              <button
                onClick={() => setShowNew(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus size={16} />
                New Engagement
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{activeCount}</div>
            <div className="text-xs text-[#555] mt-1">Active Engagements</div>
          </div>
          {phases.slice(0, 3).map(phase => {
            const count = engagements.filter(e => e.currentPhase === phase.id).length;
            return (
              <div key={phase.id} className={`bg-[#111] border ${phase.borderColor} rounded-xl p-4 text-center`}>
                <div className={`text-2xl font-bold ${phase.color}`}>{count}</div>
                <div className="text-xs text-[#555] mt-1">{phase.title}</div>
              </div>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center text-[#555] py-20">Loading engagements...</div>
        ) : engagements.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-lg font-bold text-white mb-2">No engagements yet</h2>
            <p className="text-sm text-[#666] mb-6 max-w-md mx-auto">
              Create your first customer engagement to start tracking the Capability & Maturity workshop journey.
            </p>
            <button
              onClick={() => setShowNew(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors"
            >
              <Plus size={18} />
              Create First Engagement
            </button>
          </div>
        ) : (
          /* Pipeline View */
          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider flex items-center gap-2">
              <BarChart3 size={14} /> Pipeline View
            </h2>
            {byPhase.map(({ phase, engagements: phaseEngagements }) => (
              <div key={phase.id}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{phase.icon}</span>
                  <h3 className={`text-sm font-semibold ${phase.color}`}>{phase.title}</h3>
                  <span className="text-xs text-[#444] bg-[#111] px-2 py-0.5 rounded-full">{phaseEngagements.length}</span>
                </div>
                {phaseEngagements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {phaseEngagements.map(e => <EngagementCard key={e.id} engagement={e} />)}
                  </div>
                ) : (
                  <div className="text-xs text-[#333] border border-dashed border-[#1a1a1a] rounded-lg p-3 text-center">
                    No engagements in this phase
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Engagement Modal */}
      {showNew && (
        <NewEngagementModal
          onClose={() => setShowNew(false)}
          onCreated={(e) => setEngagements([...engagements, e])}
        />
      )}
    </div>
  );
}
