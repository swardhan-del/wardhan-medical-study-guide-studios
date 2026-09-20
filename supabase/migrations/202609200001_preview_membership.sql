-- Apply only to a new, separate preview Supabase project. No production data.
begin;
create table public.module_catalog (
  module_id text primary key check (module_id in ('pilot-foundations', 'pilot-deep-dive')),
  required_tier text not null check (required_tier in ('basic', 'advanced')),
  synthetic_only boolean not null default true check (synthetic_only),
  check ((module_id = 'pilot-foundations' and required_tier = 'basic') or
         (module_id = 'pilot-deep-dive' and required_tier = 'advanced'))
);
create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  tier text not null check (tier in ('basic', 'advanced')),
  status text not null check (status in ('active', 'expired', 'revoked', 'past_due', 'cancelled')),
  valid_until timestamptz not null check (isfinite(valid_until)),
  updated_at timestamptz not null default now()
);
create table public.module_grants (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null references public.memberships(id) on delete cascade,
  module_id text not null references public.module_catalog(module_id),
  unique (membership_id, module_id)
);
alter table public.memberships enable row level security;
alter table public.module_grants enable row level security;
alter table public.module_catalog enable row level security;
-- No browser policies. Even an authenticated user cannot read or change entitlements.
revoke all on public.memberships, public.module_grants, public.module_catalog from public, anon, authenticated;
grant select, insert, update, delete on public.memberships, public.module_grants, public.module_catalog to service_role;
insert into public.module_catalog(module_id, required_tier) values
  ('pilot-foundations', 'basic'), ('pilot-deep-dive', 'advanced');

-- A single statement observes current membership, grants and the live Auth session.
-- Checking auth.sessions prevents replay of an unexpired JWT after provider sign-out.
create function public.pilot_access_snapshot(p_user_id uuid, p_session_id uuid, p_module_id text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'user_id', p_user_id, 'session_id', p_session_id,
    'session_active', exists(select 1 from auth.sessions s where s.id = p_session_id and s.user_id = p_user_id
      and (s.not_after is null or s.not_after > statement_timestamp())),
    'membership_present', m.id is not null, 'tier', m.tier, 'status', m.status,
    'valid_until', m.valid_until, 'db_now', statement_timestamp(),
    'module_id', c.module_id, 'required_tier', c.required_tier, 'synthetic_only', c.synthetic_only,
    'has_grant', exists(select 1 from public.module_grants g where g.membership_id = m.id and g.module_id = c.module_id)
  ) from (select 1) seed
  left join public.memberships m on m.user_id = p_user_id
  left join public.module_catalog c on c.module_id = p_module_id;
$$;
revoke all on function public.pilot_access_snapshot(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.pilot_access_snapshot(uuid, uuid, text) to service_role;

-- Storage's normal RLS remains in place. No browser SELECT or upload policy is added.
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('member-pilot-private', 'member-pilot-private', false, 4096, array['text/plain']);
commit;
