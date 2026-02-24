export type ChecklistItem = {
  label: string;
  description?: string;
};

export type Template = {
  id: string;
  title: string;
  type: 'email' | 'prompt' | 'checklist' | 'document' | 'script';
  phase: string;
  content: string;
  description: string;
};

export type Phase = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  duration: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  gradientFrom: string;
  gradientTo: string;
  description: string;
  keyActivities: string[];
  checklist: ChecklistItem[];
  tips: string[];
  deliverables: string[];
  tools: string[];
  owner: string;
};

export const phases: Phase[] = [
  {
    id: 'lead-intake',
    number: 1,
    title: 'Lead Intake',
    subtitle: 'Capture & Qualify the Opportunity',
    duration: 'Day 0',
    icon: '🎯',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-blue-800',
    description: 'A lead enters the pipeline — from marketing (website, events, webinars), a sales rep who pitched and qualified, partner referral, or customer self-service. The goal is to capture context, confirm fit, and route to the right VE resource.',
    keyActivities: [
      'Receive lead notification (Salesforce, email, Slack)',
      'Review lead source — marketing qualified, sales qualified, partner referral, or self-service',
      'Pull initial customer data (company size, industry, existing Ivanti products)',
      'Confirm the lead is a fit for a Capability & Maturity engagement',
      'Assign a VE owner and log in Salesforce',
      'Schedule initial discovery call within 48 hours',
    ],
    checklist: [
      { label: 'Lead source identified', description: 'Marketing, sales rep, partner, or self-service' },
      { label: 'Customer company name & industry confirmed' },
      { label: 'Existing Ivanti footprint checked in Salesforce' },
      { label: 'VE owner assigned' },
      { label: 'Sales rep / account team notified' },
      { label: 'Initial discovery call scheduled' },
      { label: 'Lead logged in Salesforce with C&M opportunity type' },
    ],
    tips: [
      'Respond within 24 hours — speed to contact is the #1 conversion factor',
      'If the lead came from a sales rep, get their context before reaching out directly',
      'Check if the customer has done a prior assessment — don\'t start from scratch',
    ],
    deliverables: ['Qualified lead record in Salesforce', 'VE owner assignment', 'Discovery call invite'],
    tools: ['Salesforce', 'Outlook/Teams Calendar', 'Slack'],
    owner: 'Value Engineering Lead',
  },
  {
    id: 'discovery-scheduling',
    number: 2,
    title: 'Discovery & Scheduling',
    subtitle: 'Understand Needs, Plan the Engagement',
    duration: 'Days 1–5',
    icon: '🔍',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-orange-700',
    description: 'Hold a discovery call to understand the customer\'s pain points, strategic objectives, and organizational structure. Determine the right workshop format (virtual, onsite, hybrid), identify participants, and send the initial outreach email with next steps.',
    keyActivities: [
      'Conduct discovery call with customer champion',
      'Identify key stakeholders and workshop participants (IT, security, business leaders)',
      'Determine workshop format: virtual (Teams/Zoom), onsite, or hybrid',
      'Align on scope — which capability domains to assess',
      'Agree on timeline and preferred dates',
      'Send formal engagement email with agenda, logistics, and participant list',
      'If onsite: begin venue/logistics coordination',
    ],
    checklist: [
      { label: 'Discovery call completed' },
      { label: 'Customer pain points and objectives documented' },
      { label: 'Workshop format decided (virtual / onsite / hybrid)' },
      { label: 'Participant list confirmed (names, titles, emails)' },
      { label: 'Capability domains scoped (ITSM, Security, UEM, etc.)' },
      { label: 'Workshop date(s) confirmed' },
      { label: 'Engagement email sent to customer champion' },
      { label: 'Calendar holds sent to all participants' },
      { label: 'Sales rep briefed on engagement plan' },
    ],
    tips: [
      'Aim for 5-12 participants — enough perspectives without chaos',
      'Always include at least one executive sponsor (VP+) for strategic buy-in',
      'For onsite workshops, book 2-3 weeks out minimum for logistics',
      'Send the engagement email within 24 hours of the discovery call while momentum is hot',
    ],
    deliverables: ['Discovery notes', 'Participant list', 'Engagement email', 'Calendar invites'],
    tools: ['Teams/Zoom', 'Outlook', 'OneNote/Notion'],
    owner: 'Value Engineer',
  },
  {
    id: 'assessment-setup',
    number: 3,
    title: 'Assessment Setup',
    subtitle: 'Configure & Distribute the Digital Assessment',
    duration: 'Days 3–7',
    icon: '📋',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    gradientFrom: 'from-green-600',
    gradientTo: 'to-green-800',
    description: 'Log into the online assessment facilitator portal, configure the assessment for this customer, and generate a unique URL to share with participants. This can happen simultaneously with the engagement email or after discovery, depending on timing. The goal is to collect individual stakeholder perspectives before the workshop.',
    keyActivities: [
      'Log into the Facilitator Setup portal',
      'Create a new assessment instance for the customer',
      'Select the capability domains to include',
      'Configure participant access and set completion deadline',
      'Generate the unique customer assessment URL',
      'Send the assessment link to participants (via email template)',
      'Set a reminder cadence — nudge at 50% and 75% of deadline',
      'Monitor completion rates in the facilitator dashboard',
    ],
    checklist: [
      { label: 'Facilitator portal accessed' },
      { label: 'Customer assessment instance created' },
      { label: 'Capability domains configured' },
      { label: 'Participant list loaded' },
      { label: 'Completion deadline set (ideally 5-7 business days before workshop)' },
      { label: 'Assessment URL generated and tested' },
      { label: 'Assessment invitation email sent to all participants' },
      { label: 'Reminder schedule set (Day 3, Day 5 if not complete)' },
      { label: 'Completion tracked — target 80%+ response rate' },
    ],
    tips: [
      'Set the deadline 5-7 business days before the workshop to allow synthesis time',
      'Include the customer champion on reminder emails — peer pressure works',
      'If response rate is below 50% at the midpoint, have the champion send a personal nudge',
      'Test the URL yourself before sending to catch any config issues',
    ],
    deliverables: ['Configured assessment', 'Customer URL', 'Invitation emails sent', 'Completion tracking'],
    tools: ['Facilitator Portal', 'Outlook', 'Assessment Dashboard'],
    owner: 'Value Engineer',
  },
  {
    id: 'pre-workshop-prep',
    number: 4,
    title: 'Pre-Workshop Preparation',
    subtitle: 'Synthesize Inputs & Prepare Materials',
    duration: 'Days 7–12',
    icon: '🧩',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
    gradientFrom: 'from-cyan-600',
    gradientTo: 'to-cyan-800',
    description: 'As participant assessments come in, capture and condense all inputs into a multi-stakeholder canvas board. For onsite/hybrid workshops, coordinate logistics including ordering supplies and Capability Cards via FedEx. Build the workshop facilitation deck and prepare breakout activities.',
    keyActivities: [
      'Download and review all participant assessment responses',
      'Build the multi-stakeholder canvas board (Lucidchart/Miro)',
      'Identify key themes, gaps, and alignment/misalignment across stakeholders',
      'Prepare the workshop facilitation deck',
      'For ONSITE: Order supplies and Capability Cards via FedEx',
      'For ONSITE: Confirm venue, AV equipment, catering',
      'For VIRTUAL: Set up Miro/Lucidchart board, test screen sharing',
      'Prepare breakout exercises and discussion prompts',
      'Brief the account team on pre-workshop findings',
    ],
    checklist: [
      { label: 'All assessment responses downloaded and reviewed' },
      { label: 'Multi-stakeholder canvas board built' },
      { label: 'Key themes and gaps identified' },
      { label: 'Workshop facilitation deck prepared' },
      { label: 'Breakout exercises designed' },
      { label: '[ONSITE] Supplies ordered via FedEx', description: 'See Materials List below' },
      { label: '[ONSITE] Capability Cards shipped to venue' },
      { label: '[ONSITE] Venue, AV, catering confirmed' },
      { label: '[VIRTUAL] Digital whiteboard set up and tested' },
      { label: 'Account team briefed on pre-workshop findings' },
      { label: 'Participant reminder sent (24 hours before)' },
    ],
    tips: [
      'The canvas board is the most valuable pre-work — it shows stakeholders where they agree and disagree',
      'Ship FedEx materials at least 5 business days before the workshop date',
      'Always have backup supplies — sticky notes dry out, markers die',
      'For hybrid workshops, test the camera/mic setup the day before',
    ],
    deliverables: ['Multi-stakeholder canvas', 'Facilitation deck', 'Shipped materials (onsite)', 'Digital board (virtual)'],
    tools: ['Lucidchart', 'Miro', 'FedEx', 'PowerPoint/Google Slides'],
    owner: 'Value Engineer',
  },
  {
    id: 'workshop-delivery',
    number: 5,
    title: 'Workshop Delivery',
    subtitle: 'Facilitate the Capability & Maturity Session',
    duration: 'Day 13 (or scheduled date)',
    icon: '🎪',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    gradientFrom: 'from-purple-600',
    gradientTo: 'to-purple-800',
    description: 'Run the workshop — walking participants through the assessment results, facilitating discussion around capability gaps, building consensus on priorities, and co-creating a roadmap. Capture everything: notes, sticky notes, whiteboard photos, and recordings.',
    keyActivities: [
      'Welcome participants and set ground rules',
      'Present the multi-stakeholder canvas — show where perspectives align and diverge',
      'Facilitate domain-by-domain capability discussion',
      'Run breakout exercises for priority areas',
      'Capture all outputs: sticky notes, whiteboard, chat, verbal feedback',
      'Record the session (with permission)',
      'Build consensus on top 3-5 priority areas',
      'Co-create initial roadmap direction with stakeholders',
      'Close with next steps and timeline for deliverables',
    ],
    checklist: [
      { label: 'Workshop opened — agenda and ground rules shared' },
      { label: 'Multi-stakeholder canvas presented and discussed' },
      { label: 'Each capability domain reviewed with group' },
      { label: 'Breakout exercises completed' },
      { label: 'All sticky notes / whiteboard inputs captured (photos)' },
      { label: 'Session recorded (if virtual or hybrid)' },
      { label: 'Priority areas identified and voted on' },
      { label: 'Initial roadmap direction agreed' },
      { label: 'Next steps communicated (synthesis timeline, follow-up)' },
      { label: 'Thank-you email sent same day' },
    ],
    tips: [
      'Start with the biggest area of stakeholder misalignment — it creates the most productive discussion',
      'Use dot voting (sticky dots or digital polls) for priority ranking — it\'s fast and democratic',
      'Take photos of EVERYTHING — sticky notes fall off walls overnight',
      'For virtual: use Miro voting and timer features to keep energy up',
      'Have a "parking lot" for topics that are important but off-scope',
    ],
    deliverables: ['Workshop notes', 'Sticky note captures', 'Recording', 'Priority ranking', 'Initial roadmap direction'],
    tools: ['Lucidchart/Miro', 'Teams/Zoom (recording)', 'Camera (onsite)', 'Capability Cards'],
    owner: 'Value Engineer (Facilitator)',
  },
  {
    id: 'post-workshop-synthesis',
    number: 6,
    title: 'Post-Workshop Synthesis',
    subtitle: 'Analyze, Synthesize & Build the Deck',
    duration: 'Days 14–21',
    icon: '🔬',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/20',
    gradientFrom: 'from-rose-600',
    gradientTo: 'to-rose-800',
    description: 'Take all workshop outputs — notes, sticky notes, recordings, whiteboard captures, assessment data — and synthesize into a comprehensive deliverable. This includes the maturity assessment summary, capability gap analysis, strategic recommendations, and a phased Crawl/Walk/Run roadmap.',
    keyActivities: [
      'Transcribe and organize all workshop notes and recordings',
      'Map sticky note themes to capability domains',
      'Score each capability domain based on assessment data + workshop discussion',
      'Build the synthesis deck with standard sections',
      'Create the Crawl/Walk/Run roadmap with timelines',
      'Draft strategic recommendations tied to Ivanti solutions',
      'Internal review with account team before delivery',
      'Prepare executive summary for C-level audience',
    ],
    checklist: [
      { label: 'All notes transcribed and organized' },
      { label: 'Recording reviewed for missed insights' },
      { label: 'Capability scores finalized per domain' },
      { label: 'Gap analysis completed' },
      { label: 'Strategic recommendations drafted' },
      { label: 'Crawl/Walk/Run roadmap built with timelines' },
      { label: 'Synthesis deck assembled (all sections)' },
      { label: 'Executive summary written' },
      { label: 'Internal review completed with account team' },
      { label: 'Deck reviewed for accuracy and branding' },
    ],
    tips: [
      'Use the Copilot prompt to generate a skeleton deck — then customize from there',
      'The Crawl/Walk/Run roadmap should align with their fiscal year and renewal timeline',
      'Include "quick wins" in the Crawl phase — it builds credibility for the bigger plays',
      'Have the sales rep review before delivery to catch any political landmines',
    ],
    deliverables: ['Synthesis deck', 'Capability score matrix', 'Crawl/Walk/Run roadmap', 'Executive summary'],
    tools: ['PowerPoint', 'Copilot', 'Lucidchart', 'Excel'],
    owner: 'Value Engineer',
  },
  {
    id: 'deliverable-presentation',
    number: 7,
    title: 'Deliverable & Presentation',
    subtitle: 'Present Findings & Drive Next Steps',
    duration: 'Days 21–28',
    icon: '🏆',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-amber-700',
    description: 'Present the synthesis deck to the customer — ideally to a broader audience including executive sponsors. Walk through findings, the maturity assessment, and the phased roadmap. The goal is to drive consensus on next steps and connect recommendations to commercial conversations.',
    keyActivities: [
      'Schedule the readout meeting with all stakeholders + executive sponsors',
      'Deliver the synthesis presentation',
      'Walk through capability scores and gap analysis',
      'Present the Crawl/Walk/Run roadmap',
      'Facilitate discussion on priorities and next steps',
      'Connect roadmap phases to specific Ivanti solutions and commercial proposals',
      'Agree on follow-up actions and timeline',
      'Share final deliverable (PDF + editable deck)',
      'Transition to commercial conversation with sales team',
    ],
    checklist: [
      { label: 'Readout meeting scheduled with executive sponsors' },
      { label: 'Final deck delivered and presented' },
      { label: 'Capability scores reviewed with customer' },
      { label: 'Roadmap discussed and directionally agreed' },
      { label: 'Next steps and follow-up actions agreed' },
      { label: 'Deliverable shared (PDF + source)' },
      { label: 'Salesforce opportunity updated with outcomes' },
      { label: 'Sales team transitioned for commercial follow-up' },
      { label: 'Customer satisfaction captured (NPS or informal)' },
      { label: 'Lessons learned documented for process improvement' },
    ],
    tips: [
      'Always present to executives — they\'re the budget holders',
      'Lead with business outcomes, not technology features',
      'The roadmap is your best sales tool — it creates urgency and sequencing for multi-year deals',
      'Send a follow-up email within 24 hours with the deck, key takeaways, and agreed next steps',
    ],
    deliverables: ['Final synthesis deck (PDF)', 'Editable roadmap', 'Follow-up email with next steps', 'Salesforce update'],
    tools: ['Teams/Zoom', 'PowerPoint', 'Salesforce', 'Outlook'],
    owner: 'Value Engineer + Sales Rep',
  },
];

export const onsiteMaterials: { item: string; quantity: string; notes: string }[] = [
  { item: 'Capability Cards (full deck)', quantity: '1 set per table (typically 3-5 sets)', notes: 'Core workshop tool — order from internal print shop or ship from inventory' },
  { item: 'Large Post-it Easel Pads (25" x 30")', quantity: '4-6 pads', notes: 'For group brainstorming and capturing themes' },
  { item: 'Standard Sticky Notes (3" x 3")', quantity: '10+ pads, multiple colors', notes: 'Each color = different category/priority level' },
  { item: 'Dot Stickers (voting dots)', quantity: '1 sheet per participant', notes: 'For priority voting exercises — red/green/yellow' },
  { item: 'Sharpie Markers (fine point)', quantity: '2 per participant', notes: 'Must be readable from 6+ feet — no ballpoint pens' },
  { item: 'Painter\'s Tape (blue)', quantity: '2-3 rolls', notes: 'For hanging easel pad sheets on walls without damage' },
  { item: 'Name Tents / Table Cards', quantity: '1 per participant', notes: 'Pre-printed with names and titles' },
  { item: 'Printed Agenda', quantity: '1 per participant', notes: 'Include wifi info, breaks, and contact details' },
  { item: 'Workshop Feedback Forms', quantity: '1 per participant', notes: 'Quick 5-question NPS-style form' },
  { item: 'Laptop / Projector Adapters', quantity: '2 (USB-C + HDMI)', notes: 'Never trust venue AV — bring your own' },
  { item: 'Portable Bluetooth Speaker', quantity: '1', notes: 'For break music and timer alerts' },
  { item: 'Camera / Phone Tripod', quantity: '1', notes: 'For documenting whiteboard and sticky note walls' },
];

export const templates: Template[] = [
  {
    id: 'initial-outreach-email',
    title: 'Initial Engagement Email',
    type: 'email',
    phase: 'discovery-scheduling',
    description: 'Send after discovery call to formalize the engagement, confirm participants, and share logistics.',
    content: `Subject: [CUSTOMER NAME] × Ivanti — Capability & Maturity Workshop Confirmation

Hi [CUSTOMER CHAMPION NAME],

Thank you for the great conversation [today/yesterday]. I'm excited to move forward with the Capability & Maturity assessment for [CUSTOMER NAME].

Here's a summary of what we discussed:

📋 Workshop Details
• Format: [Virtual via Teams / Onsite at LOCATION / Hybrid]
• Date(s): [DATE(S)]
• Duration: [Half day / Full day / Two half-days]
• Focus Areas: [ITSM, Security, UEM, etc.]

👥 Confirmed Participants
[List names and titles — or ask them to confirm]

📝 Pre-Work (Assessment)
Before the workshop, we'll send each participant a brief online assessment (15-20 minutes). This helps us understand each stakeholder's perspective and makes the workshop dramatically more productive. I'll send the assessment link [separately / below] with a [DATE] completion deadline.

🎯 What to Expect
The workshop is a collaborative, discussion-driven session — not a presentation. We'll walk through your organization's current capabilities, identify gaps, and co-create a prioritized roadmap together.

After the workshop, you'll receive a comprehensive synthesis including:
• Capability maturity scores across assessed domains
• Gap analysis with strategic recommendations
• Crawl/Walk/Run roadmap aligned to your objectives

Please let me know if you have any questions or if the participant list needs adjusting.

Looking forward to it!

[YOUR NAME]
[TITLE]
[PHONE / TEAMS LINK]`,
  },
  {
    id: 'assessment-invitation-email',
    title: 'Assessment Invitation Email',
    type: 'email',
    phase: 'assessment-setup',
    description: 'Send to all workshop participants with the assessment link and completion deadline.',
    content: `Subject: Action Needed: Pre-Workshop Assessment for [CUSTOMER NAME] Capability Review

Hi [PARTICIPANT NAME],

You've been selected to participate in an upcoming Capability & Maturity workshop with Ivanti. Before we meet, we'd like to gather your perspective through a brief online assessment.

🔗 Your Assessment Link: [ASSESSMENT URL]
⏰ Please complete by: [DEADLINE DATE]
⌛ Estimated time: 15-20 minutes

The assessment asks you to rate your organization's current capabilities across several IT domains. There are no right or wrong answers — we want your honest perspective based on your role and experience.

Your individual responses will be kept confidential. We'll present aggregated, anonymized results during the workshop to show where your leadership team aligns and where perspectives differ.

If you have any questions, feel free to reach out.

Thank you,
[YOUR NAME]`,
  },
  {
    id: 'assessment-reminder-email',
    title: 'Assessment Reminder Email',
    type: 'email',
    phase: 'assessment-setup',
    description: 'Nudge for participants who haven\'t completed the assessment.',
    content: `Subject: Friendly Reminder: Assessment Due [DEADLINE DATE]

Hi [PARTICIPANT NAME],

Quick reminder that the Capability & Maturity pre-assessment is due [DEADLINE DATE] — just [X] days away.

🔗 Your link: [ASSESSMENT URL]
⌛ Takes about 15-20 minutes

Your input directly shapes the workshop agenda and ensures we focus on what matters most to your team.

Thanks!
[YOUR NAME]`,
  },
  {
    id: 'fedex-shipping-checklist',
    title: 'FedEx Shipping Checklist',
    type: 'checklist',
    phase: 'pre-workshop-prep',
    description: 'Checklist for ordering and shipping onsite workshop materials.',
    content: `ONSITE WORKSHOP MATERIALS — SHIPPING CHECKLIST

Ship To:
• Hotel/Venue: [VENUE NAME]
• Address: [FULL ADDRESS]
• Attn: [CONTACT NAME / "Hold for [YOUR NAME] — [EVENT DATE]"]
• Phone: [VENUE PHONE]

Ship By: [DATE — at least 5 business days before workshop]
Shipping Method: FedEx 2-Day or Ground (based on timeline)

📦 Package Contents:
□ Capability Cards (__ sets)
□ Easel pads (__ pads)
□ Sticky notes (__ pads, assorted colors)
□ Dot stickers for voting
□ Sharpie markers (__ count)
□ Painter's tape (__ rolls)
□ Name tents (pre-printed)
□ Printed agendas (__ copies)
□ Feedback forms (__ copies)

⚠️ Important:
• Call the hotel/venue to confirm they accept packages and will hold
• Include your mobile number on the shipping label
• Track the shipment — confirm delivery before you travel
• Pack a "backup bag" in your carry-on with essential supplies`,
  },
  {
    id: 'post-workshop-thank-you',
    title: 'Post-Workshop Thank You Email',
    type: 'email',
    phase: 'workshop-delivery',
    description: 'Send same-day after the workshop to maintain momentum.',
    content: `Subject: Thank You — [CUSTOMER NAME] Capability & Maturity Workshop

Hi [CUSTOMER CHAMPION / ALL PARTICIPANTS],

Thank you for an incredible workshop [today/yesterday]. The engagement and honesty from your team made for a highly productive session.

Here's a quick recap of what we covered:
• [2-3 bullet summary of key themes discussed]
• Top priority areas identified: [LIST TOP 3-5]
• Agreed next step: [e.g., synthesis presentation in 2 weeks]

📅 What happens next:
We'll synthesize all the workshop outputs — your assessment data, discussion notes, and priority rankings — into a comprehensive deliverable including:
✅ Capability maturity scores across all assessed domains
✅ Gap analysis with strategic recommendations
✅ Crawl/Walk/Run roadmap aligned to your objectives

Expected delivery: [DATE — typically 7-10 business days]

I'll reach out to schedule the readout presentation once the deck is ready.

Thank you again for your time and candor. This was a great session.

Best,
[YOUR NAME]`,
  },
  {
    id: 'synthesis-deck-prompt',
    title: 'Synthesis Deck Generator (Copilot Prompt)',
    type: 'prompt',
    phase: 'post-workshop-synthesis',
    description: 'Use this prompt in Copilot to generate a skeleton synthesis deck from your workshop notes.',
    content: `You are a senior management consultant preparing a Capability & Maturity synthesis deck for [CUSTOMER NAME] in the [INDUSTRY] vertical.

Using the following workshop outputs, generate a structured presentation deck with these sections:

SECTION 1: EXECUTIVE SUMMARY
• One-page overview of the engagement, key findings, and recommended next steps
• Written for CIO/CTO audience — business language, not technical jargon

SECTION 2: ENGAGEMENT OVERVIEW
• Workshop date, participants (by role, not name), scope of assessment
• Methodology summary (assessment + workshop + synthesis)

SECTION 3: CAPABILITY MATURITY ASSESSMENT
• For each capability domain assessed, provide:
  - Current maturity score (1-5 scale)
  - Industry benchmark comparison
  - Key strengths identified
  - Critical gaps identified
  - Stakeholder alignment (where perspectives agreed/diverged)

SECTION 4: GAP ANALYSIS & STRATEGIC RECOMMENDATIONS
• Top 5-7 recommendations prioritized by business impact
• Each recommendation should include:
  - The gap it addresses
  - Expected business outcome
  - Effort level (Low/Medium/High)
  - Recommended Ivanti solution alignment

SECTION 5: CRAWL / WALK / RUN ROADMAP
• Phase 1 — CRAWL (0-6 months): Quick wins and foundational improvements
• Phase 2 — WALK (6-12 months): Process maturity and integration
• Phase 3 — RUN (12-24 months): Advanced capabilities and optimization
• Each phase should list specific initiatives with timeline and success metrics

SECTION 6: NEXT STEPS
• Recommended immediate actions (next 30 days)
• Follow-up meeting cadence
• Commercial discussion entry points

WORKSHOP OUTPUTS:
[PASTE YOUR NOTES, THEMES, SCORES, AND KEY QUOTES HERE]

FORMAT: Generate as structured text with clear slide headings and bullet points. Each section should be 1-3 slides worth of content. Use active voice and benefit-focused language.`,
  },
  {
    id: 'workshop-notes-prompt',
    title: 'Workshop Notes Synthesizer (Copilot Prompt)',
    type: 'prompt',
    phase: 'post-workshop-synthesis',
    description: 'Use this prompt to synthesize messy workshop notes into structured themes.',
    content: `You are analyzing workshop notes from a Capability & Maturity assessment session with [CUSTOMER NAME].

The notes below are raw — they include sticky note text, verbal comments captured during discussion, chat messages, and facilitator observations. They may be messy, abbreviated, or out of order.

Your task:
1. Identify the top 5-7 themes that emerged across all inputs
2. For each theme, provide:
   - Theme name and one-sentence description
   - Supporting evidence (specific quotes or sticky notes)
   - Which capability domain(s) it relates to
   - Stakeholder sentiment (positive, negative, mixed)
   - Implication for the roadmap
3. Identify any areas of strong AGREEMENT across stakeholders
4. Identify any areas of strong DISAGREEMENT or tension
5. Flag any "parking lot" items that were raised but not fully addressed

RAW WORKSHOP NOTES:
[PASTE ALL YOUR NOTES HERE — sticky notes, chat transcripts, verbal notes, whiteboard photos transcribed]

FORMAT: Structured analysis with clear headers. Be concise but don't lose nuance. Include direct quotes where they're powerful.`,
  },
  {
    id: 'readout-meeting-invite',
    title: 'Readout Meeting Invite',
    type: 'email',
    phase: 'deliverable-presentation',
    description: 'Invite for the final synthesis presentation meeting.',
    content: `Subject: [CUSTOMER NAME] Capability & Maturity — Findings Readout

Hi [CUSTOMER CHAMPION],

Our synthesis is complete! I'd like to schedule 60-90 minutes to walk your team through our findings, the capability maturity assessment results, and the recommended roadmap.

📋 What we'll cover:
• Capability maturity scores across [X] domains
• Key gaps and strategic recommendations
• Crawl/Walk/Run roadmap with phased initiatives
• Recommended next steps

👥 Suggested attendees:
• All workshop participants
• [Executive Sponsor Name] — the strategic recommendations and roadmap would benefit from their perspective
• [Anyone else who should see this]

📅 Proposed times:
• [OPTION 1]
• [OPTION 2]
• [OPTION 3]

Please let me know which works, and if there are additional stakeholders who should join.

Best,
[YOUR NAME]`,
  },
];

export function getTemplatesForPhase(phaseId: string): Template[] {
  return templates.filter(t => t.phase === phaseId);
}
