'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight, Package, Shield, Monitor, Server, Cloud, Box, Users, HelpCircle, Key, Layers } from 'lucide-react';

type ProductType = 'saas' | 'on-prem' | 'hybrid' | 'add-on' | 'package';
type Category = 'ESM' | 'UEM' | 'Security';

interface Product {
  name: string;
  shortDescription: string;
  category: Category;
  type: ProductType;
  keyCapabilities: string[];
  targetAudience: string;
  discoveryQuestions: string[];
  licensing: string;
}

const products: Product[] = [
  // ── ESM Products (11) ──
  { name: 'Ivanti Neurons for ITSM', shortDescription: 'Core ITSM platform, ITIL-verified. Incident, Problem, Change, Service Catalog, CMDB, Knowledge.', category: 'ESM', type: 'saas', keyCapabilities: ['ITIL-verified Incident, Problem, Change management', 'Service Catalog with self-service portal', 'CMDB with auto-discovery integration', 'Knowledge Management with AI-assisted articles', 'SLA management and reporting dashboards', 'Workflow automation and approvals'], targetAudience: 'IT Service Desk managers, CIOs, ITSM process owners at mid-to-large enterprises', discoveryQuestions: ['What ITSM tool are you currently using and what are the biggest pain points?', 'How many IT analysts handle service requests today?', 'Are you looking to consolidate ITSM tools or replace a legacy system?'], licensing: 'Per analyst (named user). Tiered by module bundle.' },
  { name: 'Ivanti Neurons for ITAM', shortDescription: 'IT Asset Management: HW, SW, Cloud tracking, lifecycle, contracts.', category: 'ESM', type: 'saas', keyCapabilities: ['Hardware, software, and cloud asset tracking', 'Software license compliance and optimization', 'Contract and vendor management', 'Asset lifecycle management from procurement to disposal', 'Integration with ITSM CMDB'], targetAudience: 'IT Asset Managers, Procurement teams, CFOs concerned with software spend', discoveryQuestions: ['How do you currently track hardware and software assets?', 'Have you faced software audit compliance challenges?', 'What is your estimated annual software spend?'], licensing: 'Base = 10K assets + 15 users. Additional asset packs available.' },
  { name: 'Ivanti Neurons for ITSM Line of Business', shortDescription: 'Extends ITSM to HR, Facilities, GRC, Security Ops, PPM.', category: 'ESM', type: 'saas', keyCapabilities: ['HR Service Management with onboarding/offboarding workflows', 'Facilities management and work orders', 'GRC (Governance, Risk, Compliance) tracking', 'Security Operations integration', 'Project Portfolio Management (PPM)'], targetAudience: 'HR Directors, Facilities Managers, CISO offices, PMOs wanting unified service management', discoveryQuestions: ['Which departments beyond IT are handling service requests manually?', 'Are HR onboarding/offboarding processes automated today?', 'Do you have separate tools for facilities, GRC, or project management?'], licensing: 'Add-on to ITSM. Per analyst or per department module.' },
  { name: 'Ivanti Neurons for Service Mapping', shortDescription: 'Auto-discovers data center dependencies, visual service maps.', category: 'ESM', type: 'saas', keyCapabilities: ['Automatic discovery of data center dependencies', 'Visual service topology maps', 'Impact analysis for change management', 'Integration with CMDB for real-time accuracy', 'Supports hybrid cloud environments'], targetAudience: 'IT Operations, Change Managers, infrastructure teams needing visibility into service dependencies', discoveryQuestions: ['Do you have visibility into how infrastructure components relate to business services?', 'How do you assess change impact today?', 'Are you managing hybrid or multi-cloud environments?'], licensing: 'Per node/device discovered. Volume tiers available.' },
  { name: 'Ivanti Neurons iPaaS', shortDescription: 'Integration platform (Workato-based), 1000+ connectors, no-code.', category: 'ESM', type: 'saas', keyCapabilities: ['1000+ pre-built connectors (ServiceNow, Salesforce, SAP, etc.)', 'No-code/low-code recipe builder', 'Bi-directional data sync', 'Event-driven automation workflows', 'Enterprise-grade security and governance'], targetAudience: 'IT integration teams, digital transformation leads, organizations with complex tool ecosystems', discoveryQuestions: ['How many different systems need to exchange data with your ITSM platform?', 'Do you have dedicated integration developers or need no-code options?', 'What are the most critical integrations you need today?'], licensing: 'Per recipe/connection. Tiered by volume of transactions.' },
  { name: 'Ivanti Intelligence – AI for ITSM Analyst', shortDescription: 'Ticket classification, incident summarization, KB article generation.', category: 'ESM', type: 'saas', keyCapabilities: ['AI-powered ticket classification and routing', 'Automatic incident summarization', 'KB article generation from resolved tickets', 'Sentiment analysis on tickets', 'Predictive analytics for incident trends'], targetAudience: 'IT Service Desk leads wanting to reduce manual triage and improve knowledge capture', discoveryQuestions: ['How much time do analysts spend classifying and routing tickets?', 'Is your knowledge base up to date and widely used?', 'Are you interested in AI-driven insights on service desk performance?'], licensing: 'Add-on to ITSM. Per analyst seat.' },
  { name: 'Ivanti Neurons Digital Assistant', shortDescription: 'Conversational AI virtual support agent (NLP/ML).', category: 'ESM', type: 'saas', keyCapabilities: ['Natural language processing for user queries', 'Self-service automation (password resets, access requests)', 'Integration with ITSM for ticket creation', 'Multi-channel support (Teams, Slack, web portal)', 'Continuous learning from interactions'], targetAudience: 'Organizations wanting to deflect L1 tickets and provide 24/7 self-service support', discoveryQuestions: ['What percentage of your tickets are repetitive L1 requests?', 'Do employees have self-service options today?', 'Which collaboration platforms (Teams, Slack) are used internally?'], licensing: 'Per user or per conversation volume. Annual subscription.' },
  { name: 'Ivanti Voice', shortDescription: 'Phone/ITSM integration, call routing, voice self-service.', category: 'ESM', type: 'on-prem', keyCapabilities: ['Phone system integration with ITSM', 'Intelligent call routing based on ticket data', 'Voice-based self-service IVR', 'Screen pop with caller context', 'Call recording and analytics'], targetAudience: 'Service desks with high call volumes needing phone-ITSM integration', discoveryQuestions: ['How many calls does your service desk handle daily?', 'Is your phone system integrated with your ITSM tool?', 'Do you offer any voice-based self-service options today?'], licensing: 'Per concurrent agent seat. On-premises deployment.' },
  { name: 'ITSM Professional Package', shortDescription: 'Core ITSM + ITAM + Discovery bundle.', category: 'ESM', type: 'package', keyCapabilities: ['Full ITSM suite (Incident, Problem, Change, Service Catalog)', 'IT Asset Management included', 'Discovery for network and device scanning', 'Bundled at reduced cost vs. individual modules', 'Ideal starting point for new customers'], targetAudience: 'Organizations starting their ITSM journey or replacing legacy tools, needing core capabilities', discoveryQuestions: ['Are you looking for a bundled solution to cover ITSM, assets, and discovery?', 'Is cost consolidation a driver for this evaluation?'], licensing: 'Bundle pricing per analyst. Includes ITSM + ITAM + Discovery.' },
  { name: 'ITSM Enterprise Package', shortDescription: 'Professional + HR, Facilities, PPM, GRC, Security Ops.', category: 'ESM', type: 'package', keyCapabilities: ['Everything in Professional Package', 'HR Service Management', 'Facilities Management', 'Project Portfolio Management', 'GRC and Security Operations modules'], targetAudience: 'Large enterprises wanting to extend service management across multiple departments', discoveryQuestions: ['Are multiple departments requesting a unified service management platform?', 'Do you need GRC or security operations capabilities integrated with ITSM?', 'How many departments would use the platform beyond IT?'], licensing: 'Bundle pricing per analyst. Includes all Professional + LoB modules.' },
  { name: 'ITSM Premium Package', shortDescription: 'Professional + AI-guided ITSM, self-healing, DEX.', category: 'ESM', type: 'package', keyCapabilities: ['Everything in Professional Package', 'AI-guided ITSM (Intelligence module)', 'Self-healing automation (Neurons for Healing)', 'Digital Employee Experience (DEX) scoring', 'Digital Assistant for self-service'], targetAudience: 'Forward-thinking IT organizations wanting AI-driven service management and proactive operations', discoveryQuestions: ['Is AI and automation a strategic priority for your IT operations?', 'Are you measuring digital employee experience today?', 'Would proactive self-healing reduce your incident volume significantly?'], licensing: 'Bundle pricing per analyst. Includes Professional + AI + DEX + Healing.' },

  // ── UEM Products (14) ──
  { name: 'Secure UEM Professional', shortDescription: 'Discovery, AI healing, DEX, MDM, remote control.', category: 'UEM', type: 'package', keyCapabilities: ['Unified endpoint discovery and inventory', 'AI-powered self-healing automation', 'Digital Employee Experience (DEX) scoring', 'Mobile Device Management (MDM)', 'Remote control and troubleshooting'], targetAudience: 'IT Operations teams managing diverse endpoint estates who need unified visibility and control', discoveryQuestions: ['How many endpoints do you manage across desktops, laptops, and mobile?', 'Do you have separate tools for MDM and desktop management?', 'How do you currently handle remote troubleshooting?'], licensing: 'Per device managed. Tiered by volume.' },
  { name: 'Secure UEM Professional Plus', shortDescription: '+ Secure access, mobile apps, DLP.', category: 'UEM', type: 'package', keyCapabilities: ['Everything in UEM Professional', 'Secure access for mobile and remote workers', 'Mobile application management and distribution', 'Data Loss Prevention (DLP) policies', 'Per-app VPN and micro-tunneling'], targetAudience: 'Organizations with mobile workforce and BYOD programs needing secure access and data protection', discoveryQuestions: ['Do you support BYOD or have a significant mobile workforce?', 'How do you protect corporate data on personal devices?', 'Do you need per-app VPN or secure container capabilities?'], licensing: 'Per device managed. Includes Professional + secure access + DLP.' },
  { name: 'Secure UEM Premium', shortDescription: '+ Risk-based cloud patch management.', category: 'UEM', type: 'package', keyCapabilities: ['Everything in UEM Professional Plus', 'Cloud-native patch management', 'Risk-based patch prioritization', 'Third-party application patching', 'Compliance reporting and dashboards'], targetAudience: 'Security-conscious organizations needing integrated UEM with risk-based patch management', discoveryQuestions: ['Is patching a separate process from your endpoint management?', 'How do you prioritize which patches to deploy first?', 'Do you patch third-party applications consistently?'], licensing: 'Per device managed. Includes Professional Plus + cloud patch management.' },
  { name: 'Neurons for DEX', shortDescription: 'Digital Employee Experience: track/measure/optimize. Reduces escalations 80%.', category: 'UEM', type: 'saas', keyCapabilities: ['Real-time DEX scoring per device and user', 'Proactive issue detection before user impact', 'Automated remediation workflows', 'Employee sentiment surveys integration', 'Executive dashboards and trend analysis', 'Reduces escalations by up to 80%'], targetAudience: 'CIOs, Digital Workplace leaders, IT Operations teams focused on employee productivity', discoveryQuestions: ['How do you measure the digital experience of your employees today?', 'What percentage of IT issues are reported by users vs. detected proactively?', 'Is employee experience a board-level priority?'], licensing: 'Per device. Annual subscription.' },
  { name: 'Neurons for MDM', shortDescription: 'Mobile device management: Android, ChromeOS, iOS, macOS, Windows.', category: 'UEM', type: 'saas', keyCapabilities: ['Cross-platform MDM (Android, ChromeOS, iOS, macOS, Windows)', 'Zero-touch enrollment and provisioning', 'Policy enforcement and compliance checks', 'App distribution and management', 'Remote wipe and lock capabilities'], targetAudience: 'IT teams managing mobile and diverse OS endpoints, especially BYOD environments', discoveryQuestions: ['What mobile platforms do you need to manage?', 'Do you support zero-touch enrollment today?', 'How do you handle lost or stolen devices?'], licensing: 'Per device managed. Volume discounts available.' },
  { name: 'Neurons for Discovery', shortDescription: 'Real-time active/passive scanning, SW license tracking.', category: 'UEM', type: 'saas', keyCapabilities: ['Active and passive network scanning', 'Real-time device and software inventory', 'Software license usage tracking', 'Rogue device detection', 'Integration with CMDB and ITAM'], targetAudience: 'IT Asset Managers, Security teams needing complete visibility into network-connected devices', discoveryQuestions: ['Do you have full visibility into all devices on your network?', 'How often do you discover unknown or rogue devices?', 'Is software license tracking a compliance concern?'], licensing: 'Per device discovered. Tiered pricing.' },
  { name: 'Neurons for Healing', shortDescription: 'Low-code/no-code automation bots, self-healing endpoints.', category: 'UEM', type: 'saas', keyCapabilities: ['Low-code/no-code bot builder', 'Pre-built healing actions library', 'Automated remediation of common issues', 'Triggered by DEX scores or alerts', 'Reduces L1/L2 ticket volume significantly'], targetAudience: 'IT Operations teams wanting to automate repetitive remediation and reduce ticket volume', discoveryQuestions: ['What are the top 10 repetitive issues your service desk handles?', 'Do you have automation in place for endpoint remediation?', 'How much time do analysts spend on routine fixes?'], licensing: 'Per device. Can be bundled with DEX.' },
  { name: 'Neurons for Workspace', shortDescription: '360° analyst view, DEX scoring, remote control.', category: 'UEM', type: 'saas', keyCapabilities: ['Unified analyst console with 360° device view', 'Real-time DEX scoring and health indicators', 'Remote control and troubleshooting', 'Action history and audit trail', 'Integration with ITSM tickets'], targetAudience: 'Service Desk analysts and L2 support teams needing a single pane for endpoint management', discoveryQuestions: ['How many consoles do your analysts switch between?', 'Do analysts have real-time visibility into device health during troubleshooting?', 'Is remote control integrated with your ticketing system?'], licensing: 'Per analyst seat. Annual subscription.' },
  { name: 'Neurons for Healthcare', shortDescription: 'IoMT device security, patient safety.', category: 'UEM', type: 'saas', keyCapabilities: ['IoMT (Internet of Medical Things) device discovery', 'Medical device security posture assessment', 'Patient safety risk scoring', 'Integration with clinical engineering workflows', 'Compliance with HIPAA and FDA guidelines'], targetAudience: 'Healthcare IT and clinical engineering teams managing medical devices and IoMT security', discoveryQuestions: ['How many connected medical devices are on your network?', 'Do you have visibility into the security posture of IoMT devices?', 'Is medical device compliance (HIPAA, FDA) a challenge?'], licensing: 'Per medical device. Healthcare-specific pricing.' },
  { name: 'Ivanti EPM', shortDescription: 'Windows/Mac/Linux endpoint management, SW deployment, OS provisioning.', category: 'UEM', type: 'hybrid', keyCapabilities: ['Windows, Mac, and Linux endpoint management', 'Software deployment and distribution', 'OS provisioning and imaging', 'Patch management for OS and applications', 'Inventory and compliance reporting'], targetAudience: 'IT Operations teams with large desktop/laptop estates needing lifecycle management', discoveryQuestions: ['How do you currently deploy operating systems and software?', 'How many Windows, Mac, and Linux endpoints do you manage?', 'Is your current endpoint management tool on-prem or cloud?'], licensing: 'Per device managed. Perpetual or subscription.' },
  { name: 'Ivanti EPMM', shortDescription: 'On-prem MDM (formerly MobileIron Core).', category: 'UEM', type: 'on-prem', keyCapabilities: ['On-premises mobile device management', 'iOS, Android, and Windows mobile management', 'App distribution and containerization', 'Certificate-based authentication', 'Compliance enforcement and reporting'], targetAudience: 'Organizations requiring on-premises MDM for regulatory or data sovereignty reasons', discoveryQuestions: ['Do you have regulatory requirements mandating on-premises MDM?', 'Are you currently using MobileIron Core?', 'Is cloud MDM an option or is on-prem mandatory?'], licensing: 'Per device. Perpetual license with maintenance or subscription.' },
  { name: 'Ivanti User Workspace Manager', shortDescription: 'Environment Manager + App Control + Performance Manager suite.', category: 'UEM', type: 'on-prem', keyCapabilities: ['Environment Manager for user personalization', 'Application Control with Trusted Ownership', 'Performance Manager for resource optimization', 'User profile migration and roaming', 'VDI and DaaS optimization'], targetAudience: 'Organizations with VDI/DaaS deployments or complex Windows environments needing user workspace optimization', discoveryQuestions: ['Do you use VDI or Desktop-as-a-Service?', 'How do you manage user profiles and personalization across devices?', 'Is application whitelisting part of your security strategy?'], licensing: 'Per device or per user. Perpetual or subscription.' },
  { name: 'Ivanti Application Control', shortDescription: 'Allow/deny lists, privilege elevation, Trusted Owner tech.', category: 'UEM', type: 'on-prem', keyCapabilities: ['Application allow/deny listing', 'Trusted Ownership technology', 'Context-aware privilege elevation', 'Audit and compliance reporting', 'Ransomware prevention through execution control'], targetAudience: 'Security teams and IT admins needing application whitelisting and least-privilege enforcement', discoveryQuestions: ['Do you have application control or whitelisting in place today?', 'How do you handle privilege elevation requests?', 'Is ransomware prevention a key concern?'], licensing: 'Per device. Perpetual or subscription.' },
  { name: 'Ivanti Xtraction', shortDescription: 'Self-service real-time reporting/dashboards.', category: 'UEM', type: 'hybrid', keyCapabilities: ['Self-service dashboard builder', 'Real-time data from ITSM, UEM, and other sources', 'Pre-built report templates', 'Scheduled report delivery', 'Cross-platform data aggregation'], targetAudience: 'IT managers and executives needing consolidated reporting across Ivanti products', discoveryQuestions: ['How do you currently report on IT operations metrics?', 'Do you need a single dashboard across multiple Ivanti products?', 'Who are the primary consumers of IT reports?'], licensing: 'Per data source connection. Named user or concurrent user.' },

  // ── Security Products (13) ──
  { name: 'Zero Sign-On (ZSO)', shortDescription: 'Passwordless MFA, mobile-centric Zero Trust, biometrics.', category: 'Security', type: 'saas', keyCapabilities: ['Passwordless multi-factor authentication', 'Mobile-centric Zero Trust verification', 'Biometric authentication (face, fingerprint)', 'Device posture checks before access', 'Continuous risk assessment'], targetAudience: 'CISOs and Identity teams pursuing passwordless and Zero Trust strategies', discoveryQuestions: ['Are you pursuing a passwordless authentication strategy?', 'How do you currently handle multi-factor authentication?', 'Is mobile-centric Zero Trust on your roadmap?'], licensing: 'Per user. Annual subscription.' },
  { name: 'Neurons for Patch Management', shortDescription: 'Cloud-native patch: Win/Mac/Linux/3rd-party. Risk-based prioritization.', category: 'Security', type: 'saas', keyCapabilities: ['Cloud-native patch management', 'Windows, Mac, Linux, and 3rd-party patching', 'Risk-based patch prioritization using VRR scores', 'Patch reliability scoring from crowd-sourced data', 'Automated patch deployment workflows', 'Compliance dashboards and reporting'], targetAudience: 'Security Operations and IT Operations teams needing efficient, risk-prioritized patching', discoveryQuestions: ['How long does it take to patch critical vulnerabilities across your environment?', 'Do you patch third-party applications consistently?', 'How do you prioritize which patches to deploy?', 'Are you patching remote/off-network endpoints?'], licensing: 'Per device. Annual subscription. Volume tiers.' },
  { name: 'Neurons Patch for Intune', shortDescription: '3rd-party patch publishing into Microsoft Intune.', category: 'Security', type: 'add-on', keyCapabilities: ['Publish 3rd-party patches directly into Intune', 'Extend Intune patching beyond Microsoft apps', 'Centralized third-party patch catalog', 'Automated patch packaging and testing'], targetAudience: 'Organizations using Microsoft Intune who need comprehensive third-party patching', discoveryQuestions: ['Are you using Microsoft Intune for endpoint management?', 'How do you handle third-party application patching through Intune?', 'Is patching non-Microsoft apps a gap in your current process?'], licensing: 'Per device. Add-on to existing Intune environment.' },
  { name: 'Neurons for Mobile Threat Defense', shortDescription: 'Real-time mobile security, phishing/malware, time-of-click.', category: 'Security', type: 'saas', keyCapabilities: ['Real-time mobile threat detection', 'Phishing protection with time-of-click analysis', 'Malware and riskware detection', 'Network attack prevention (man-in-the-middle)', 'Integration with MDM for automated response'], targetAudience: 'Security teams protecting mobile workforce from phishing, malware, and network threats', discoveryQuestions: ['How do you protect mobile devices from phishing attacks?', 'Have you experienced mobile-related security incidents?', 'Is mobile threat defense integrated with your MDM?'], licensing: 'Per device. Annual subscription.' },
  { name: 'Neurons for App Control', shortDescription: 'Cloud-native allow/deny lists, Trusted Owner, privilege elevation.', category: 'Security', type: 'saas', keyCapabilities: ['Cloud-managed application control', 'Allow/deny listing with Trusted Ownership', 'Context-aware privilege elevation', 'Cloud console for policy management', 'Real-time application inventory'], targetAudience: 'Security teams wanting cloud-managed application control and least-privilege enforcement', discoveryQuestions: ['Are you managing application control policies from the cloud?', 'How do you handle privilege elevation in a cloud-first environment?', 'Is application whitelisting part of your Zero Trust strategy?'], licensing: 'Per device. Annual subscription.' },
  { name: 'Ivanti Security Controls', shortDescription: 'On-prem Win/Linux patching + whitelisting + privilege mgmt.', category: 'Security', type: 'on-prem', keyCapabilities: ['On-premises Windows and Linux patching', 'Application whitelisting', 'Privilege management', 'Patch deployment with flexible scheduling', 'Compliance and audit reporting'], targetAudience: 'Organizations with on-prem requirements needing combined patching, whitelisting, and privilege management', discoveryQuestions: ['Do you need on-premises patch management for compliance reasons?', 'Are you combining patching with application control today?', 'How do you manage admin privileges on endpoints?'], licensing: 'Per device. Perpetual with maintenance or subscription.' },
  { name: 'Ivanti Patch for EPM', shortDescription: 'EPM add-on for OS/3rd-party patching.', category: 'Security', type: 'add-on', keyCapabilities: ['OS patching for Windows, Mac, Linux', 'Third-party application patching', 'Integration with Ivanti EPM workflows', 'Patch scan and deployment automation', 'Compliance reporting'], targetAudience: 'Existing Ivanti EPM customers needing enhanced patching capabilities', discoveryQuestions: ['Are you currently using Ivanti EPM?', 'Do you need to extend patching to third-party apps through EPM?'], licensing: 'Add-on to EPM. Per device.' },
  { name: 'Ivanti Patch for Config Manager', shortDescription: 'SCCM plug-in for 3rd-party patching.', category: 'Security', type: 'add-on', keyCapabilities: ['Plug-in for Microsoft SCCM/ConfigMgr', 'Third-party patch catalog and publishing', 'Automated patch packaging for SCCM', 'Pre-tested patch content'], targetAudience: 'Organizations using Microsoft SCCM who need third-party patching without leaving their console', discoveryQuestions: ['Are you using SCCM/ConfigMgr for endpoint management?', 'How do you currently patch third-party applications via SCCM?', 'Is manual patch packaging a bottleneck?'], licensing: 'Per device. Add-on to SCCM environment.' },
  { name: 'Neurons for Zero Trust Access', shortDescription: 'SaaS ZTNA, micro-segmentation, continuous risk, UEBA.', category: 'Security', type: 'saas', keyCapabilities: ['SaaS-based Zero Trust Network Access (ZTNA)', 'Micro-segmentation for application access', 'Continuous risk scoring and adaptive access', 'User and Entity Behavior Analytics (UEBA)', 'Replace legacy VPN with ZTNA'], targetAudience: 'CISOs and network security teams transitioning from VPN to Zero Trust access', discoveryQuestions: ['Are you looking to replace or supplement your VPN with ZTNA?', 'Is micro-segmentation part of your Zero Trust roadmap?', 'How do you currently assess user risk before granting access?'], licensing: 'Per user. Annual subscription.' },
  { name: 'Neurons for Secure Access', shortDescription: 'Central cloud management for ICS VPN gateways.', category: 'Security', type: 'saas', keyCapabilities: ['Centralized cloud management for ICS gateways', 'Policy orchestration across VPN infrastructure', 'Real-time gateway health monitoring', 'Simplified configuration and updates', 'Hybrid deployment support'], targetAudience: 'Network security teams managing distributed Ivanti Connect Secure VPN gateways', discoveryQuestions: ['How many ICS/VPN gateways do you manage?', 'Is managing distributed VPN infrastructure a challenge?', 'Would centralized cloud management simplify your operations?'], licensing: 'Per gateway managed. Annual subscription.' },
  { name: 'Ivanti Connect Secure', shortDescription: 'SSL VPN, remote access, SSO, device posture.', category: 'Security', type: 'hybrid', keyCapabilities: ['SSL VPN for secure remote access', 'Single Sign-On (SSO) integration', 'Device posture checking before access', 'Granular access control policies', 'High availability and clustering'], targetAudience: 'Organizations needing secure remote access VPN with strong authentication and posture checks', discoveryQuestions: ['How do you provide remote access to corporate resources today?', 'Do you enforce device posture checks before granting VPN access?', 'How many concurrent remote users do you support?'], licensing: 'Per concurrent user or per appliance. Perpetual or subscription.' },
  { name: 'Neurons for RBVM', shortDescription: 'Risk-based vulnerability prioritization, ransomware tracking.', category: 'Security', type: 'saas', keyCapabilities: ['Risk-based vulnerability prioritization', 'Vulnerability Risk Rating (VRR) scoring', 'Ransomware risk tracking and alerting', 'Threat intelligence integration', 'Prioritized remediation workflows', 'Integration with patch management'], targetAudience: 'Security Operations and Vulnerability Management teams overwhelmed by CVE volume', discoveryQuestions: ['How do you prioritize which vulnerabilities to remediate first?', 'Are you tracking ransomware-linked vulnerabilities?', 'How do you correlate vulnerability data with threat intelligence?', 'Is your current vulnerability scanner providing actionable prioritization?'], licensing: 'Per asset. Annual subscription. Volume tiers.' },
  { name: 'Neurons for EASM', shortDescription: 'External attack surface management, shadow IT detection.', category: 'Security', type: 'saas', keyCapabilities: ['External attack surface discovery', 'Shadow IT and unknown asset detection', 'Continuous monitoring of internet-facing assets', 'Risk scoring for exposed assets', 'Integration with vulnerability management'], targetAudience: 'Security teams needing visibility into their external attack surface and shadow IT', discoveryQuestions: ['Do you have full visibility into your internet-facing assets?', 'Have you discovered unknown or shadow IT assets exposed externally?', 'How do you monitor your external attack surface today?'], licensing: 'Per domain or per asset discovered. Annual subscription.' },
];

const categoryConfig: Record<Category, { color: string; bg: string; border: string; activeBg: string; icon: React.ReactNode; label: string }> = {
  ESM: { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', activeBg: 'bg-blue-100', icon: <Server size={16} />, label: 'Enterprise Service Management' },
  UEM: { color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', activeBg: 'bg-green-100', icon: <Monitor size={16} />, label: 'Unified Endpoint Management' },
  Security: { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', activeBg: 'bg-red-100', icon: <Shield size={16} />, label: 'Security' },
};

const typeLabels: Record<ProductType, { label: string; color: string }> = {
  saas: { label: 'SaaS', color: 'bg-blue-100 text-blue-700' },
  'on-prem': { label: 'On-Prem', color: 'bg-amber-100 text-amber-700' },
  hybrid: { label: 'Hybrid', color: 'bg-purple-100 text-purple-700' },
  'add-on': { label: 'Add-On', color: 'bg-gray-100 text-gray-600' },
  package: { label: 'Package', color: 'bg-green-100 text-green-700' },
};

function ProductCard({ product }: { product: Product }) {
  const [expanded, setExpanded] = useState(false);
  const cat = categoryConfig[product.category];
  const typ = typeLabels[product.type];

  return (
    <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all ${expanded ? 'shadow-md' : 'hover:shadow-md'}`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left p-4 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-gray-900">{product.name}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${typ.color}`}>{typ.label}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.shortDescription}</p>
        </div>
        {expanded ? <ChevronDown size={16} className="text-gray-400 mt-1 flex-shrink-0" /> : <ChevronRight size={16} className="text-gray-400 mt-1 flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
          <div>
            <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers size={12} className="text-purple-500" /> Key Capabilities
            </h4>
            <ul className="space-y-1">
              {product.keyCapabilities.map((cap, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>{cap}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Users size={12} className="text-purple-500" /> Target Audience
            </h4>
            <p className="text-xs text-gray-600">{product.targetAudience}</p>
          </div>

          <div>
            <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HelpCircle size={12} className="text-purple-500" /> Discovery Questions
            </h4>
            <ul className="space-y-1.5">
              {product.discoveryQuestions.map((q, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                  <span className="text-purple-400 font-mono text-[10px] mt-0.5">{i + 1}.</span>{q}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
            <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Key size={12} className="text-purple-500" /> Licensing
            </h4>
            <p className="text-xs text-gray-600">{product.licensing}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductGuideView() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('ESM');

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.keyCapabilities.some(c => c.toLowerCase().includes(q)) ||
      p.targetAudience.toLowerCase().includes(q)
    );
  }, [search]);

  const categoryProducts = useMemo(() => filtered.filter(p => p.category === activeCategory), [filtered, activeCategory]);
  const counts = useMemo(() => ({
    ESM: filtered.filter(p => p.category === 'ESM').length,
    UEM: filtered.filter(p => p.category === 'UEM').length,
    Security: filtered.filter(p => p.category === 'Security').length,
  }), [filtered]);

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="flex items-center gap-3">
        <div className="text-center px-4 py-2 bg-purple-50 border border-purple-100 rounded-lg">
          <div className="text-lg font-bold text-purple-600">{filtered.length}</div>
          <div className="text-[10px] text-gray-400">Total Products</div>
        </div>
        {(['ESM', 'UEM', 'Security'] as Category[]).map(cat => {
          const cfg = categoryConfig[cat];
          return (
            <div key={cat} className={`text-center px-4 py-2 ${cfg.bg} border ${cfg.border} rounded-lg`}>
              <div className={`text-lg font-bold ${cfg.color}`}>{counts[cat]}</div>
              <div className="text-[10px] text-gray-400">{cat}</div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products by name, description, capabilities..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-200"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1">
        {(['ESM', 'UEM', 'Security'] as Category[]).map(cat => {
          const cfg = categoryConfig[cat];
          const isActive = activeCategory === cat;
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${
                isActive ? `${cfg.color} ${cfg.activeBg} border-current` : 'text-gray-400 border-transparent hover:text-gray-700'
              }`}>
              {cfg.icon}
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? cfg.bg + ' ' + cfg.color : 'bg-gray-100 text-gray-400'}`}>{counts[cat]}</span>
            </button>
          );
        })}
      </div>

      {/* Product Description */}
      <div className={`text-xs text-gray-500 ${categoryConfig[activeCategory].bg} border ${categoryConfig[activeCategory].border} rounded-lg px-4 py-2`}>
        {categoryConfig[activeCategory].icon} <span className="ml-1 font-medium">{categoryConfig[activeCategory].label}</span> — {activeCategory === 'ESM' ? 'IT Service Management, Asset Management, and enterprise service delivery solutions.' : activeCategory === 'UEM' ? 'Unified endpoint management, digital experience, and device lifecycle solutions.' : 'Zero Trust, patching, vulnerability management, and access security solutions.'}
      </div>

      {/* Product Cards */}
      {categoryProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">No products match your search in {activeCategory}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categoryProducts.map(p => <ProductCard key={p.name} product={p} />)}
        </div>
      )}
    </div>
  );
}
