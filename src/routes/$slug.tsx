import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { ContentRenderer } from "@/components/ContentRenderer";
import { contentIndex } from "@/content/generated-content";

const ContentPage = () => {
  const { slug } = Route.useParams();
  const page = contentIndex.pages.find((p) => p.meta.slug === slug);

  if (!page) {
    throw notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Link className="text-sm underline" data-back-button to="/">
        Back
      </Link>
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
