import { createFileRoute, Link } from "@tanstack/react-router";

const ContentPage = () => {
  const { slug } = Route.useParams();

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Link className="text-sm underline" data-back-button to="/">
        Back
      </Link>
      <h1 className="mt-4 text-2xl font-semibold">{slug}</h1>
      <p className="mt-2 text-neutral-600">Placeholder content route.</p>
    </main>
  );
};

export const Route = createFileRoute("/$slug")({
  component: ContentPage,
});
