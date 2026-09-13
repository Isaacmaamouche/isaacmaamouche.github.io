import type { ComponentType } from "react";

export type ContentIndex = {
  pages: ContentPage[];
};

export type ContentPage = {
  folderPath: string;
  meta: PageMeta;
  sections: ContentSection[];
};

/*
 * Build-time types (used by content-loader / generate script)
 */
export type ContentSection = {
  filePath: string;
  order: number;
};

export type ContentSectionMeta = {
  order: number;
};

export type PageMeta = {
  cardLabel: string;
  cardOrder: number;
  slug: string;
  title: string;
};

export type RuntimeContentIndex = {
  pages: RuntimeContentPage[];
};

export type RuntimeContentPage = {
  folderPath: string;
  meta: PageMeta;
  sections: RuntimeContentSection[];
};

/*
 * Runtime types (used by generated-content / route components)
 */
export type RuntimeContentSection = {
  Component: ComponentType<Record<string, unknown>>;
  order: number;
};
