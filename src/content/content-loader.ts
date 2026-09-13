import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";

import type {
  ContentIndex,
  ContentPage,
  ContentSection,
  PageMeta,
} from "./content-schema";

import {
  validateContentIndex,
  validatePageMeta,
  validateSectionMeta,
  type ValidationError,
} from "./content-validator";

const CONTENT_DIR = path.resolve(process.cwd(), "content");
const META_FILE = "_meta.mdx";

const discoverContentFolders = (): string[] => {
  if (!fs.existsSync(CONTENT_DIR)) {
    throw new Error(`Content directory not found: ${CONTENT_DIR}`);
  }

  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
};

const parseMetaFile = (
  folderName: string,
): { data: Record<string, unknown>; errors: ValidationError[] } => {
  const metaPath = path.join(CONTENT_DIR, folderName, META_FILE);

  if (!fs.existsSync(metaPath)) {
    return {
      data: {},
      errors: [{ folder: folderName, message: `Missing ${META_FILE}` }],
    };
  }

  const raw = fs.readFileSync(metaPath, "utf-8");
  const { data } = matter(raw);
  const errors = validatePageMeta(data, folderName);

  return { data, errors };
};

const discoverSections = (
  folderName: string,
): { errors: ValidationError[]; sections: ContentSection[] } => {
  const folderPath = path.join(CONTENT_DIR, folderName);
  const errors: ValidationError[] = [];

  const mdxFiles = fs
    .readdirSync(folderPath)
    .filter((file) => file.endsWith(".mdx") && file !== META_FILE)
    .sort();

  if (mdxFiles.length === 0) {
    errors.push({ folder: folderName, message: "No section MDX files found" });
    return { errors, sections: [] };
  }

  const sections: ContentSection[] = [];
  const ordersSeen = new Map<number, string>();

  for (const file of mdxFiles) {
    const filePath = path.join(folderPath, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);

    const fileErrors = validateSectionMeta(data, file, folderName);
    errors.push(...fileErrors);

    if (fileErrors.length === 0) {
      const order = data.order as number;

      if (ordersSeen.has(order)) {
        errors.push({
          folder: folderName,
          message: `Duplicate section order ${order} in "${file}" (also in "${ordersSeen.get(order)}")`,
        });
      } else {
        ordersSeen.set(order, file);
      }

      sections.push({
        filePath: path.join("content", folderName, file),
        order,
      });
    }
  }

  sections.sort((a, b) => a.order - b.order);

  return { errors, sections };
};

export const loadContentIndex = (): {
  errors: ValidationError[];
  index: ContentIndex;
} => {
  const allErrors: ValidationError[] = [];
  const pages: ContentPage[] = [];

  const folders = discoverContentFolders();

  for (const folderName of folders) {
    const { data, errors: metaErrors } = parseMetaFile(folderName);
    allErrors.push(...metaErrors);

    const { errors: sectionErrors, sections } = discoverSections(folderName);
    allErrors.push(...sectionErrors);

    if (metaErrors.length === 0) {
      pages.push({
        folderPath: path.join("content", folderName),
        meta: data as PageMeta,
        sections,
      });
    }
  }

  const crossErrors = validateContentIndex(
    pages.map((p) => ({
      folderName: path.basename(p.folderPath),
      meta: p.meta,
    })),
  );
  allErrors.push(...crossErrors);

  pages.sort((a, b) => a.meta.cardOrder - b.meta.cardOrder);

  return { errors: allErrors, index: { pages } };
};
