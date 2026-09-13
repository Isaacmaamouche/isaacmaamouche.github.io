import { createFileRoute, notFound } from "@tanstack/react-router";

import { ContentNav } from "@/components/ContentNav";
import { ContentRenderer } from "@/components/ContentRenderer";
import { NavItem } from "@/components/NavItem";
import { contentIndex } from "@/content/generated-content";

const ContentPage = () => {
  const { slug } = Route.useParams();
  const page = contentIndex.pages.find((p) => p.meta.slug === slug);

  if (!page) {
    throw notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <div className="flex items-center gap-4">
        <NavItem to="/">Home</NavItem>
        <ContentNav activeSlug={slug} />
      </div>
      <h1 className="mt-4 text-2xl font-semibold">
        {page.meta.title || page.meta.cardLabel}
      </h1>
      <div className="mt-6">
        <ContentRenderer sections={page.sections} />
      </div>
    </main>
  );
};

export const Route = createFileRoute("/$slug")({
  component: ContentPage,
});
