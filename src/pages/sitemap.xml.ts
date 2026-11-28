// Simple sitemap of all public pages (Thank You and 404 are left out on purpose).
import { servicePages } from '../data/serviceContent';
import { projects } from '../data/projects';
const base = 'https://ownzoscale.com';
export function GET() {
  const paths = ['/', '/services/', ...servicePages.map((p) => `/services/${p.slug}/`), '/pricing/', '/work/', ...projects.map((p) => `/work/${p.slug}/`), '/about/', '/contact/', '/book-a-consultation/', '/privacy-policy/', '/terms/'];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${base}${p}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
