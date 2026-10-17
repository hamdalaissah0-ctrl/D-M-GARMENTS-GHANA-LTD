-- Phase 20 (Production) launch review: product_images, product_features,
-- portfolio_images and category_images all had `using (true)` read policies,
-- meaning anon could query them directly via the public REST API regardless
-- of whether the parent product/portfolio project/category was still a
-- draft. That leaked unpublished content (images, feature lists) before
-- D&M intended it to go live. Gate each on the parent's status, matching
-- the pattern already used for the parent tables themselves.

drop policy product_images_public_read on public.product_images;
create policy product_images_public_read on public.product_images for select to anon, authenticated
  using (
    public.is_staff()
    or exists (
      select 1 from public.products p
      where p.id = product_images.product_id and p.status = 'active'
    )
  );

drop policy product_features_public_read on public.product_features;
create policy product_features_public_read on public.product_features for select to anon, authenticated
  using (
    public.is_staff()
    or exists (
      select 1 from public.products p
      where p.id = product_features.product_id and p.status = 'active'
    )
  );

drop policy portfolio_images_public_read on public.portfolio_images;
create policy portfolio_images_public_read on public.portfolio_images for select to anon, authenticated
  using (
    public.is_staff()
    or exists (
      select 1 from public.portfolio_projects pp
      where pp.id = portfolio_images.portfolio_project_id and pp.status = 'published'
    )
  );

drop policy category_images_public_read on public.category_images;
create policy category_images_public_read on public.category_images for select to anon, authenticated
  using (
    public.is_staff()
    or exists (
      select 1 from public.categories c
      where c.id = category_images.category_id and c.status = 'published'
    )
  );
