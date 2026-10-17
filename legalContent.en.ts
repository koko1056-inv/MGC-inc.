// legalContent.ts の英語版。言語切替時に読み込む（i18n.ts）。
import { CONTACT_EMAIL } from './legalContent';
import type { LegalDoc, LegalPair } from './legalContent';

const privacyEn: LegalDoc = {
  title: 'Privacy Policy',
  sub: 'Privacy Policy',
  updated: 'Established: October 17, 2026',
  intro:
    'MGC Inc. ("we") handles personal information collected on our website (https://mgc-global01.com, the "Site") in accordance with the Act on the Protection of Personal Information of Japan and related laws, as described below. The Japanese version prevails in case of any discrepancy.',
  sections: [
    {
      heading: '1. Business operator',
      list: [
        'Name: MGC Inc.',
        'Address: Habitation Onzuan 106, 111 Nishitatsumi-cho, Kamigyo-ku, Kyoto 602-8107, Japan',
        'Representative: Kokomu Matsuo, CEO',
      ],
    },
    {
      heading: '2. Information we collect',
      list: [
        'Contact form: name, company, email address, topic, and message',
        'AI diagnosis: email, name, company, industry, business description, company size, challenges, tools in use, monthly cost/revenue range, goals, the diagnosis result, referring page, and browser type (user agent)',
        'Access data: pages viewed, referrer, device/OS/browser type, and country or region as aggregate statistics (see section 6)',
      ],
    },
    {
      heading: '3. Purposes of use',
      list: [
        'Responding to inquiries, scheduling consultations, and contacting you',
        'Producing and showing AI diagnosis results, and contacting you or making proposals about them',
        'Informing you about our services',
        'Understanding and improving how the Site is used',
        'Preventing and responding to misuse',
      ],
    },
    {
      heading: '4. Disclosure to third parties',
      paragraphs: [
        'We do not provide personal data to third parties without your consent, except where required by law, where necessary to protect life, body or property, where cooperating with public authorities, or where we entrust handling to service providers as described in section 5.',
      ],
    },
    {
      heading: '5. Service providers (including providers outside Japan)',
      paragraphs: ['We use the following services, all operated by companies located in the United States.'],
      table: {
        head: ['Service (provider)', 'Purpose', 'Information handled'],
        rows: [
          ['Vercel (Vercel Inc., US)', 'Hosting and analytics (Vercel Web Analytics)', 'Form and diagnosis submissions (in transit), access data'],
          ['Resend (US)', 'Emailing inquiries and diagnosis submissions to us', 'Inquiry content, diagnosis input'],
          ['Google Gemini API (Google LLC, US)', 'Generating AI diagnosis text', 'Diagnosis input'],
          ['Supabase (Supabase Inc., US)', 'Storing diagnosis input and results', 'Diagnosis input and results'],
        ],
      },
    },
    {
      heading: '6. Analytics',
      paragraphs: [
        'We use Vercel Web Analytics, which does not use cookies and only aggregates statistics such as pages viewed, referrers and device types. We do not identify individuals from it.',
        'Our company page embeds Google Maps. Google LLC may use cookies or similar technologies when the map is displayed; see Google’s privacy policy.',
      ],
    },
    {
      heading: '7. Retention',
      paragraphs: ['We keep personal information only as long as needed for the purposes above and delete it without delay afterwards.'],
    },
    {
      heading: '8. Security measures',
      paragraphs: [
        'Our CEO is responsible for the handling of personal information. We limit access to service accounts to what is necessary, manage credentials properly, encrypt communications (HTTPS), protect devices against loss or theft, and check the data protection regimes of countries where data is handled.',
      ],
    },
    {
      heading: '9. Requests',
      paragraphs: [
        'You may request notification of purposes, disclosure, correction, deletion, suspension of use, or suspension of third-party provision of your retained personal data. After verifying your identity, we will respond without delay as required by law.',
      ],
    },
    {
      heading: '10. Changes',
      paragraphs: ['We may revise this policy. Revisions take effect when posted on this page.'],
    },
    {
      heading: '11. Contact',
      list: ['MGC Inc. Personal Information Desk', `Email: ${CONTACT_EMAIL}`],
    },
  ],
};

const termsEn: LegalDoc = {
  title: 'Terms of Use',
  sub: 'Terms of Use',
  updated: 'Established: October 17, 2026',
  intro:
    'These terms govern the use of the website operated by MGC Inc. (https://mgc-global01.com, the "Site"). By using the Site you agree to these terms. The Japanese version prevails in case of any discrepancy.',
  sections: [
    { heading: '1. Copyright', paragraphs: ['All content on the Site belongs to MGC Inc. or its rightful owners. Reproduction beyond private use or lawful quotation is prohibited.'] },
    {
      heading: '2. Prohibited conduct',
      list: [
        'Acts violating laws or public order',
        'Entering false information or information of others into forms',
        'Placing excessive load on, accessing without authorization, or interfering with the Site',
        'Infringing the rights, interests or reputation of MGC Inc. or others',
      ],
    },
    { heading: '3. AI diagnosis', paragraphs: ['Diagnosis results are reference information generated automatically by AI from your input. We do not guarantee their accuracy, completeness or fitness for a particular purpose.'] },
    { heading: '4. Disclaimer', paragraphs: ['Except in cases of our intent or gross negligence, we are not liable for damages arising from use of, or inability to use, the Site. We may change, suspend or end the Site without notice.'] },
    { heading: '5. External links', paragraphs: ['We are not responsible for the content of external sites linked from the Site.'] },
    { heading: '6. Personal information', paragraphs: ['Personal information is handled as set out in our Privacy Policy.'] },
    { heading: '7. Changes', paragraphs: ['We may revise these terms. Revisions take effect when posted on this page.'] },
    { heading: '8. Governing law and jurisdiction', paragraphs: ['These terms are governed by the laws of Japan. The Kyoto District Court has exclusive jurisdiction in the first instance.'] },
    { heading: '9. Contact', list: ['MGC Inc.', `Email: ${CONTACT_EMAIL}`] },
  ],
};

export const en: LegalPair = { privacy: privacyEn, terms: termsEn };
