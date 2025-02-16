import slugify from "slugify";

export function convertSlug(text: string) {
  return slugify(text, {
    replacement: "-",
    remove: /[*+~.()'"!:@$]/g,
    lower: true,
    strict: true,
  });
}
