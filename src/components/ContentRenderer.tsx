import type { RuntimeContentSection } from "@/content/content-schema";

import { mdxComponents } from "./mdx/MdxComponents";

type ContentRendererProps = {
  sections: RuntimeContentSection[];
};

export const ContentRenderer = ({ sections }: ContentRendererProps) => {
  return sections.map((section) => (
    <section.Component components={mdxComponents} key={section.order} />
  ));
};
