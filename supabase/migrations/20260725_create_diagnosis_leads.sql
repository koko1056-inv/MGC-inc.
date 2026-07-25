-- AI活用診断（/diagnosis）のリード保存テーブル
-- 適用済み: Supabase project jqcuhqpblfyinfnymuus (ap-northeast-1)
create table if not exists public.diagnosis_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- 連絡先
  email text not null,
  name text,
  company text,
  -- 入力内容
  industry text,
  business text,
  employees text,
  challenges text[],
  tools text,
  monthly text,
  goal text,
  -- 診断結果
  summary text,
  hours_saved_per_month numeric,
  cost_reduction_yen_per_month numeric,
  roas text,
  diagnosis jsonb,
  -- メタ
  model text,
  referer text,
  user_agent text
);

comment on table public.diagnosis_leads is 'AI活用診断（/diagnosis）のリードと診断結果';

create index if not exists diagnosis_leads_created_at_idx on public.diagnosis_leads (created_at desc);
create index if not exists diagnosis_leads_email_idx on public.diagnosis_leads (email);

-- RLSを有効化し、ポリシーは作らない。
-- これにより anon/authenticated からは一切読み書きできず、
-- service_role（サーバー側のみ・RLSbypass）からの書き込みだけが通る。
alter table public.diagnosis_leads enable row level security;

-- 多重防御: リードは個人情報を含むため、GRANTレベルでも公開ロールを拒否する。
revoke all on public.diagnosis_leads from anon;
revoke all on public.diagnosis_leads from authenticated;
