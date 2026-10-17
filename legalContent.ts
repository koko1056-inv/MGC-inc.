// プライバシーポリシー・サイト利用規約の本文（/privacy-policy, /terms-of-service）。
// 改定したら updated を更新し、改定日は必ず実際の公開日にする。
import type { Lang } from './translations';

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  table?: { head: [string, string, string]; rows: [string, string, string][] };
};

export type LegalDoc = {
  title: string;
  sub: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export const CONTACT_EMAIL = 'contact@mgc-global01.com';

const privacyJa: LegalDoc = {
  title: 'プライバシーポリシー',
  sub: 'Privacy Policy',
  updated: '制定日：2026年10月17日',
  intro:
    'ＭＧＣ株式会社（以下「当社」）は、当社ウェブサイト（https://mgc-global01.com、以下「本サイト」）で取得する個人情報を、個人情報の保護に関する法律（以下「個人情報保護法」）その他の関係法令を遵守して、以下のとおり取り扱います。',
  sections: [
    {
      heading: '1. 事業者情報',
      list: [
        '名称：ＭＧＣ株式会社',
        '住所：〒602-8107 京都府京都市上京区西辰巳町111 アビタシオンオンズアン106',
        '代表者：代表取締役 松尾 心夢',
      ],
    },
    {
      heading: '2. 取得する情報',
      paragraphs: ['当社は、本サイトで次の情報を取得します。'],
      list: [
        'お問い合わせフォーム：お名前、会社名、メールアドレス、ご相談内容の区分、メッセージ本文',
        'AI活用診断：メールアドレス、お名前、会社名、業種、事業内容、従業員規模、課題、利用中のツール、月間のコスト・売上の目安、達成したいこと、診断結果、送信元のページ、ブラウザの種類（ユーザーエージェント）',
        'アクセス情報：閲覧したページ、参照元、端末・OS・ブラウザの種類、国・地域などの統計情報（下記「6. アクセス解析」）',
      ],
    },
    {
      heading: '3. 利用目的',
      paragraphs: ['取得した情報は、次の目的の範囲内で利用します。'],
      list: [
        'お問い合わせへの回答、ご相談日程の調整、ご連絡',
        'AI活用診断の結果の作成・表示、および診断内容に関するご連絡・ご提案',
        '当社サービス（AIソリューション・AI事業立ち上げ支援・研修・クロスボーダー事業）のご案内',
        '本サイトの利用状況の把握と改善',
        '不正な利用の防止、およびその対応',
      ],
    },
    {
      heading: '4. 第三者提供',
      paragraphs: [
        '当社は、次の場合を除き、ご本人の同意なく個人データを第三者に提供しません。',
      ],
      list: [
        '法令に基づく場合',
        '人の生命・身体・財産の保護のために必要で、ご本人の同意を得ることが困難な場合',
        '国の機関等が法令の定める事務を遂行することに協力する必要がある場合',
        '下記「5. 業務の委託と外部サービス」のとおり、利用目的の達成に必要な範囲で取扱いを委託する場合',
      ],
    },
    {
      heading: '5. 業務の委託と外部サービス（外国にある第三者への提供を含む）',
      paragraphs: [
        '当社は、本サイトの運営に次の外部サービスを利用しており、利用目的の達成に必要な範囲で、個人データの取扱いを委託しています。いずれも米国に所在する事業者のサービスです。',
      ],
      table: {
        head: ['サービス（提供者）', '用途', '取り扱う情報'],
        rows: [
          ['Vercel（Vercel Inc.・米国）', '本サイトのホスティング、アクセス解析（Vercel Web Analytics）', 'フォーム・診断の送信内容（中継）、アクセス情報'],
          ['Resend（米国）', 'お問い合わせ・診断内容を当社へメールで通知', 'お問い合わせ内容、診断の入力内容'],
          ['Google Gemini API（Google LLC・米国）', 'AI活用診断の診断文の生成', '診断の入力内容'],
          ['Supabase（Supabase Inc.・米国）', 'AI活用診断の入力内容と結果の保存', '診断の入力内容と結果'],
        ],
      },
    },
    {
      heading: '',
      paragraphs: [
        '米国には、日本の個人情報保護法と同等の包括的な個人情報保護法はなく、州ごとの法令等により保護されています。米国の制度の概要は、個人情報保護委員会が公表する「外国における個人情報の保護に関する制度等の調査」でご確認いただけます。当社は、各社の利用規約・データ保護に関する定めを確認したうえで利用し、委託先における取扱いが適切に行われるよう努めます。',
      ],
    },
    {
      heading: '6. アクセス解析',
      paragraphs: [
        '本サイトは、利用状況の把握と改善のため、Vercel Inc. が提供する「Vercel Web Analytics」を利用しています。Vercel Web Analytics は Cookie を使用せず、閲覧ページ・参照元・端末の種類などを統計情報として集計するもので、当社が個人を特定することはありません。',
        '会社情報ページでは、所在地の表示に Google マップを埋め込んでいます。地図の表示にあたり、Google LLC が Cookie 等を使用して情報を取得する場合があります。取扱いは Google のプライバシーポリシーをご確認ください。',
      ],
    },
    {
      heading: '7. 保管期間',
      paragraphs: [
        '取得した個人情報は、利用目的の達成に必要な期間に限り保管し、その後は遅滞なく削除します。',
      ],
    },
    {
      heading: '8. 安全管理措置',
      paragraphs: ['当社は、個人データの漏えい・滅失・毀損を防ぐため、次の措置を講じます。'],
      list: [
        '組織的安全管理措置：代表取締役を個人情報の取扱いの責任者とし、取扱いの状況を定期的に確認します。',
        '人的安全管理措置：個人データを取り扱う者に、取扱いに関する留意事項を周知します。',
        '物理的安全管理措置：個人データを取り扱う端末の盗難・紛失を防止し、画面ロック等を行います。',
        '技術的安全管理措置：外部サービスへのアクセス権限を必要最小限に限り、認証情報を適切に管理するとともに、通信を暗号化（HTTPS）します。',
        '外的環境の把握：外国で個人データを取り扱う場合は、その国の個人情報保護制度を把握したうえで必要な措置を講じます。',
      ],
    },
    {
      heading: '9. 開示等のご請求',
      paragraphs: [
        'ご本人から、保有個人データの利用目的の通知、開示、訂正・追加・削除、利用停止・消去、第三者提供の停止、第三者提供記録の開示のご請求があった場合は、ご本人であることを確認したうえで、法令に従い遅滞なく対応します。下記の窓口までご連絡ください。',
      ],
    },
    {
      heading: '10. 本ポリシーの改定',
      paragraphs: [
        '当社は、法令の改正やサービス内容の変更に応じて本ポリシーを改定することがあります。改定後の内容は本ページに掲載した時点から適用します。',
      ],
    },
    {
      heading: '11. お問い合わせ窓口',
      list: [
        'ＭＧＣ株式会社 個人情報お問い合わせ窓口',
        `メール：${CONTACT_EMAIL}`,
      ],
    },
  ],
};

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

const termsJa: LegalDoc = {
  title: 'サイト利用規約',
  sub: 'Terms of Use',
  updated: '制定日：2026年10月17日',
  intro:
    'この規約は、ＭＧＣ株式会社（以下「当社」）が運営するウェブサイト（https://mgc-global01.com、以下「本サイト」）の利用条件を定めるものです。本サイトをご利用いただいた時点で、本規約に同意いただいたものとみなします。',
  sections: [
    {
      heading: '1. 著作権等',
      paragraphs: [
        '本サイトに掲載している文章・画像・ロゴ・デザインその他のコンテンツの著作権その他の権利は、当社または正当な権利者に帰属します。私的利用や法令で認められる引用の範囲を超えて、無断で複製・転載・改変・配布することを禁止します。',
      ],
    },
    {
      heading: '2. 禁止事項',
      paragraphs: ['本サイトの利用にあたり、次の行為を禁止します。'],
      list: [
        '法令または公序良俗に反する行為',
        '虚偽の情報や第三者の情報をフォーム等に入力する行為',
        '本サイトのサーバーやネットワークに過度の負荷をかける行為、不正アクセスや運営を妨げる行為',
        '当社または第三者の権利・利益・名誉を侵害する行為',
        'その他、当社が不適切と判断する行為',
      ],
    },
    {
      heading: '3. AI活用診断について',
      paragraphs: [
        'AI活用診断の結果は、入力いただいた内容をもとにAIが自動で生成する参考情報です。内容の正確性・完全性・特定の目的への適合性を保証するものではなく、導入の可否や効果を約束するものではありません。具体的な検討にあたっては、当社との個別のご相談をご利用ください。',
      ],
    },
    {
      heading: '4. 免責事項',
      paragraphs: [
        '当社は、本サイトの情報の正確性に努めていますが、その内容を保証するものではありません。本サイトの利用、または利用できなかったことによって生じた損害について、当社の故意または重大な過失による場合を除き、責任を負いません。',
        '当社は、予告なく本サイトの内容を変更し、または運営を中断・終了することがあります。',
      ],
    },
    {
      heading: '5. 外部サイトへのリンク',
      paragraphs: [
        '本サイトから外部サイトへのリンクは、利用者の便宜のために設けたものです。リンク先の内容について当社は責任を負いません。',
      ],
    },
    {
      heading: '6. 個人情報の取扱い',
      paragraphs: ['本サイトにおける個人情報の取扱いは、当社のプライバシーポリシーに定めます。'],
    },
    {
      heading: '7. 規約の変更',
      paragraphs: ['当社は、必要に応じて本規約を変更できるものとします。変更後の規約は本ページに掲載した時点から効力を生じます。'],
    },
    {
      heading: '8. 準拠法・管轄',
      paragraphs: ['本規約は日本法に準拠します。本サイトに関して紛争が生じた場合は、京都地方裁判所を第一審の専属的合意管轄裁判所とします。'],
    },
    {
      heading: '9. お問い合わせ',
      list: ['ＭＧＣ株式会社', `メール：${CONTACT_EMAIL}`],
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

export const legalContent: Record<Lang, { privacy: LegalDoc; terms: LegalDoc }> = {
  ja: { privacy: privacyJa, terms: termsJa },
  en: { privacy: privacyEn, terms: termsEn },
};
