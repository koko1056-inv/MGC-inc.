// caseContent.ts の英語版。言語切替時に読み込む（i18n.ts）。
import type { Content } from './caseContent';

export const en: Content['en'] = {
  eyebrow: 'Case Studies',
  heading: 'Case studies',
  cases: [
    {
      slug: 'callcenter-voice-ai',
      industry: 'Call centre operator',
      scale: 'Handles outbound calls to contract holders',
      services: ['Voice AI', 'Salesforce AI', 'AI training'],
      summary:
        'CRM and voice AI integrated so that AI places reminder calls automatically. It does not stop at the call: escalation to a person, and the after-call work of logging and notifying, are automated too.',
      flow: {
        beforeLabel: 'Before',
        afterLabel: 'After',
        before: [
          { label: 'Select who to call', by: 'human' },
          { label: 'Place the call', by: 'human' },
          { label: 'Log the call', by: 'human' },
          { label: 'Share with the team', by: 'human' },
          { label: 'Raise the next action', by: 'human' },
        ],
        after: [
          { label: 'Select who to call', by: 'ai' },
          { label: 'Place the call', by: 'ai' },
          { label: 'Decide if a person is needed', by: 'ai' },
          { label: 'Handle calls needing judgement', by: 'human' },
          { label: 'Log and notify via Teams', by: 'ai' },
        ],
        caption: 'People are left with only the calls that need judgement. Automating the after-call work — logging, sharing, raising actions — is what produced the payroll saving.',
      },
      challenge: [
        'Contract reminder calls — chasing cancellations, confirming renewals, payment reminders, undelivered and unreturned equipment — all depended on people',
        'More time went into after-call work than the calls themselves: logging, sharing with colleagues, raising the next action',
        'Highly repetitive yet high in volume, consuming staff time and payroll',
        'Load concentrated in the busy season, squeezing everything else',
      ],
      approach: [
        { title: 'Integrate CRM with voice AI to automate reminder calls', desc: 'Targets are selected from contract data, AI places the call, and results are written back — so the screens staff already use stay current.' },
        { title: 'Escalate to a person based on what was said', desc: 'Calls needing judgement or negotiation are identified from the conversation and handed over rather than forced through AI.' },
        { title: 'Automate after-call work', desc: 'A summary of each call is pushed to the team chat tool (Teams) automatically, taking logging and sharing off people. This is where the payroll saving comes from.' },
        { title: 'Break down six flows, start with one', desc: 'We picked the most repetitive flow rather than automating everything at once, while building a foundation the other flows reuse.' },
        { title: 'A decision point between phases', desc: 'Whether to proceed to the remaining flows is decided on the first phase’s real-world results, so investment does not grow ahead of evidence.' },
      ],
      stack: 'Telephony (Twilio) / contract data (Salesforce) / Japanese speech synthesis (ElevenLabs) / notifications (Microsoft Teams)',
      points: [
        'Automating after-call work mattered more than automating the call. Automate only the call and the workload stays',
        'Rules for disclosing AI calling and obtaining consent were settled before implementation',
        'Conditions for handing a call to a person were defined during design',
        'Scope was cut so implementation completes before the busy season',
        'AI training for back-office work runs in parallel with the same client',
      ],
      note: 'The payroll saving is still being measured. We will add the figure once confirmed by the client.',
    },
    {
      slug: 'distributor-ai-outreach',
      industry: 'Distributor',
      scale: 'Brings overseas manufacturers’ products to the Japanese market',
      services: ['AI Sales'],
      summary:
        'Automating the discovery of overseas manufacturers worth representing — finding companies that fit, reaching out, and getting to a meeting, all as one system.',
      flow: {
        beforeLabel: 'Before',
        afterLabel: 'After',
        before: [
          { label: 'Search through personal networks', by: 'human' },
          { label: 'Build the list by hand', by: 'human' },
          { label: 'Write and send outreach', by: 'human' },
          { label: 'Handle replies', by: 'human' },
          { label: 'Meeting', by: 'human' },
        ],
        after: [
          { label: 'Define the criteria', by: 'human' },
          { label: 'Surface matching manufacturers', by: 'ai' },
          { label: 'Screen duplicates and existing accounts', by: 'ai' },
          { label: 'Write and send per company', by: 'ai' },
          { label: 'Meeting', by: 'human' },
        ],
        caption: 'The team’s work narrows to defining criteria and holding the meeting. Searching, sending and triaging moved into the system.',
      },
      challenge: [
        'Finding candidate overseas manufacturers relied on manual work and personal networks',
        'The prospect list ran dry and reachable companies plateaued',
        'The same companies were easily contacted twice',
        'Mass sending got no replies, but writing one at a time was not feasible',
      ],
      approach: [
        { title: 'Automate manufacturer discovery', desc: 'Given a product category and criteria, matching overseas manufacturers are surfaced automatically — replacing a step that depended on personal networks.' },
        { title: 'Screen duplicates and existing accounts', desc: 'Contact history is checked automatically so nobody is approached twice.' },
        { title: 'Write per company', desc: 'The angle changes based on each manufacturer’s products and business, rather than swapping fields in a template.' },
        { title: 'Move contact data in-house', desc: 'Responses accumulate in the client’s own database rather than disappearing after each send.' },
      ],
      metrics: [{ value: '10', unit: 'meetings', label: 'with overseas manufacturers in one month' }],
      result: {
        label: '10 meetings with overseas manufacturers in one month',
        desc: 'Sourced from criteria rather than personal networks. The team now spends its time in the meetings themselves rather than on discovery and first contact.',
      },
      points: [
        'When reply rates dipped, we revisited targeting and messaging rather than increasing volume',
        'List exhaustion cannot be solved by tooling alone, so category expansion is worked through with the client',
      ],
    },
    {
      slug: 'manufacturer-field-voice-ai',
      industry: 'Major construction machinery manufacturer',
      scale: 'A machinery manufacturer operating internationally',
      services: ['Voice AI', 'Custom AI development'],
      summary:
        'A system that lets field staff troubleshoot by talking to a voice AI. It pulls the right technical information for the machine model and language, so an answer comes back from speaking alone.',
      flow: {
        beforeLabel: 'Before',
        afterLabel: 'After',
        before: [
          { label: 'Problem occurs on site', by: 'human' },
          { label: 'Walk back to the office', by: 'human' },
          { label: 'Remove gloves, use a device', by: 'human' },
          { label: 'Search for the right document', by: 'human' },
          { label: 'Fix it', by: 'human' },
        ],
        after: [
          { label: 'Problem occurs on site', by: 'human' },
          { label: 'Just speak, on the spot', by: 'human' },
          { label: 'Match model and language', by: 'ai' },
          { label: 'Answer back by voice', by: 'ai' },
          { label: 'Fix it', by: 'human' },
        ],
        caption: 'Two steps disappear: walking back and taking off gloves. Designed from the premise that hands are full on site.',
      },
      challenge: [
        'When something went wrong on site, staff had to return to the office to look up how to fix it',
        'Looking it up meant removing gloves to operate a phone — a real burden in the field',
        'Each model has a large volume of technical material, and finding the right document took time',
        'Many supported languages, with no consistent way to search per language',
      ],
      approach: [
        { title: 'Answers from speaking alone', desc: 'Troubleshooting proceeds through voice conversation with no screen interaction, removing the need to take off gloves or walk back to the office.' },
        { title: 'Carry model and language over', desc: 'The app launches already filtered to the model and language the user was viewing in the existing customer portal.' },
        { title: 'Search through the provider’s API', desc: 'Search goes through the provided mechanism rather than referencing files directly, so results follow document updates.' },
        { title: 'Get multilingual rendering and speech right', desc: 'Fonts and voices were verified per language so the system holds up in all of them.' },
      ],
      points: [
        'Designed from the premise that hands are full on site. Assume screen interaction and it simply will not get used',
        'Navigation and authentication were settled first, on the premise that the existing user experience must not change',
        'Cases where search did not behave as expected were identified against real data, leading to a change in how documents are referenced',
      ],
    },
  ],
};
