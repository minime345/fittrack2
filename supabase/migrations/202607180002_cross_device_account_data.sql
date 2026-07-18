-- Store calculator inputs/results with the account so they follow the user.
alter table public.profiles
  add column if not exists calculator_profile jsonb not null default '{}'::jsonb,
  add column if not exists training_preferences jsonb not null default '{}'::jsonb;

comment on column public.profiles.calculator_profile is
  'Latest FitTrack calculator inputs and calculated nutrition targets.';

comment on column public.profiles.training_preferences is
  'Workout filters and the selected workout plan for this account.';
