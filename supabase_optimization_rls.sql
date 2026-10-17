-- ============================================================
-- TRENDMARKET — SUPABASE PRODUCTION OPTIMIZATION & RLS V1
-- Market Intelligence SaaS
-- ============================================================

-- ============================================================
-- 1. PERFORMANCE INDEXES
-- ============================================================

create index if not exists idx_trends_market_observed 
on public.trends(market_id, observed_at desc);

create index if not exists idx_data_snapshots_market 
on public.data_snapshots(market_id, collected_at desc);

create index if not exists idx_market_analyses_user 
on public.market_analyses(user_id, created_at desc);

create index if not exists idx_comparisons_user 
on public.comparisons(user_id, created_at desc);

create index if not exists idx_searches_user 
on public.searches(user_id, created_at desc);

create index if not exists idx_watchlist_items_watchlist 
on public.watchlist_items(watchlist_id);

create index if not exists idx_markets_opportunity_score 
on public.markets(opportunity_score desc);

-- ============================================================
-- 2. ROW LEVEL SECURITY (RLS) ACTIVATION
-- ============================================================

alter table public.profiles enable row level security;
alter table public.watchlists enable row level security;
alter table public.watchlist_items enable row level security;
alter table public.market_analyses enable row level security;
alter table public.comparisons enable row level security;
alter table public.reports enable row level security;
alter table public.searches enable row level security;

-- ============================================================
-- 3. RLS POLICIES
-- ============================================================

-- Profiles
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" 
on public.profiles for select 
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" 
on public.profiles for update 
using (auth.uid() = id);

-- Watchlists
drop policy if exists "Users can manage own watchlists" on public.watchlists;
create policy "Users can manage own watchlists" 
on public.watchlists for all 
using (auth.uid() = user_id) 
with check (auth.uid() = user_id);

-- Watchlist Items (via watchlist ownership)
drop policy if exists "Users can manage own watchlist items" on public.watchlist_items;
create policy "Users can manage own watchlist items" 
on public.watchlist_items for all 
using (
  exists (
    select 1 from public.watchlists w 
    where w.id = watchlist_id and w.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.watchlists w 
    where w.id = watchlist_id and w.user_id = auth.uid()
  )
);

-- Market Analyses
drop policy if exists "Users can manage own market analyses" on public.market_analyses;
create policy "Users can manage own market analyses" 
on public.market_analyses for all 
using (auth.uid() = user_id) 
with check (auth.uid() = user_id);

-- Comparisons
drop policy if exists "Users can manage own comparisons" on public.comparisons;
create policy "Users can manage own comparisons" 
on public.comparisons for all 
using (auth.uid() = user_id) 
with check (auth.uid() = user_id);

-- Reports
drop policy if exists "Users can manage own reports" on public.reports;
create policy "Users can manage own reports" 
on public.reports for all 
using (auth.uid() = user_id) 
with check (auth.uid() = user_id);

-- Searches
drop policy if exists "Users can manage own searches" on public.searches;
create policy "Users can manage own searches" 
on public.searches for all 
using (auth.uid() = user_id) 
with check (auth.uid() = user_id);

-- Public Reference Tables (read-only for authenticated/anonymous users)
alter table public.categories enable row level security;
drop policy if exists "Allow public read categories" on public.categories;
create policy "Allow public read categories" on public.categories for select using (true);

alter table public.countries enable row level security;
drop policy if exists "Allow public read countries" on public.countries;
create policy "Allow public read countries" on public.countries for select using (true);

alter table public.markets enable row level security;
drop policy if exists "Allow public read markets" on public.markets;
create policy "Allow public read markets" on public.markets for select using (true);

alter table public.trends enable row level security;
drop policy if exists "Allow public read trends" on public.trends;
create policy "Allow public read trends" on public.trends for select using (true);

alter table public.data_sources enable row level security;
drop policy if exists "Allow public read data_sources" on public.data_sources;
create policy "Allow public read data_sources" on public.data_sources for select using (true);

alter table public.opportunities enable row level security;
drop policy if exists "Allow public read opportunities" on public.opportunities;
create policy "Allow public read opportunities" on public.opportunities for select using (true);
