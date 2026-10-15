import Link from "next/link";
import { notFound } from "next/navigation";
import { coverages, coverageBySlug } from "@/data/content";
import { routes, sections } from "@/lib/routes";
import { pageMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { Blocks } from "@/components/ui/Blocks";
import { LineIcon } from "@/components/ui/LineIcon";
import { QuoteCta } from "@/components/ui/QuoteCta";
import { JsonLd } from "@/components/seo/JsonLd";

// Static export: only the 16 known slugs exist.
export const dynamicParams = false;

export function generateStaticParams() {
  return coverages.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/coverage/[slug]">) {
  const { slug } = await params;
  const c = coverageBySlug(slug);
  if (!c) return {};
  return pageMetadata({ title: c.seo.title, description: c.seo.description, path: routes.coverage(c.slug) });
}

export default async function CoveragePage({ params }: PageProps<"/coverage/[slug]">) {
  const { slug } = await params;
  const c = coverageBySlug(slug);
  if (!c) notFound();
  const related = c.related.map(coverageBySlug).filter((r) => r !== undefined);
  const index = coverages.indexOf(c);
  const next = coverages[(index + 1) % coverages.length];

  return (
    <article>
      <JsonLd
        data={[
          serviceJsonLd(c),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Coverage", path: "/#coverage" },
            { name: c.name, path: routes.coverage(c.slug) },
          ]),
        ]}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Coverage", href: sections.coverage }, { label: `${c.number} / ${coverages.length}` }]}
        kicker="Washington, DC • Maryland • Virginia"
        title={c.title}
        aside={<LineIcon slug={c.slug} animate="mount" strokeWidth={1.25} className="size-28 text-ink md:size-44 xl:size-56" title={`${c.name} icon`} />}
      >
        <p className="mt-8 max-w-[44ch] text-lead text-ink-soft">{c.summary}</p>
      </PageHero>

      <div className="shell grid gap-14 pb-24 md:pb-32 xl:grid-cols-[16rem_minmax(0,46rem)_1fr] xl:gap-16">
        {/* margin column: the "fine print" index */}
        <aside className="hidden xl:block">
          <div className="sticky top-28 space-y-6">
            <p className="label text-ink-faint">On this page</p>
            <ul className="space-y-2 text-[0.9375rem]">
              {c.body
                .filter((b) => b.type === "heading")
                .map((b, i) => (
                  <li key={i} className="text-ink-soft">
                    <span className="label mr-2 text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                    {b.text}
                  </li>
                ))}
            </ul>
          </div>
        </aside>

        <div>
          <Blocks blocks={c.body} highlights={c.highlights} />
          {c.callLine && (
            <p className="mt-10 border-l-2 border-ink pl-5 font-serif text-[1.375rem] leading-snug">{c.callLine}</p>
          )}
        </div>

        <aside aria-labelledby="related-title" className="xl:pt-2">
          <h2 id="related-title" className="label text-ink-faint">Related coverage</h2>
          <ul className="mt-4 border-t border-rule">
            {related.map((r) => (
              <li key={r.slug} className="border-b border-rule">
                <Link href={routes.coverage(r.slug)} className="group flex min-h-14 items-center gap-4 py-3">
                  <LineIcon slug={r.slug} animate="none" className="size-8 shrink-0 text-ink" />
                  <span className="pen-link font-medium">{r.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={routes.coverage(next.slug)} className="mt-10 block border border-rule p-5 transition-colors hover:border-ink">
            <span className="label text-ink-faint">Next · {next.number}</span>
            <span className="mt-2 block font-serif text-h3">{next.name} →</span>
          </Link>
        </aside>
      </div>

      <QuoteCta />
    </article>
  );
}
