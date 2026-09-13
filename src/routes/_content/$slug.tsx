import { createFileRoute, notFound } from "@tanstack/react-router";

import { ContentRenderer } from "@/components/ContentRenderer";
import { Title } from "@/components/Title";
import { contentIndex } from "@/content/generated-content";

const ContentPage = () => {
  const { slug } = Route.useParams();
  const page = contentIndex.pages.find((p) => p.meta.slug === slug);

  if (!page) {
    throw notFound();
  }

  return (
    <article>
      <Title>{page.meta.title || page.meta.cardLabel}</Title>
      <div className="mt-6">
        <ContentRenderer sections={page.sections} />
      </div>
    </article>
  );
};

export const Route = createFileRoute("/_content/$slug")({
  component: ContentPage,
  head: ({ params }) => {
    const page = contentIndex.pages.find((p) => p.meta.slug === params.slug);
    return {
      meta: [{ title: page?.meta.title || page?.meta.cardLabel || "" }],
    };
  },
});
