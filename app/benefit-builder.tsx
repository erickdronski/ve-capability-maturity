'use client';

import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronRight, Calculator, DollarSign, Clock, TrendingUp, Users, Zap, Settings, HelpCircle } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */

type BenefitCategory = 'financial' | 'time-savings';

interface Benefit {
  id: string;
  benefitName: string;
  category: BenefitCategory;
  subcategory: string;
  product: string;
  description: string;
  formula: string;
  formulaFactors: {
    name: string;
    description: string;
    defaultValue?: string;
    inputType: 'customer-metric' | 'improvement-factor' | 'financial-factor' | 'ramp';
  }[];
  exampleCalculation: {
    inputs: Record<string, string>;
    result: string;
    narrative: string;
  };
  whyItWorks: string;
  dataPoints: string[];
}

/* ═══════════════════════════════════════════════════════════════
   ITSM BENEFITS DATA
   ═══════════════════════════════════════════════════════════════ */

const benefits: Benefit[] = [
  {
    id: 'itsm-self-service-deflection',
    benefitName: 'Self-Service Ticket Deflection',
    category: 'financial',
    subcategory: 'Labor Cost Avoidance',
    product: 'Neurons for ITSM',
    description: 'Ivanti Neurons for ITSM provides a self-service portal with AI-powered search, knowledge base integration, and service catalog automation. When employees can resolve issues themselves — password resets, access requests, FAQ lookups — tickets never reach the service desk. Each deflected ticket saves the fully-loaded cost of an analyst touching it.',
    formula: 'Annual Tickets × Self-Service Deflection Rate × Cost per Ticket × Benefit Ramp',
    formulaFactors: [
      { name: 'Annual Tickets', description: 'Total IT service desk tickets per year', inputType: 'customer-metric' },
      { name: 'Self-Service Deflection Rate', description: 'Percentage of tickets resolved via self-service portal without analyst involvement', defaultValue: '15%', inputType: 'improvement-factor' },
      { name: 'Cost per Ticket', description: 'Fully-loaded cost per analyst-handled ticket (loaded salary ÷ annual hours × average handle time)', defaultValue: '$22', inputType: 'financial-factor' },
      { name: 'Benefit Ramp', description: 'Realization rate accounting for adoption curve (Year 1 rollout)', defaultValue: '75%', inputType: 'ramp' },
    ],
    exampleCalculation: {
      inputs: { 'Annual Tickets': '90,000', 'Self-Service Deflection Rate': '15%', 'Cost per Ticket': '$22', 'Benefit Ramp': '75%' },
      result: '$222,750',
      narrative: '90,000 tickets × 15% deflected = 13,500 tickets avoided. At $22/ticket × 75% ramp = $222,750 in annual labor cost savings. That\'s roughly 2.5 FTE analysts freed up from routine ticket handling to focus on higher-value work.',
    },
    whyItWorks: 'Industry benchmarks show that 20-40% of service desk tickets are repetitive, knowledge-solvable issues: password resets, VPN how-tos, software access requests. Ivanti\'s self-service portal with AI search and pre-built knowledge articles deflects these at the front door. The 15% default is conservative — mature deployments achieve 25-35% deflection rates.',
    dataPoints: [
      'HDI reports average cost per ticket handled by L1 analyst: $22 (2024)',
      'Gartner: Organizations with mature self-service achieve 30-40% ticket deflection',
      'MetricNet: Password resets alone account for 20-30% of all service desk contacts',
      'Forrester: Self-service resolution costs $2 vs. $22 for analyst-handled (10x cheaper)',
    ],
  },
  {
    id: 'itsm-automated-onboarding',
    benefitName: 'Automated Employee Onboarding',
    category: 'time-savings',
    subcategory: 'Process Automation',
    product: 'Neurons for ITSM',
    description: 'Ivanti Neurons for ITSM automates the employee onboarding workflow — from HR trigger to account provisioning, hardware assignment, software deployment, and access grants. What typically takes 3-5 days of manual coordination across IT, HR, and facilities becomes a same-day automated workflow. Every new hire gets productive faster, and IT avoids hours of manual provisioning per person.',
    formula: 'Annual New Hires × Manual Hours Saved per Onboard × Loaded Hourly Rate × Benefit Ramp',
    formulaFactors: [
      { name: 'Annual New Hires', description: 'Number of new employees onboarded per year (including transfers and role changes)', inputType: 'customer-metric' },
      { name: 'Manual Hours Saved per Onboard', description: 'IT analyst hours saved per onboarding via automated provisioning vs. manual', defaultValue: '4 hours', inputType: 'improvement-factor' },
      { name: 'Loaded Hourly Rate', description: 'IT analyst fully-loaded hourly cost (salary + benefits ÷ annual working hours)', defaultValue: '$45/hr', inputType: 'financial-factor' },
      { name: 'Benefit Ramp', description: 'Realization rate accounting for workflow buildout and adoption', defaultValue: '80%', inputType: 'ramp' },
    ],
    exampleCalculation: {
      inputs: { 'Annual New Hires': '500', 'Manual Hours Saved per Onboard': '4 hours', 'Loaded Hourly Rate': '$45/hr', 'Benefit Ramp': '80%' },
      result: '$72,000',
      narrative: '500 new hires × 4 hours saved each = 2,000 hours recovered. At $45/hr × 80% ramp = $72,000 in annual labor savings. That\'s 1 FTE analyst\'s entire annual workload redirected from manual provisioning to strategic projects.',
    },
    whyItWorks: 'Manual onboarding involves 8-15 discrete tasks across IT, HR, and Facilities: AD account creation, email setup, VPN access, hardware assignment, software deployment, badge provisioning, distribution list membership, and more. Each task is a handoff. Ivanti ITSM orchestrates all of these from a single HR-triggered workflow — no tickets, no waiting, no missed steps.',
    dataPoints: [
      'Aberdeen Group: Companies with automated onboarding see 54% greater new-hire productivity',
      'SHRM: Average cost of manual onboarding is $4,129 per employee (all departments)',
      'Samanage: IT onboarding tasks average 4-8 hours of manual effort per new hire',
      'Gallup: Only 12% of employees say their organization does a great job onboarding — automation closes this gap',
    ],
  },
  {
    id: 'itsm-change-failure-reduction',
    benefitName: 'Reduced Change Failure Rate',
    category: 'financial',
    subcategory: 'Outage Cost Avoidance',
    product: 'Neurons for ITSM',
    description: 'Ivanti Neurons for ITSM provides structured change management workflows with risk assessment scoring, CAB approval routing, conflict detection, and automated implementation plans. By enforcing proper change evaluation and approval before changes hit production, failed changes — and their associated outages — are significantly reduced.',
    formula: 'Annual Changes × Change Failure Rate × Average Outage Cost per Failed Change × % Reduction in Failures × Benefit Ramp',
    formulaFactors: [
      { name: 'Annual Changes', description: 'Total change requests processed per year (standard, normal, emergency)', inputType: 'customer-metric' },
      { name: 'Change Failure Rate', description: 'Percentage of changes that result in incidents or outages', defaultValue: '15%', inputType: 'customer-metric' },
      { name: 'Average Outage Cost per Failed Change', description: 'Cost of a change-related outage (downtime × impacted users × productivity cost)', defaultValue: '$5,000', inputType: 'financial-factor' },
      { name: '% Reduction in Failures', description: 'Improvement in change success rate with structured workflows and risk scoring', defaultValue: '30%', inputType: 'improvement-factor' },
      { name: 'Benefit Ramp', description: 'Realization rate as change processes mature', defaultValue: '70%', inputType: 'ramp' },
    ],
    exampleCalculation: {
      inputs: { 'Annual Changes': '2,400', 'Change Failure Rate': '15%', 'Average Outage Cost': '$5,000', 'Reduction in Failures': '30%', 'Benefit Ramp': '70%' },
      result: '$378,000',
      narrative: '2,400 changes × 15% failure rate = 360 failed changes/year. Reducing failures by 30% = 108 fewer outages. At $5,000/outage × 70% ramp = $378,000 in avoided outage costs. Plus downstream savings: fewer emergency incidents, less weekend remediation, reduced SLA breach risk.',
    },
    whyItWorks: 'Most change failures happen because of inadequate risk assessment, missed dependencies, or insufficient approval. Ivanti ITSM enforces a structured pipeline: risk scoring automatically classifies changes, conflict calendars prevent scheduling collisions, and CAB workflows ensure proper review. The result is changes get done right the first time.',
    dataPoints: [
      'DORA/Google: Elite performers have change failure rates below 5%; industry average is 15-20%',
      'Gartner: Unplanned outages cost $5,600/minute on average ($336K/hour)',
      'Forrester: Structured change management reduces failure rates by 25-40%',
      'ITIL 4: Organizations with mature change enablement see 3x fewer major incidents from changes',
    ],
  },
  {
    id: 'itsm-knowledge-first-contact',
    benefitName: 'Improved First Contact Resolution via Knowledge',
    category: 'financial',
    subcategory: 'Escalation Cost Avoidance',
    product: 'Neurons for ITSM',
    description: 'Ivanti Neurons for ITSM surfaces relevant knowledge base articles directly in the analyst workspace during ticket handling. AI-powered article suggestions, contextual search, and resolution history ensure L1 analysts can resolve more issues without escalating to L2/L3. Every ticket resolved at L1 instead of L2 saves the cost differential between tiers.',
    formula: 'Annual Tickets × Current Escalation Rate × % Reduction in Escalations × Cost Differential (L2 vs L1) × Benefit Ramp',
    formulaFactors: [
      { name: 'Annual Tickets', description: 'Total annual IT tickets', inputType: 'customer-metric' },
      { name: 'Current Escalation Rate', description: 'Percentage of L1 tickets escalated to L2/L3', defaultValue: '30%', inputType: 'customer-metric' },
      { name: '% Reduction in Escalations', description: 'Improvement in first-contact resolution with AI-powered knowledge suggestions', defaultValue: '20%', inputType: 'improvement-factor' },
      { name: 'Cost Differential per Escalation', description: 'Additional cost when a ticket escalates from L1 to L2 (higher-paid analyst + longer handle time)', defaultValue: '$35', inputType: 'financial-factor' },
      { name: 'Benefit Ramp', description: 'Realization as knowledge base matures and adoption increases', defaultValue: '65%', inputType: 'ramp' },
    ],
    exampleCalculation: {
      inputs: { 'Annual Tickets': '90,000', 'Escalation Rate': '30%', 'Reduction in Escalations': '20%', 'Cost Differential': '$35', 'Benefit Ramp': '65%' },
      result: '$122,850',
      narrative: '90,000 tickets × 30% escalated = 27,000 escalations/year. Reducing by 20% = 5,400 tickets now resolved at L1. At $35 cost differential × 65% ramp = $122,850 saved annually. Bonus: L2/L3 teams get 5,400 fewer interruptions, recovering capacity for project work and root cause analysis.',
    },
    whyItWorks: 'L1 analysts escalate when they don\'t know the answer — not because the answer doesn\'t exist. In most organizations, knowledge articles exist but are buried in SharePoint, wikis, or tribal knowledge. Ivanti ITSM surfaces the right article at the right time during ticket handling. AI suggestions based on ticket keywords, category, and historical resolution patterns put answers in front of L1 before they reach for the escalation button.',
    dataPoints: [
      'HDI: L1 FCR industry average is 70%; best-in-class achieve 85%+',
      'MetricNet: Cost per L2 ticket is 2-3x cost of L1 ($44 vs $22)',
      'Knowledge-Centered Service (KCS): Organizations practicing KCS improve FCR by 20-30%',
      'Ivanti customers report 15-25% reduction in escalations within 6 months of KB enablement',
    ],
  },
  {
    id: 'itsm-sla-breach-prevention',
    benefitName: 'SLA Breach Prevention via Workflow Automation',
    category: 'financial',
    subcategory: 'Penalties & Revenue Protection',
    product: 'Neurons for ITSM',
    description: 'Ivanti Neurons for ITSM monitors SLA timers in real-time and triggers automated escalation workflows before breaches occur. Priority-based routing, auto-assignment rules, and proactive notifications ensure tickets approaching SLA deadlines get the attention they need. For organizations with contractual SLAs, preventing breaches directly protects revenue and avoids penalties.',
    formula: 'Annual SLA-Bound Tickets × Current Breach Rate × % Reduction in Breaches × Average Penalty per Breach × Benefit Ramp',
    formulaFactors: [
      { name: 'Annual SLA-Bound Tickets', description: 'Tickets subject to contractual or internal SLA commitments', inputType: 'customer-metric' },
      { name: 'Current Breach Rate', description: 'Percentage of SLA-bound tickets that currently breach their target', defaultValue: '12%', inputType: 'customer-metric' },
      { name: '% Reduction in Breaches', description: 'Improvement from automated SLA monitoring, escalation, and routing', defaultValue: '40%', inputType: 'improvement-factor' },
      { name: 'Average Cost per SLA Breach', description: 'Penalty, credit, or revenue impact per breached SLA (varies by contract)', defaultValue: '$150', inputType: 'financial-factor' },
      { name: 'Benefit Ramp', description: 'Realization as SLA workflows are configured and tuned', defaultValue: '85%', inputType: 'ramp' },
    ],
    exampleCalculation: {
      inputs: { 'SLA-Bound Tickets': '40,000', 'Breach Rate': '12%', 'Reduction in Breaches': '40%', 'Cost per Breach': '$150', 'Benefit Ramp': '85%' },
      result: '$244,800',
      narrative: '40,000 SLA tickets × 12% breach rate = 4,800 breaches/year. Reducing by 40% = 1,920 fewer breaches. At $150/breach × 85% ramp = $244,800 in avoided penalties and revenue protection. Beyond the dollar value, SLA performance directly impacts customer satisfaction scores and contract renewals.',
    },
    whyItWorks: 'Most SLA breaches don\'t happen because the issue is hard — they happen because the ticket sat too long before someone noticed it was approaching deadline. Ivanti ITSM\'s real-time SLA engine monitors every ticket against its target, auto-escalates at configurable thresholds (e.g., 75% of SLA elapsed), and can re-route to available analysts or managers. The breach is prevented before it happens, not reported after the fact.',
    dataPoints: [
      'TSIA: Average SLA attainment across IT organizations is 85-90%; best-in-class exceeds 97%',
      'HDI: SLA breach is the #1 driver of customer dissatisfaction with IT service',
      'Ivanti: Customers report 30-50% reduction in SLA breaches within first quarter of ITSM deployment',
      'Forrester: Automated SLA management reduces manual monitoring effort by 60%+',
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function CopyBtn({ text }: { text: string }) {
  const [c, setC] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 2000); }}
      className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${c ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
      {c ? <Check size={12} /> : <Copy size={12} />} {c ? 'Copied' : 'Copy'}
    </button>
  );
}

const factorIcons: Record<string, React.ReactNode> = {
  'customer-metric': <Users size={12} className="text-blue-500" />,
  'improvement-factor': <TrendingUp size={12} className="text-green-500" />,
  'financial-factor': <DollarSign size={12} className="text-amber-500" />,
  'ramp': <Settings size={12} className="text-gray-400" />,
};

const factorColors: Record<string, string> = {
  'customer-metric': 'bg-blue-50 border-blue-100 text-blue-700',
  'improvement-factor': 'bg-green-50 border-green-100 text-green-700',
  'financial-factor': 'bg-amber-50 border-amber-100 text-amber-700',
  'ramp': 'bg-gray-50 border-gray-100 text-gray-600',
};

const factorLabels: Record<string, string> = {
  'customer-metric': 'Customer Metric',
  'improvement-factor': 'Improvement Factor',
  'financial-factor': 'Financial Factor',
  'ramp': 'Benefit Ramp',
};

function BenefitCard({ benefit }: { benefit: Benefit }) {
  const [expanded, setExpanded] = useState(false);

  const fullFormula = `${benefit.benefitName}\n\nFormula: ${benefit.formula}\n\nFactors:\n${benefit.formulaFactors.map(f => `• ${f.name}: ${f.description}${f.defaultValue ? ` (Default: ${f.defaultValue})` : ''}`).join('\n')}\n\nExample:\n${benefit.exampleCalculation.narrative}`;

  return (
    <div className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${expanded ? 'border-purple-200 shadow-md' : 'border-gray-200 hover:shadow-md'}`}>
      <button onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              benefit.category === 'financial' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {benefit.category === 'financial' ? '💰 Financial' : '⏱️ Time Savings'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">{benefit.subcategory}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{benefit.product}</span>
          </div>
          <h3 className="text-base font-bold text-gray-900">{benefit.benefitName}</h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{benefit.description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">{benefit.exampleCalculation.result}</div>
            <div className="text-[9px] text-gray-400">example annual value</div>
          </div>
          {expanded ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-5 border-t border-gray-100 pt-5">
          {/* Formula */}
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-purple-700 flex items-center gap-1.5"><Calculator size={14} /> Value Cloud Formula</h4>
              <CopyBtn text={benefit.formula} />
            </div>
            <p className="text-sm font-mono text-purple-800 leading-relaxed">{benefit.formula}</p>
          </div>

          {/* Formula Factors */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Formula Factors</h4>
            <div className="space-y-2">
              {benefit.formulaFactors.map((f, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${factorColors[f.inputType]}`}>
                  <div className="mt-0.5">{factorIcons[f.inputType]}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{f.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/60 uppercase font-medium">{factorLabels[f.inputType]}</span>
                    </div>
                    <p className="text-xs opacity-80 mt-0.5">{f.description}</p>
                    {f.defaultValue && <p className="text-xs font-medium mt-1">Default: {f.defaultValue}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Example Calculation */}
          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-green-700 mb-3 flex items-center gap-1.5"><DollarSign size={14} /> Example Calculation</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {Object.entries(benefit.exampleCalculation.inputs).map(([k, v]) => (
                <div key={k} className="bg-white border border-green-200 rounded-lg px-3 py-1.5">
                  <div className="text-[9px] text-green-600 uppercase">{k}</div>
                  <div className="text-sm font-bold text-green-800">{v}</div>
                </div>
              ))}
            </div>
            <div className="bg-white border border-green-200 rounded-lg p-3 mb-3 text-center">
              <div className="text-2xl font-bold text-green-600">{benefit.exampleCalculation.result}</div>
              <div className="text-xs text-green-500">Annual Benefit Value</div>
            </div>
            <p className="text-xs text-green-700 leading-relaxed">{benefit.exampleCalculation.narrative}</p>
          </div>

          {/* Why It Works */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1.5"><Zap size={14} /> Why This Works</h4>
            <p className="text-xs text-amber-800 leading-relaxed">{benefit.whyItWorks}</p>
          </div>

          {/* Data Points */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><HelpCircle size={12} /> Supporting Data & Benchmarks</h4>
            <div className="space-y-1.5">
              {benefit.dataPoints.map((dp, i) => (
                <div key={i} className="text-xs text-gray-600 flex items-start gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                  <span className="text-purple-400 font-mono text-[10px] mt-0.5">📊</span> {dp}
                </div>
              ))}
            </div>
          </div>

          {/* Copy Full Benefit */}
          <div className="pt-2 border-t border-gray-100 flex justify-end">
            <CopyBtn text={fullFormula} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN VIEW
   ═══════════════════════════════════════════════════════════════ */

export default function BenefitBuilderView() {
  const totalValue = benefits.reduce((sum, b) => {
    const val = parseInt(b.exampleCalculation.result.replace(/[$,]/g, ''));
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">🧮 Value Cloud Benefit Builder</h2>
            <p className="text-xs text-gray-500 mt-1">Craft and validate ROI benefits for each Ivanti solution — structured for Value Cloud import</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Combined Example Value</div>
            <div className="text-xl font-bold text-green-600">${totalValue.toLocaleString()}</div>
            <div className="text-[9px] text-gray-400">across {benefits.length} benefits</div>
          </div>
        </div>
      </div>

      {/* Solution Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="text-xs text-gray-400 font-medium">ITSM Benefits:</div>
        <div className="flex gap-2">
          {['financial', 'time-savings'].map(cat => {
            const count = benefits.filter(b => b.category === cat).length;
            return (
              <span key={cat} className={`text-xs px-2.5 py-1 rounded-full ${cat === 'financial' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {cat === 'financial' ? '💰' : '⏱️'} {count} {cat}
              </span>
            );
          })}
        </div>
      </div>

      {/* Factor Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-[10px] text-gray-400 font-semibold uppercase">Factor Types:</span>
        {Object.entries(factorLabels).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1">
            {factorIcons[key]}
            <span className="text-[10px] text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Benefit Cards */}
      <div className="space-y-4">
        {benefits.map(b => <BenefitCard key={b.id} benefit={b} />)}
      </div>

      {/* Summary Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-4">📊 ITSM Benefits Summary</h3>
        <div className="space-y-2">
          {benefits.map(b => (
            <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${b.category === 'financial' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {b.category === 'financial' ? '💰' : '⏱️'}
                </span>
                <span className="text-sm text-gray-700">{b.benefitName}</span>
              </div>
              <span className="text-sm font-bold text-green-600">{b.exampleCalculation.result}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-3 mt-2 border-t-2 border-gray-200">
            <span className="text-sm font-bold text-gray-900">Total Annual Value (Example)</span>
            <span className="text-lg font-bold text-green-600">${totalValue.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
