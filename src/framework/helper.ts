import { customAlphabet } from "nanoid";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

export const generateID = (length?: number) => customAlphabet(alphabet, length ?? 16)();

export function camelToPascalWithSpace(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between camelCase
    .replace(/([a-zA-Z])+/g, (match) => match.charAt(0).toUpperCase() + match.slice(1)); // Convert to PascalCase
}
