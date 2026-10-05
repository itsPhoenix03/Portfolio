import type { APIRoute } from 'astro';

// Generated on every build, so <lastmod> always tells crawlers the site
// changed when it was last deployed. Add a <url> here for any new page.
export const GET: APIRoute = ({ site }) => {
  const base = site!.toString();
  const lastmod = new Date().toISOString().slice(0, 10);
  const pages = [{ path: '', priority: '1.0' }];

  const urls = pages
    .map(
      (p) => `  <url>
    <loc>${new URL(p.path, base)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${p.priority}</priority>
    <image:image><image:loc>${new URL('/og-image.png', base)}</image:loc></image:image>
  </url>`
    )
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
};
