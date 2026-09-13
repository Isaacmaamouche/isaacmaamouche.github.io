import { createFileRoute, notFound } from "@tanstack/react-router";

import { ContentRenderer } from "@/components/ContentRenderer";
import { contentIndex } from "@/content/generated-content";

const ContentPage = () => {
  const { slug } = Route.useParams();
  const page = contentIndex.pages.find((p) => p.meta.slug === slug);

  if (!page) {
    throw notFound();
  }

  return (
    <article>
      <h1 className="text-2xl font-semibold">
        {page.meta.title || page.meta.cardLabel}
      </h1>
      <div className="mt-6">
        <ContentRenderer sections={page.sections} />
      </div>
    </article>
  );
};

export const Route = createFileRoute("/_content/$slug")({
  component: ContentPage,
});
