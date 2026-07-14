import { images } from '@/assets/images';
import { tours } from '@/data/tours';
import { packages } from '@/data/packages';
import { experiences } from '@/data/experiences';
import { categories } from '@/data/categories';

const imageKeys = new Set(Object.keys(images));
const experienceIds = new Set(experiences.map((e) => e.id));
const tourIds = new Set(tours.map((t) => t.id));
const categoryIds = new Set(categories.map((c) => c.id));

function checkImage(label, key, violations) {
  if (key && !imageKeys.has(key)) violations.push(`${label}: unknown image key "${key}"`);
}

function checkExperienceIds(label, ids, violations) {
  for (const id of ids ?? []) {
    if (!experienceIds.has(id)) violations.push(`${label}: unknown experienceId "${id}"`);
  }
}

function checkCategory(label, category, violations) {
  if (category && !categoryIds.has(category)) violations.push(`${label}: unknown category "${category}"`);
}

// DEV-only referential-integrity check across the four hand-authored data
// files. Nothing here throws — a bad reference is a data bug worth fixing,
// not a reason to crash the app (that's the same lesson resolveImage()
// encodes for images specifically; this generalizes it to experienceIds,
// tourIds, and category ids). Call once, on app mount, behind
// import.meta.env.DEV so it's stripped from the PROD bundle entirely.
export function validateData() {
  const violations = [];

  for (const tour of tours) {
    const label = `tours.js: "${tour.id}"`;
    checkImage(label, tour.image, violations);
    for (const key of tour.gallery ?? []) checkImage(label, key, violations);
    checkCategory(label, tour.category, violations);
    checkExperienceIds(label, tour.includedExperienceIds, violations);
    for (const day of tour.itinerary ?? []) checkExperienceIds(`${label} day ${day.day}`, day.experienceIds, violations);
    for (const id of tour.relatedTourIds ?? []) {
      if (!tourIds.has(id)) violations.push(`${label}: unknown relatedTourId "${id}"`);
    }
  }

  for (const pkg of packages) {
    const label = `packages.js: "${pkg.id}"`;
    checkImage(label, pkg.image, violations);
    for (const key of pkg.gallery ?? []) checkImage(label, key, violations);
    checkCategory(label, pkg.category, violations);
    for (const id of pkg.includes ?? []) {
      if (!tourIds.has(id)) violations.push(`${label}: unknown includes tourId "${id}"`);
    }
  }

  for (const experience of experiences) {
    const label = `experiences.js: "${experience.id}"`;
    checkImage(label, experience.image, violations);
    checkCategory(label, experience.category, violations);
  }

  for (const category of categories) {
    checkImage(`categories.js: "${category.id}"`, category.image, violations);
  }

  if (violations.length > 0) {
    console.error(`[validateData] ${violations.length} data integrity violation(s):\n${violations.map((v) => `  - ${v}`).join('\n')}`);
  }
}
