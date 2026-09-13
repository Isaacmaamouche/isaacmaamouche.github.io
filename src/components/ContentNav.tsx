import { contentIndex } from "@/content/generated-content";

import { NavItem } from "./NavItem";

type ContentNavProps = {
  activeSlug: string;
};

export const ContentNav = ({ activeSlug }: ContentNavProps) => {
  return (
    <nav aria-label="Content pages" className="flex flex-wrap gap-2">
      {contentIndex.pages.map((page) => (
        <NavItem
          active={page.meta.slug === activeSlug}
          key={page.meta.slug}
          params={{ slug: page.meta.slug }}
          to="/$slug"
        >
          {page.meta.cardLabel}
        </NavItem>
      ))}
    </nav>
  );
};
