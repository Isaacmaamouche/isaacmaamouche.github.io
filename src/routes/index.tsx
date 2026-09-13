import { createFileRoute, Link } from "@tanstack/react-router";

import { Title } from "@/components/Title";
import { contentIndex } from "@/content/generated-content";

const Home = () => {
  return (
    <>
      <Title>Portfolio</Title>
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
    </>
  );
};

export const Route = createFileRoute("/")({
  component: Home,
});
