import { createFileRoute, notFound } from "@tanstack/react-router";

import { BackButton } from "@/components/BackButton";
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
      <BackButton />
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
