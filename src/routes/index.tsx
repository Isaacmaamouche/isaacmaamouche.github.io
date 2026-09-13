import { createFileRoute, Link } from "@tanstack/react-router";

const Home = () => {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold">Portfolio</h1>
      <nav className="mt-4">
        <Link className="underline" params={{ slug: "example" }} to="/$slug">
          example
        </Link>
      </nav>
    </main>
  );
};

export const Route = createFileRoute("/")({
  component: Home,
});
