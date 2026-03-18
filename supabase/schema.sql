create extension if not exists pgcrypto;

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  series text not null,
  location text not null,
  shot_on date not null,
  camera text not null,
  lens text not null,
  aspect_ratio text not null default 'landscape' check (aspect_ratio in ('portrait', 'landscape', 'square')),
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  image_path text,
  image_url text,
  tags text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_photos_updated_at on public.photos;
create trigger set_photos_updated_at
before update on public.photos
for each row
execute function public.set_updated_at();

alter table public.photos enable row level security;

drop policy if exists "Public can read published photos" on public.photos;
create policy "Public can read published photos"
on public.photos
for select
using (published = true);

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

drop policy if exists "Public can view portfolio images" on storage.objects;
create policy "Public can view portfolio images"
on storage.objects
for select
using (bucket_id = 'portfolio');

insert into public.photos (
  slug,
  title,
  description,
  series,
  location,
  shot_on,
  camera,
  lens,
  aspect_ratio,
  featured,
  sort_order,
  image_path,
  tags
)
values
  (
    'coastal-pause',
    'Coastal Pause',
    '灰蓝色海面与岩石之间，光线只停留了几分钟。',
    'Sea Quiet',
    'Pingtan, Fujian',
    '2025-10-08',
    'Leica SL2-S',
    '50mm Summicron-SL',
    'portrait',
    true,
    1,
    'featured/coastal-pause.jpg',
    array['sea', 'dawn', 'minimal']
  ),
  (
    'midnight-crossing',
    'Midnight Crossing',
    '雨后街道的反光让整座城市看起来像一张刚洗出的底片。',
    'After Rain',
    'Shanghai, China',
    '2025-09-21',
    'Fujifilm GFX100S',
    '80mm F1.7',
    'landscape',
    true,
    2,
    'featured/midnight-crossing.jpg',
    array['city', 'night', 'rain']
  )
on conflict (slug) do nothing;
