import type { PageMeta } from "./content-schema";

export type ValidationError = {
  folder: string;
  message: string;
};

const URL_SAFE_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const validatePageMeta = (
  meta: Record<string, unknown>,
  folderName: string,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (typeof meta.slug !== "string" || meta.slug.length === 0) {
    errors.push({
      folder: folderName,
      message: "`slug` must be a non-empty string",
    });
  } else {
    if (!URL_SAFE_REGEX.test(meta.slug)) {
      errors.push({
        folder: folderName,
        message: `\`slug\` "${meta.slug}" contains non-URL-safe characters`,
      });
    }
    if (meta.slug !== folderName) {
      errors.push({
        folder: folderName,
        message: `\`slug\` "${meta.slug}" does not match folder name "${folderName}"`,
      });
    }
  }

  if (typeof meta.title !== "string") {
    errors.push({ folder: folderName, message: "`title` must be a string" });
  }

  if (typeof meta.cardLabel !== "string" || meta.cardLabel.length === 0) {
    errors.push({
      folder: folderName,
      message: "`cardLabel` must be a non-empty string",
    });
  }

  if (typeof meta.cardOrder !== "number" || !Number.isFinite(meta.cardOrder)) {
    errors.push({
      folder: folderName,
      message: "`cardOrder` must be a finite number",
    });
  }

  return errors;
};

export const validateSectionMeta = (
  meta: Record<string, unknown>,
  filePath: string,
  folderName: string,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (typeof meta.order !== "number" || !Number.isFinite(meta.order)) {
    errors.push({
      folder: folderName,
      message: `Section "${filePath}" must have a numeric \`order\``,
    });
  }

  return errors;
};

export const validateContentIndex = (
  pages: Array<{ folderName: string; meta: PageMeta }>,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  const slugs = new Map<string, string>();
  const cardOrders = new Map<number, string>();

  for (const { folderName, meta } of pages) {
    if (slugs.has(meta.slug)) {
      errors.push({
        folder: folderName,
        message: `Duplicate slug "${meta.slug}" (also in "${slugs.get(meta.slug)}")`,
      });
    } else {
      slugs.set(meta.slug, folderName);
    }

    if (cardOrders.has(meta.cardOrder)) {
      errors.push({
        folder: folderName,
        message: `Duplicate cardOrder ${meta.cardOrder} (also in "${cardOrders.get(meta.cardOrder)}")`,
      });
    } else {
      cardOrders.set(meta.cardOrder, folderName);
    }
  }

  return errors;
};
