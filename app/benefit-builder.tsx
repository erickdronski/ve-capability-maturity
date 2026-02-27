'use client';

import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronRight, Calculator, DollarSign, Clock, TrendingUp, Users, Zap, Settings, HelpCircle, AlertCircle } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */

interface Factor {
  name: string;
  description: string;
  defaultValue?: string;
  type: 'driver' | 'improvement' | 'financial';
  easyToGet: string; // Where/how customer can find this
}

interface Benefit {
  id: string;
  benefitName: string;
  category: 'financial' | 'time-savings';
  subcategory: string;
  product: string;
  description: string;
  formula: string;
  drivers: Factor[];
  improvementFactor: Factor;
  financialFactor: Factor;
  exampleCalculation: {
    inputs: Record<string, string>;
    steps: string[];
    result: string;
    narrative: string;
  };
  whyItWorks: string;
  benchmarks: string[];
  inputTip: string; // Guidance on what NOT to ask for
}

/* ═══════════════════════════════════════════════════════════════
   ITSM BENEFITS DATA — Easy-to-share inputs only
   ═══════════════════════════════════════════════════════════════ */

const benefits: Benefit[] = [
  {
    id: 'itsm-self-service-deflection',
    benefitName: 'Self-Service Ticket Deflection',
    category: 'financial',
    subcategory: 'Labor Cost Avoidance',
    product: 'Neurons for ITSM',
    description: 'Employees resolve common IT issues themselves through a self-service portal — password resets, access requests, how-to questions — so tickets never reach the service desk. Each deflected ticket saves analyst labor time.',
    formula: 'IT Service Desk FTEs × Annual Salary × (Deflection Rate ÷ 100)',
    drivers: [
      { name: 'IT Service Desk FTEs', description: 'Number of full-time service desk analysts (L1 support staff)', type: 'driver', easyToGet: 'Every IT manager knows their headcount. Just ask "How many people work your service desk?"' },
      { name: 'Average IT Analyst Salary', description: 'Average annual salary for a service desk analyst (pre-benefits)', type: 'driver', defaultValue: '$55,000', easyToGet: 'Non-sensitive — industry average is fine. Most orgs share this freely or you can use the Glassdoor average for their region.' },
    ],
    improvementFactor: { name: 'Self-Service Deflection Rate', description: 'Percentage of analyst capacity freed up by self-service portal handling repetitive tickets', type: 'improvement', defaultValue: '15%', easyToGet: 'This is our benchmark default — no customer input needed' },
    financialFactor: { name: 'Loaded Cost Multiplier', description: 'Benefits & overhead multiplier applied to base salary (standard HR multiplier)', type: 'financial', defaultValue: '1.3x', easyToGet: 'Industry standard 30% burden rate — no need to ask the customer for this' },
    exampleCalculation: {
      inputs: { 'Service Desk FTEs': '12', 'Avg Analyst Salary': '$55,000', 'Loaded Multiplier': '1.3x', 'Deflection Rate': '15%' },
      steps: [
        '12 analysts × $55,000 salary = $660,000 total desk labor',
        '$660,000 × 1.3 loaded = $858,000 fully-loaded labor cost',
        '$858,000 × 15% deflection = $128,700 in freed capacity',
      ],
      result: '$128,700',
      narrative: 'With 12 service desk analysts, self-service deflects 15% of their workload — the equivalent of almost 2 FTEs worth of repetitive ticket handling. That capacity gets redirected to higher-value work or absorbed as the org scales without adding headcount.',
    },
    whyItWorks: 'Industry data shows 20-40% of service desk tickets are repetitive (password resets, VPN help, access requests). The self-service portal with knowledge base handles these at the front door. We use a conservative 15% — mature deployments see 25-35%.',
    benchmarks: [
      'HDI: 20-30% of all service desk contacts are password resets alone',
      'Gartner: Mature self-service portals achieve 30-40% ticket deflection',
      'Forrester: Self-service costs $2 per resolution vs $22 analyst-handled',
    ],
    inputTip: '✅ Just need: headcount + salary range. Both are non-sensitive and every manager knows them instantly.',
  },
  {
    id: 'itsm-automated-onboarding',
    benefitName: 'Automated Employee Onboarding',
    category: 'time-savings',
    subcategory: 'Process Automation',
    product: 'Neurons for ITSM',
    description: 'ITSM automates the new hire provisioning workflow — account creation, hardware assignment, software deployment, access grants — turning days of manual coordination into a same-day automated process.',
    formula: 'Total Employees × Annual Turnover Rate × Hours Saved per Onboard × Hourly Rate',
    drivers: [
      { name: 'Total Employees', description: 'Approximate number of employees in the organization', type: 'driver', easyToGet: 'Public info for most companies — on their website, LinkedIn, or annual report.' },
      { name: 'Annual Turnover Rate', description: 'Percentage of workforce that turns over annually (new hires + replacements)', type: 'driver', defaultValue: '15%', easyToGet: 'Use industry average if they don\'t share. 15% is the US average across industries (BLS data).' },
    ],
    improvementFactor: { name: 'IT Hours Saved per Onboard', description: 'Manual IT provisioning hours eliminated per new hire through workflow automation', type: 'improvement', defaultValue: '4 hours', easyToGet: 'Our benchmark — no customer input needed. Based on Samanage research (4-8 hrs manual per onboard).' },
    financialFactor: { name: 'Loaded IT Hourly Rate', description: 'Fully-loaded hourly cost derived from analyst salary', type: 'financial', defaultValue: '$45/hr', easyToGet: 'Derived from salary input: $55K ÷ 2,080 hours × 1.3 loaded ≈ $34. Use $45 as conservative IT rate.' },
    exampleCalculation: {
      inputs: { 'Total Employees': '5,000', 'Turnover Rate': '15%', 'Hours Saved': '4 hrs', 'Hourly Rate': '$45/hr' },
      steps: [
        '5,000 employees × 15% turnover = 750 new hires/year',
        '750 hires × 4 hours saved each = 3,000 hours recovered',
        '3,000 hours × $45/hr = $135,000 in labor savings',
      ],
      result: '$135,000',
      narrative: 'With 750 new hires per year, automating the IT onboarding workflow saves 3,000 analyst hours — that\'s 1.5 FTEs worth of manual provisioning work redirected to strategic projects.',
    },
    whyItWorks: 'Manual onboarding involves 8-15 discrete tasks across IT teams: AD account, email, VPN, hardware, badges, distribution lists, software. Each is a handoff and a wait. ITSM orchestrates all of these from a single HR-triggered workflow — parallel execution, no dropped steps.',
    benchmarks: [
      'BLS: US average employee turnover is 15% across all industries',
      'Samanage: IT onboarding tasks average 4-8 hours of manual effort per hire',
      'Aberdeen: Automated onboarding = 54% greater new-hire productivity',
    ],
    inputTip: '✅ Just need: employee count (usually public) + turnover % (use industry default if needed). Zero sensitive data.',
  },
  {
    id: 'itsm-change-management',
    benefitName: 'Change Management Efficiency',
    category: 'financial',
    subcategory: 'IT Productivity Recovery',
    product: 'Neurons for ITSM',
    description: 'Structured change management workflows with risk scoring, CAB routing, and conflict detection reduce the time spent managing each change — fewer meetings, less manual coordination, faster approvals. IT teams recover hours previously spent on change administration.',
    formula: 'IT Staff Involved in Changes × Annual Salary × % Time Spent on Change Admin × Efficiency Gain',
    drivers: [
      { name: 'IT Staff Involved in Change Processes', description: 'Number of IT staff who participate in change management (submit, review, approve, implement)', type: 'driver', easyToGet: 'Ask: "How many people touch the change process?" Includes CAB members, implementers, approvers.' },
      { name: 'Average IT Staff Salary', description: 'Average salary across IT staff involved in changes (these are typically mid-senior)', type: 'driver', defaultValue: '$85,000', easyToGet: 'Non-sensitive. Use industry average for their region. These are typically sysadmins/engineers, not L1.' },
    ],
    improvementFactor: { name: 'Change Admin Efficiency Gain', description: 'Reduction in time spent on change coordination — automated routing, risk scoring, and digital CAB replace manual spreadsheets and emails', type: 'improvement', defaultValue: '25%', easyToGet: 'Our benchmark — based on replacing manual change tracking with structured workflows.' },
    financialFactor: { name: '% Time on Change Administration', description: 'Portion of work week spent on change-related tasks (planning, CAB prep, approvals, documentation)', type: 'financial', defaultValue: '20%', easyToGet: 'Ask: "Roughly what percentage of your team\'s time goes to change management?" Most say 15-25%.' },
    exampleCalculation: {
      inputs: { 'IT Staff in Changes': '20', 'Avg Salary': '$85,000', 'Time on Change Admin': '20%', 'Efficiency Gain': '25%' },
      steps: [
        '20 staff × $85,000 = $1,700,000 total labor',
        '$1,700,000 × 20% on change admin = $340,000 spent on change work',
        '$340,000 × 25% efficiency gain = $85,000 in recovered productivity',
      ],
      result: '$85,000',
      narrative: 'With 20 IT staff spending ~20% of their time on change management, a 25% efficiency improvement recovers $85,000 worth of labor annually. That\'s one person\'s entire year of change admin work eliminated through automation.',
    },
    whyItWorks: 'Manual change management means spreadsheets, email chains, calendar coordination for CAB meetings, and manual risk assessment. ITSM digitizes all of this: auto-classification, risk scoring, conflict calendars, digital approvals, and automated implementation tracking. Less admin, more doing.',
    benchmarks: [
      'Forrester: IT teams spend 15-25% of time on change management processes',
      'DORA: Automated change approval correlates with 3x deployment frequency',
      'ITIL 4: Streamlined change enablement reduces admin overhead by 20-40%',
    ],
    inputTip: '✅ Just need: how many people touch changes + their avg salary level. No outage data, no breach info, no failure rates required.',
  },
  {
    id: 'itsm-analyst-productivity',
    benefitName: 'Analyst Productivity — Faster Ticket Resolution',
    category: 'financial',
    subcategory: 'Operational Efficiency',
    product: 'Neurons for ITSM',
    description: 'ITSM gives analysts a unified workspace with AI-powered knowledge suggestions, quick actions, automated categorization, and contextual data. Analysts spend less time searching and more time resolving — handling more tickets per shift without rushing.',
    formula: 'Service Desk FTEs × Annual Salary × Loaded Multiplier × Productivity Improvement %',
    drivers: [
      { name: 'Service Desk FTEs', description: 'Number of full-time service desk analysts', type: 'driver', easyToGet: 'Same headcount from Benefit 1 — already captured.' },
      { name: 'Average Analyst Salary', description: 'Average annual salary for service desk analysts', type: 'driver', defaultValue: '$55,000', easyToGet: 'Non-sensitive, usually already captured. Use regional Glassdoor average.' },
    ],
    improvementFactor: { name: 'Analyst Productivity Improvement', description: 'Percentage improvement in ticket throughput from AI suggestions, quick actions, and automated categorization', type: 'improvement', defaultValue: '12%', easyToGet: 'Our benchmark — conservative estimate based on Ivanti customer outcomes.' },
    financialFactor: { name: 'Loaded Cost Multiplier', description: 'Standard benefits & overhead multiplier', type: 'financial', defaultValue: '1.3x', easyToGet: 'Industry standard — no customer input needed.' },
    exampleCalculation: {
      inputs: { 'Service Desk FTEs': '12', 'Avg Salary': '$55,000', 'Loaded': '1.3x', 'Productivity Gain': '12%' },
      steps: [
        '12 FTEs × $55,000 = $660,000 total desk labor',
        '$660,000 × 1.3 loaded = $858,000 fully-loaded cost',
        '$858,000 × 12% productivity improvement = $102,960',
      ],
      result: '$102,960',
      narrative: 'Each analyst becomes 12% more productive through better tools — AI suggestions, auto-categorization, quick actions. Across 12 analysts, that\'s the equivalent of 1.4 additional FTEs of output without adding headcount.',
    },
    whyItWorks: 'Analysts waste time on context-switching: searching KB, categorizing tickets, looking up asset info, copying data between screens. ITSM\'s unified workspace puts everything in one view. AI suggests knowledge articles and categories. Quick actions automate repetitive steps. The result: analysts handle more tickets per hour at higher quality.',
    benchmarks: [
      'HDI: Average ticket handle time is 18-24 minutes; best-in-class is 12-15 min',
      'Ivanti: Customers report 10-20% improvement in analyst throughput post-deployment',
      'MetricNet: Analyst utilization in high-performing desks exceeds 85% vs 65% average',
    ],
    inputTip: '✅ Reuses headcount + salary already captured. Only 2 inputs needed and you likely have them both.',
  },
  {
    id: 'itsm-service-catalog-acceleration',
    benefitName: 'Service Catalog Request Automation',
    category: 'time-savings',
    subcategory: 'Request Fulfillment',
    product: 'Neurons for ITSM',
    description: 'Standard service requests — software installs, access grants, hardware orders, distribution list changes — are fulfilled automatically via pre-built catalog workflows instead of manual analyst processing. The request itself becomes the execution.',
    formula: 'Total Employees × Avg Service Requests per Employee/Year × Minutes Saved per Request × Hourly Rate ÷ 60',
    drivers: [
      { name: 'Total Employees', description: 'Number of employees who submit IT requests', type: 'driver', easyToGet: 'Already captured — employee count from company info.' },
      { name: 'Avg Service Requests per Employee/Year', description: 'How many IT service requests does an average employee submit annually', type: 'driver', defaultValue: '6', easyToGet: 'Ask: "Roughly how many IT requests does a typical employee submit per year?" Most say 4-8. Default 6 is industry avg.' },
    ],
    improvementFactor: { name: 'Minutes Saved per Automated Request', description: 'Analyst time saved per request when fulfilled via automated catalog workflow vs manual processing', type: 'improvement', defaultValue: '15 min', easyToGet: 'Our benchmark — based on eliminating manual triage, routing, and fulfillment steps.' },
    financialFactor: { name: 'Loaded IT Hourly Rate', description: 'Fully-loaded hourly cost of analyst time', type: 'financial', defaultValue: '$45/hr', easyToGet: 'Derived from salary — already calculated.' },
    exampleCalculation: {
      inputs: { 'Total Employees': '5,000', 'Requests/Employee/Year': '6', 'Minutes Saved': '15 min', 'Hourly Rate': '$45/hr' },
      steps: [
        '5,000 employees × 6 requests/year = 30,000 service requests annually',
        '30,000 × 15 minutes saved = 450,000 minutes = 7,500 hours recovered',
        '7,500 hours × $45/hr = $337,500 in labor cost savings',
      ],
      result: '$337,500',
      narrative: 'Automating standard service requests across 5,000 employees saves 7,500 analyst hours per year — that\'s 3.6 FTEs worth of manual request fulfillment. Software installs, access grants, and hardware requests just happen automatically.',
    },
    whyItWorks: 'Most IT requests follow a predictable pattern: employee requests something, analyst triages, routes, and manually fulfills. With a service catalog, the request IS the workflow — pre-approved items auto-provision, conditional approvals route digitally, and fulfillment scripts execute automatically. The analyst is removed from the loop entirely for standard requests.',
    benchmarks: [
      'ServiceNow/HDI: Average employee submits 4-8 IT requests per year',
      'Forrester: Automated request fulfillment reduces processing time by 60-80%',
      'MetricNet: Manual request fulfillment averages 20-30 minutes of analyst time per request',
    ],
    inputTip: '✅ Just need: employee count (public) + rough requests per person (most managers estimate easily). No ticket data or system access needed.',
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

const typeColors: Record<string, { bg: string; border: string; text: string; icon: React.ReactNode; label: string }> = {
  driver: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', icon: <Users size={14} className="text-blue-500" />, label: 'Driver Factor' },
  improvement: { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-700', icon: <TrendingUp size={14} className="text-green-500" />, label: 'Improvement Factor' },
  financial: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', icon: <DollarSign size={14} className="text-amber-500" />, label: 'Financial Factor' },
};

function FactorRow({ factor }: { factor: Factor }) {
  const style = typeColors[factor.type];
  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-3`}>
      <div className="flex items-center gap-2 mb-1">
        {style.icon}
        <span className={`text-sm font-semibold ${style.text}`}>{factor.name}</span>
        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${style.bg} ${style.text} border ${style.border} font-medium uppercase`}>{style.label}</span>
        {factor.defaultValue && <span className="text-xs text-gray-500 ml-auto">Default: <strong>{factor.defaultValue}</strong></span>}
      </div>
      <p className="text-xs text-gray-600 mt-0.5">{factor.description}</p>
      <div className="flex items-start gap-1.5 mt-2 bg-white/60 rounded px-2 py-1.5">
        <AlertCircle size={11} className="text-gray-400 mt-0.5 flex-shrink-0" />
        <p className="text-[10px] text-gray-500 leading-relaxed">{factor.easyToGet}</p>
      </div>
    </div>
  );
}

function BenefitCard({ benefit }: { benefit: Benefit }) {
  const [expanded, setExpanded] = useState(false);

  const fullText = `${benefit.benefitName}\n\nFormula: ${benefit.formula}\n\nDrivers:\n${benefit.drivers.map(d => `• ${d.name}: ${d.description}${d.defaultValue ? ` (Default: ${d.defaultValue})` : ''}`).join('\n')}\n\nImprovement Factor:\n• ${benefit.improvementFactor.name}: ${benefit.improvementFactor.description} (Default: ${benefit.improvementFactor.defaultValue})\n\nFinancial Factor:\n• ${benefit.financialFactor.name}: ${benefit.financialFactor.description} (Default: ${benefit.financialFactor.defaultValue})\n\nExample:\n${benefit.exampleCalculation.steps.join('\n')}\nResult: ${benefit.exampleCalculation.result}\n\n${benefit.exampleCalculation.narrative}`;

  return (
    <div className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${expanded ? 'border-purple-200 shadow-md' : 'border-gray-200 hover:shadow-md hover:border-gray-300'}`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left p-5 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${benefit.category === 'financial' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
              {benefit.category === 'financial' ? '💰 Financial' : '⏱️ Time Savings'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">{benefit.subcategory}</span>
          </div>
          <h3 className="text-base font-bold text-gray-900">{benefit.benefitName}</h3>
          <p className="text-xs text-gray-500 mt-1">{benefit.description}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-[10px] text-gray-400 flex items-center gap-1"><Users size={10} /> {benefit.drivers.length} driver{benefit.drivers.length > 1 ? 's' : ''}</span>
            <span className="text-[10px] text-gray-400 flex items-center gap-1"><TrendingUp size={10} /> 1 improvement</span>
            <span className="text-[10px] text-gray-400 flex items-center gap-1"><DollarSign size={10} /> 1 financial</span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <div className="text-xl font-bold text-green-600">{benefit.exampleCalculation.result}</div>
            <div className="text-[9px] text-gray-400">example annual value</div>
          </div>
          {expanded ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-5 border-t border-gray-100 pt-5">
          {/* Input Tip */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start gap-2">
            <Check size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-emerald-700">{benefit.inputTip}</p>
          </div>

          {/* Formula */}
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-purple-700 flex items-center gap-1.5"><Calculator size={14} /> Formula</h4>
              <CopyBtn text={benefit.formula} />
            </div>
            <p className="text-sm font-mono text-purple-800 leading-relaxed">{benefit.formula}</p>
          </div>

          {/* Driver Factors */}
          <div>
            <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Users size={14} /> Driver Factors — What the customer provides
            </h4>
            <div className="space-y-2">
              {benefit.drivers.map((d, i) => <FactorRow key={i} factor={d} />)}
            </div>
          </div>

          {/* Improvement Factor */}
          <div>
            <h4 className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <TrendingUp size={14} /> Improvement Factor — What ITSM delivers
            </h4>
            <FactorRow factor={benefit.improvementFactor} />
          </div>

          {/* Financial Factor */}
          <div>
            <h4 className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <DollarSign size={14} /> Financial Factor — How we monetize
            </h4>
            <FactorRow factor={benefit.financialFactor} />
          </div>

          {/* Example Calculation */}
          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-green-700 mb-3 flex items-center gap-1.5"><Calculator size={14} /> Example Calculation</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {Object.entries(benefit.exampleCalculation.inputs).map(([k, v]) => (
                <div key={k} className="bg-white border border-green-200 rounded-lg px-3 py-1.5">
                  <div className="text-[9px] text-green-600 uppercase">{k}</div>
                  <div className="text-sm font-bold text-green-800">{v}</div>
                </div>
              ))}
            </div>
            <div className="space-y-1.5 mb-3">
              {benefit.exampleCalculation.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-green-700">
                  <span className="font-mono text-green-500 mt-0.5">{i + 1}.</span> {step}
                </div>
              ))}
            </div>
            <div className="bg-white border border-green-200 rounded-lg p-3 text-center mb-3">
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

          {/* Benchmarks */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><HelpCircle size={12} /> Industry Benchmarks</h4>
            <div className="space-y-1.5">
              {benefit.benchmarks.map((b, i) => (
                <div key={i} className="text-xs text-gray-600 flex items-start gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                  <span className="text-purple-400 text-[10px] mt-0.5">📊</span> {b}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex justify-end">
            <CopyBtn text={fullText} />
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

  const customerInputs = [
    { metric: 'Total Employees', source: 'Public (website, LinkedIn)', sensitivity: '🟢 None' },
    { metric: 'IT Service Desk FTEs', source: 'Ask the customer', sensitivity: '🟢 None' },
    { metric: 'Avg IT Analyst Salary', source: 'Glassdoor / regional avg', sensitivity: '🟡 Low — use default' },
    { metric: 'Annual Turnover Rate', source: 'BLS industry average (15%)', sensitivity: '🟢 None — use default' },
    { metric: 'IT Staff in Change Process', source: 'Ask the customer', sensitivity: '🟢 None' },
    { metric: 'Requests per Employee/Year', source: 'Ask or use default (6)', sensitivity: '🟢 None' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">🧮 Value Cloud Benefit Builder — ITSM</h2>
            <p className="text-xs text-gray-500 mt-1">5 benefits using easy-to-share customer inputs · Driver → Improvement → Financial factor structure</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Combined Example Value</div>
            <div className="text-xl font-bold text-green-600">${totalValue.toLocaleString()}</div>
            <div className="text-[9px] text-gray-400">across {benefits.length} benefits</div>
          </div>
        </div>
      </div>

      {/* Customer Input Requirements */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
        <h3 className="text-sm font-bold text-emerald-800 mb-3">✅ What You Need From the Customer</h3>
        <p className="text-xs text-emerald-700 mb-3">These 5 benefits only require <strong>6 simple metrics</strong> — all non-sensitive, easily accessible, or defaulted from industry benchmarks.</p>
        <div className="grid grid-cols-3 gap-2">
          {customerInputs.map((ci, i) => (
            <div key={i} className="bg-white border border-emerald-100 rounded-lg px-3 py-2">
              <div className="text-xs font-semibold text-gray-800">{ci.metric}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{ci.source}</div>
              <div className="text-[10px] mt-1">{ci.sensitivity}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Factor Legend */}
      <div className="flex items-center gap-4 flex-wrap bg-white border border-gray-200 rounded-lg px-4 py-3">
        <span className="text-[10px] text-gray-400 font-semibold uppercase">Factor Types:</span>
        {Object.entries(typeColors).map(([key, style]) => (
          <div key={key} className="flex items-center gap-1.5">
            {style.icon}
            <span className="text-[10px] text-gray-600 font-medium">{style.label}</span>
          </div>
        ))}
      </div>

      {/* Benefit Cards */}
      <div className="space-y-4">
        {benefits.map(b => <BenefitCard key={b.id} benefit={b} />)}
      </div>

      {/* Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-4">📊 ITSM Benefits ROI Summary</h3>
        <div className="space-y-2">
          {benefits.map(b => (
            <div key={b.id} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${b.category === 'financial' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {b.category === 'financial' ? '💰' : '⏱️'}
                </span>
                <span className="text-sm text-gray-700">{b.benefitName}</span>
              </div>
              <span className="text-sm font-bold text-green-600">{b.exampleCalculation.result}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-3 mt-2 border-t-2 border-gray-200">
            <span className="text-sm font-bold text-gray-900">Total Annual ITSM Benefits (Example)</span>
            <span className="text-xl font-bold text-green-600">${totalValue.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
