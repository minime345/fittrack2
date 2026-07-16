-- FitTrack application data lives in public tables. Password credentials are
-- managed only by Supabase Auth in its protected auth schema.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  unit_system text not null default 'metric' check (unit_system in ('metric', 'imperial')),
  goal text check (goal in ('maintain', 'lose', 'gain')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.weight_entries (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  weight_kg numeric(6,2) not null check (weight_kg > 20 and weight_kg < 500),
  recorded_on date not null default current_date,
  note text check (char_length(note) <= 500),
  created_at timestamptz not null default now(),
  unique (user_id, recorded_on)
);

create table if not exists public.saved_meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My meal plan',
  settings jsonb not null default '{}'::jsonb,
  plan_data jsonb not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_workout_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_id text not null,
  preferences jsonb not null default '{}'::jsonb,
  schedule_data jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recipe_preferences (
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_slug text not null,
  preference text not null check (preference in ('favorite', 'hidden')),
  reason text check (char_length(reason) <= 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, recipe_slug)
);

create table if not exists public.custom_recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  description text check (char_length(description) <= 1000),
  ingredients jsonb not null default '[]'::jsonb,
  instructions jsonb not null default '[]'::jsonb,
  nutrition jsonb not null default '{}'::jsonb,
  categories text[] not null default '{}',
  meal_types text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists weight_entries_user_date_idx on public.weight_entries(user_id, recorded_on desc);
create index if not exists saved_meal_plans_user_idx on public.saved_meal_plans(user_id, updated_at desc);
create index if not exists saved_workout_plans_user_idx on public.saved_workout_plans(user_id, updated_at desc);
create index if not exists custom_recipes_user_idx on public.custom_recipes(user_id, updated_at desc);

alter table public.profiles enable row level security;
alter table public.weight_entries enable row level security;
alter table public.saved_meal_plans enable row level security;
alter table public.saved_workout_plans enable row level security;
alter table public.recipe_preferences enable row level security;
alter table public.custom_recipes enable row level security;

create policy "profiles_owned" on public.profiles for all using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "weight_entries_owned" on public.weight_entries for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "meal_plans_owned" on public.saved_meal_plans for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "workout_plans_owned" on public.saved_workout_plans for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "recipe_preferences_owned" on public.recipe_preferences for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "custom_recipes_owned" on public.custom_recipes for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create or replace function public.create_profile_for_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.create_profile_for_new_user();
