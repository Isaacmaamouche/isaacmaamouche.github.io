export type ContentIndex = {
  pages: ContentPage[];
};

export type ContentPage = {
  folderPath: string;
  meta: PageMeta;
  sections: ContentSection[];
};

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
