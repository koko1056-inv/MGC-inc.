// 自社プロダクトの紹介（AI電話のサービスページ・トップ・フッター・構造化データ・llms.txt で共通に使う）。
// 文言は MOSHITEL の LP（https://moshitel.mgc-global01.com）に載っている内容だけで書く。LP にない数字・実績は書かない。
import type { Lang } from './translations';

export const MOSHITEL_URL = 'https://moshitel.mgc-global01.com';
// 送客先（LP）。どこから来たかを UTM で分ける（utm_content に置き場所）
const MOSHITEL_LP = `${MOSHITEL_URL}/5`;
export const moshitelUrl = (placement: string) =>
  `${MOSHITEL_LP}?utm_source=mgc-global01&utm_medium=referral&utm_content=${encodeURIComponent(placement)}`;

export type ProductContent = {
  name: string;
  kicker: string;
  tagline: string;
  heading: string;
  lead: string;
  points: string[];
  features: { title: string; desc: string }[];
  industries: string;
  pricing: string;
  relation: string;
  cta: string;
  ctaSub: string;
  homeTitle: string;
  homeDesc: string;
  footerLabel: string;
  /** 構造化データ・llms.txt 用の一文 */
  summary: string;
};

export const moshitel: Record<Lang, ProductContent> = {
  ja: {
    name: 'MOSHITEL（モシテル）',
    kicker: 'Our Product',
    tagline: '中小企業・お店のためのAI電話受付',
    heading: '出られない電話は、AIが受けて用件をお知らせします',
    lead: '営業時間外や休みの日、接客・作業中で出られない電話にAIが出て、予約や問い合わせの用件を聞き取ります。通話の内容は要約して、メールやLINEなど決めておいた通知先にお知らせします。',
    points: ['24時間受付', '無料で試せる', '登録不要'],
    features: [
      { title: 'お店の決まりに合わせて応対', desc: '営業時間、予約の受け方、よく聞かれる質問などを伺い、初期設定は私たちが行います。担当者に引き継ぐ条件も事前に決めておけます。' },
      { title: '用件は要約して担当者へ', desc: '通話ごとに、お名前・用件・ご希望を数行にまとめてお知らせします。録音も残るので、あとから聞き直せます。' },
      { title: '予約システムとの連携も相談可', desc: '予約表や顧客台帳を入れ替える必要はありません。お使いのシステムに通話の内容を取り込む方法をご提案します。' },
    ],
    industries: '飲食店・美容サロン・クリニック・不動産・ホテル・旅館・修理・設備など、業種に合わせて応対を設定できます。',
    pricing: '料金は、通話の量や任せたい範囲に合わせて個別にお見積もりします。',
    relation: 'このページのAI電話（コールセンター向けの個別開発）に対して、MOSHITELは中小企業・店舗がすぐに試せるMGCの自社プロダクトです。',
    cta: '無料でAI受付を試す',
    ctaSub: '業種と応対内容、声を選ぶと、その場でAI受付を試せます。登録は不要です。',
    homeTitle: 'MOSHITEL（モシテル）',
    homeDesc: '営業時間外や接客中で出られない電話にAIが出て、用件を要約してお知らせします。24時間受付、無料で試せます（登録不要）。',
    footerLabel: 'MOSHITEL（AI電話受付）',
    summary: '中小企業・店舗向けのAI電話受付。営業時間外や接客・作業中で出られない電話にAIが24時間応対し、予約や問い合わせの用件を聞き取って要約を通知する。業種に合わせて応対を設定でき、初期設定はMGCが行う。無料・登録不要で試せる。料金は通話の量や任せたい範囲に応じて個別見積もり。',
  },
  en: {
    name: 'MOSHITEL',
    kicker: 'Our Product',
    tagline: 'AI phone reception for small businesses and shops',
    heading: 'When you cannot pick up, AI answers and tells you what the call was about',
    lead: 'After hours, on days off, or while you are serving customers or working, MOSHITEL answers the phone, takes down bookings and inquiries, and sends a summary of each call to the email, LINE or other destination you choose.',
    points: ['Answers 24 hours a day', 'Free to try', 'No sign-up'],
    features: [
      { title: 'Answers by your shop’s rules', desc: 'We learn your opening hours, how you take bookings and common questions, and handle the initial setup. Conditions for handing calls to staff can be set in advance.' },
      { title: 'Summaries go to your staff', desc: 'Each call is summarised in a few lines — name, request and preferences. Recordings are kept so you can listen again later.' },
      { title: 'Booking-system integration on request', desc: 'No need to replace your booking sheet or customer ledger. We suggest how to bring call details into the system you already use.' },
    ],
    industries: 'Responses can be set up for your industry: restaurants, beauty salons, clinics, real estate, hotels and inns, repairs and facilities, and more.',
    pricing: 'Pricing is quoted individually, based on call volume and the scope you want to hand over.',
    relation: 'Alongside the custom AI phone agents on this page (built for contact centres), MOSHITEL is MGC’s own product that small businesses and shops can try right away.',
    cta: 'Try AI reception for free',
    ctaSub: 'Choose your industry, what to handle and a voice, and try the AI reception on the spot. No sign-up needed. (The site is in Japanese.)',
    homeTitle: 'MOSHITEL',
    homeDesc: 'When you cannot pick up, AI answers and sends you a summary. Answers 24 hours a day; free to try, no sign-up.',
    footerLabel: 'MOSHITEL (AI phone reception)',
    summary: 'AI phone reception for small businesses and shops: answers calls 24 hours a day when staff cannot pick up, takes down bookings and inquiries, and sends summaries. Free to try without sign-up; pricing quoted individually.',
  },
};
