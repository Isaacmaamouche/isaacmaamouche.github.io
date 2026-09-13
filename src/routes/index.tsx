import { createFileRoute, Link } from "@tanstack/react-router";

import { contentIndex } from "@/content/generated-content";

const Home = () => {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold">Portfolio</h1>
      <nav className="mt-4 flex flex-col gap-2">
        {contentIndex.pages.map((page) => (
          <Link
            className="underline"
            key={page.meta.slug}
            params={{ slug: page.meta.slug }}
            to="/$slug"
          >
            {page.meta.cardLabel}
          </Link>
        ))}
      </nav>
    </main>
  );
};

export const Route = createFileRoute("/")({
  component: Home,
});
