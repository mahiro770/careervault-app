-- SupabaseのSQL Editorで実行してください

-- 職歴テーブル
create table if not exists jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  company text not null,
  title text not null,
  start_date date,
  end_date date,
  description text,
  achievement text,
  skills text[] default '{}',
  created_at timestamptz default now()
);

-- プロフィールテーブル
create table if not exists profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  name text,
  birth_date date,
  education text,
  certifications text,
  vision text,
  values text,
  priority text,
  updated_at timestamptz default now()
);

-- 書類生成履歴テーブル
create table if not exists doc_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  doc_type text check (doc_type in ('resume', 'cv', 'pr')) not null,
  content text not null,
  industry text,
  created_at timestamptz default now()
);

-- RLS（Row Level Security）有効化
alter table jobs enable row level security;
alter table profiles enable row level security;
alter table doc_history enable row level security;

-- ポリシー：自分のデータのみ読み書き可能
create policy "jobs: own data" on jobs for all using (auth.uid() = user_id);
create policy "profiles: own data" on profiles for all using (auth.uid() = user_id);
create policy "doc_history: own data" on doc_history for all using (auth.uid() = user_id);
