import { customAlphabet } from "nanoid";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

export const generateID = (length?: number) => customAlphabet(alphabet, length ?? 16)();

export function camelToPascalWithSpace(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between camelCase
    .replace(/([a-zA-Z])+/g, (match) => match.charAt(0).toUpperCase() + match.slice(1)); // Convert to PascalCase
}

export const extractArrayString = (values: any) => (Array.isArray(values) ? [...values] : values ? [values] : []);

export const extractNumber = (value: any, defaultValue?: any): number | undefined => {
  if (typeof value === "number" && !isNaN(value)) {
    return value;
  } else if (typeof value === "string") {
    const numericValue = +value;
    if (!isNaN(numericValue)) {
      return numericValue;
    }
  } else if (defaultValue) {
    return defaultValue;
  }
  return undefined;
};

export const extractBoolean = (value: any): boolean | undefined => {
  return value === "true" ? true : value === "false" ? false : undefined;
};
