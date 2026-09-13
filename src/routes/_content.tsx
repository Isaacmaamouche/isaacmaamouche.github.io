import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";

import { ContentNav } from "@/components/ContentNav";

const ContentLayout = () => {
  const { slug } = useParams({ from: "/_content/$slug" });

  return (
    <>
      <ContentNav activeSlug={slug} />
      <div className="mt-6">
        <Outlet />
      </div>
    </>
  );
};

export const Route = createFileRoute("/_content")({
  component: ContentLayout,
});
