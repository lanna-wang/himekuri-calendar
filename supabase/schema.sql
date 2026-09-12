-- himekuri: entries table — verification / hardening
--
-- IMPORTANT: the live table already exists and holds real entries. Do NOT
-- drop or recreate it. Its columns are deliberately short:
--
--   uid  uuid        -> auth.users.id, the owning account
--   d    date        -> the entry's day
--   a    text        -> "accomplished"
--   h    text        -> "happy"
--   f    text        -> "looking forward"
--   s    smallint    -> star colour index (see getStarImageByIndex)
--
-- RLS was verified as ON and correct: reading with the public anon key and no
-- session returns zero rows rather than the whole table. The statements below
-- are idempotent and safe to re-run; they exist so the policies are recorded
-- in the repo rather than living only in the dashboard.

alter table public.entries enable row level security;

-- one entry per person per day, so upsert-on-conflict works
create unique index if not exists entries_uid_d_key
  on public.entries (uid, d);

create index if not exists entries_uid_d_idx
  on public.entries (uid, d desc);

-- Every policy is scoped to auth.uid(). This is the actual privacy boundary:
-- the anon key ships in the browser bundle and is public by design, so without
-- these a client-side .eq("uid", ...) filter would protect nothing.

drop policy if exists "read own entries"   on public.entries;
drop policy if exists "insert own entries" on public.entries;
drop policy if exists "update own entries" on public.entries;
drop policy if exists "delete own entries" on public.entries;

create policy "read own entries"
  on public.entries for select
  using (auth.uid() = uid);

create policy "insert own entries"
  on public.entries for insert
  with check (auth.uid() = uid);

create policy "update own entries"
  on public.entries for update
  using (auth.uid() = uid)
  with check (auth.uid() = uid);

create policy "delete own entries"
  on public.entries for delete
  using (auth.uid() = uid);
